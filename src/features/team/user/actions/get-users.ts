"use server";

import { Prisma, RoleType, UserStatus } from "@/app/generated/prisma/client";
import { authorize } from "@/src/lib/auth/authorize";
import { prisma } from "@/src/lib/prisma";
import { AuthError } from "@/src/lib/auth/auth-error";

import type { GetUsersResult, GetUserssParams } from "../typse/types";

export async function getUsers({
  page = 1,
  pageSize = 10,
  search = "",
  role = "",
}: GetUserssParams = {}): Promise<GetUsersResult> {
  try {
    const auth = await authorize({
      permissions: ["user_view"],
    });

    if (!auth.success) {
      return {
        success: false,
        error:
          auth.error === "UNAUTHENTICATED" ? "UNAUTHORIZED" : "SERVER_ERROR",
      } as const;
    }

    const safePage = Number.isSafeInteger(page) && page > 0 ? page : 1;

    const safePageSize =
      Number.isSafeInteger(pageSize) && pageSize > 0
        ? Math.min(pageSize, 100)
        : 10;

    const searchTerm = search.trim();

    const where: Prisma.UserWhereInput = {
      organizationId: auth.organizationId,
      role: {
        type: {
          not: RoleType.OWNER,
        },
      },
      ...(role && { roleId: role }),
      ...(searchTerm && {
        OR: [
          {
            fullName: {
              contains: searchTerm,
              mode: "insensitive",
            },
          },
          {
            email: {
              contains: searchTerm,
              mode: "insensitive",
            },
          },
          {
            phone: {
              contains: searchTerm,
            },
          },
        ],
      }),
    };

    const [users, total] = await prisma.$transaction([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          fullName: true,
          email: true,
          phone: true,
          status: true,
          role: {
            select: {
              id: true,
              name: true,
            },
          },
          invitations: {
            select: {
              id: true,
              expiresAt: true,
              usedAt: true,
              createdAt: true,
            },
            orderBy: {
              createdAt: "desc",
            },
            take: 1,
          },
        },
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        skip: (safePage - 1) * safePageSize,
        take: safePageSize,
      }),

      prisma.user.count({ where }),
    ]);

    const now = new Date();

    const data = users.map((user) => {
      const latestInvitation = user.invitations[0];

      let invitationStatus: "NOT_SENT" | "PENDING" | "EXPIRED" | "ACCEPTED" =
        "NOT_SENT";

      if (user.status === UserStatus.ACTIVE) {
        invitationStatus = "ACCEPTED";
      } else if (latestInvitation) {
        if (latestInvitation.usedAt) {
          invitationStatus = "ACCEPTED";
        } else if (latestInvitation.expiresAt <= now) {
          invitationStatus = "EXPIRED";
        } else {
          invitationStatus = "PENDING";
        }
      }

      return {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        status: user.status,
        role: user.role.name,
        invitationStatus,
        canResendInvitation:
          user.status === UserStatus.PENDING && invitationStatus !== "ACCEPTED",
      };
    });

    return {
      success: true,
      page: safePage,
      count: total,
      pages: Math.ceil(total / safePageSize),
      data,
    } as const;
  } catch (error) {
    if (error instanceof AuthError && error.message === "PERMISSION_DENIED") {
      return {
        success: false,
        error: "PERMISSION_DENIED",
      } as const;
    }

    console.error("Failed to get users:", error);

    return {
      success: false,
      error: "SERVER_ERROR",
    } as const;
  }
}
