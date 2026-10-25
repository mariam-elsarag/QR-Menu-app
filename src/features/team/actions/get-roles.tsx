"use server";

import { AuthError } from "@/src/lib/auth/auth-error";
import { authorize } from "@/src/lib/auth/authorize";
import { prisma } from "@/src/lib/prisma";
import { GetRolesParams, GetRolesResult } from "../type/types";
import { RoleType } from "@/app/generated/prisma/enums";

export async function getRoles({
  page = 1,
  pageSize = 10,
  search = "",
}: GetRolesParams = {}): Promise<GetRolesResult> {
  try {
    const auth = await authorize({
      permissions: ["role_view"],
    });

    if (!auth.success) {
      return {
        success: false,
        error:
          auth.error === "UNAUTHENTICATED" ? "UNAUTHORIZED" : "SERVER_ERROR",
      };
    }

    const safePage = Number.isSafeInteger(page) && page > 0 ? page : 1;
    const safePageSize =
      Number.isSafeInteger(pageSize) && pageSize > 0
        ? Math.min(pageSize, 100)
        : 10;

    const searchTerm = search.trim();
    const where = {
      organizationId: auth.organizationId,
      type: {
        not: RoleType.OWNER,
      },
      ...(searchTerm && {
        name: {
          contains: searchTerm,
          mode: "insensitive" as const,
        },
      }),
    };
    const [roles, total] = await prisma.$transaction([
      prisma.role.findMany({
        where,
        select: {
          id: true,
          name: true,
          type: true,
          permissions: {
            select: {
              permission: {
                select: {
                  key: true,
                },
              },
            },
          },
        },
        orderBy: [{ name: "asc" }, { id: "asc" }],
        skip: (safePage - 1) * safePageSize,
        take: safePageSize,
      }),

      prisma.role.count({
        where,
      }),
    ]);

    const totalPages = Math.ceil(total / safePageSize);

    return {
      success: true,
      data: roles.map((role) => ({
        id: role.id,
        name: role.name,
        type: role.type,
        permissions: role.permissions.map(
          (rolePermission) => rolePermission.permission.key,
        ),
        permissionCount: role.permissions.length,
      })),
      page: safePage,
      count: total,
      pages: totalPages,
    };
  } catch (error: unknown) {
    if (error instanceof AuthError && error.message === "PERMISSION_DENIED") {
      return {
        success: false,
        error: "PERMISSION_DENIED",
      };
    }

    console.error("Failed to get roles:", error);

    return {
      success: false,
      error: "SERVER_ERROR",
    };
  }
}
