"use server";

import { Prisma, RoleType, UserStatus } from "@/app/generated/prisma/client";
import { authorize } from "@/src/lib/auth/authorize";
import { prisma } from "@/src/lib/prisma";

import { UserSchema } from "../schemas/create-user.schema";
import { createUserInvitation } from "../services/invitation.service";
import { CreateUserResult } from "../typse/types";

type CreateUserInput = {
  fullName: string;
  email: string;
  phone: string;
  roleId: string;
};

export async function createUser(
  input: CreateUserInput,
  locale: "en" | "ar" = "en",
): Promise<CreateUserResult> {
  try {
    const auth = await authorize({
      permissions: ["user_create"],
    });

    if (!auth.success) {
      return {
        success: false,
        error:
          auth.error === "UNAUTHENTICATED" ? "UNAUTHORIZED" : "SERVER_ERROR",
      };
    }

    const parsed = UserSchema.safeParse(input);

    if (!parsed.success) {
      return {
        success: false,
        error: "VALIDATION_ERROR",
      };
    }

    const { email, phone, roleId } = parsed.data;

    const role = await prisma.role.findFirst({
      where: {
        id: roleId,
        organizationId: auth.organizationId,
        type: {
          not: RoleType.OWNER,
        },
      },
      select: {
        id: true,
      },
    });

    if (!role) {
      return {
        success: false,
        error: "INVALID_ROLE",
      };
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { phone }],
      },
      select: {
        email: true,
        phone: true,
      },
    });

    if (existingUser) {
      return {
        success: false,
        error:
          existingUser.email === email
            ? "EMAIL_ALREADY_EXISTS"
            : "PHONE_ALREADY_EXISTS",
      };
    }

    const user = await prisma.user.create({
      data: {
        email,
        fullName,
        phone,
        roleId,
        organizationId: auth.organizationId,
        status: UserStatus.PENDING,
        passwordHash: null,
      },
      select: {
        id: true,
      },
    });

    try {
      await createUserInvitation({
        userId: user.id,
        email,
        locale,
      });
    } catch (error) {
      console.error("Failed to send user invitation:", error);

      return {
        success: false,
        error: "INVITATION_FAILED",
      };
    }

    return {
      success: true,
      userId: user.id,
    };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      const target = error.meta?.target;
      const fields = Array.isArray(target)
        ? target.map(String)
        : [String(target ?? "")];

      return {
        success: false,
        error: fields.some((field) => field.includes("phone"))
          ? "PHONE_ALREADY_EXISTS"
          : "EMAIL_ALREADY_EXISTS",
      };
    }

    console.error("Failed to create user:", error);

    return {
      success: false,
      error: "SERVER_ERROR",
    };
  }
}
