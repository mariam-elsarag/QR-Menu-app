"use server";

import { prisma } from "@/src/lib/prisma";
import { RoleFormValues, RoleSchema } from "../schemas/team.scema";
import { authorize } from "@/src/lib/auth/authorize";

export async function createRole(values: RoleFormValues) {
  try {
    const auth = await authorize({
      permissions: ["role_create", "role_permissions_manage"],
    });

    if (!auth.success) {
      return {
        success: false,
        error:
          auth.error === "UNAUTHENTICATED" ? "UNAUTHORIZED" : "SERVER_ERROR",
      } as const;
    }
    const parsed = RoleSchema.safeParse(values);

    if (!parsed.success) {
      return { success: false, error: "VALIDATION_ERROR" } as const;
    }

    const { permissionIds, name } = parsed.data;
    const uniquePermissionIds = [...new Set(permissionIds)];

    const permissions = await prisma.permission.findMany({
      where: { id: { in: uniquePermissionIds } },
      select: { id: true },
    });

    if (permissions.length !== uniquePermissionIds.length) {
      return { success: false, error: "INVALID_PERMISSIONS" } as const;
    }

    const role = await prisma.role.create({
      data: {
        name,
        organizationId: auth.user.organizationId,
        permissions: {
          create: uniquePermissionIds.map((permissionId) => ({
            permission: {
              connect: { id: permissionId },
            },
          })),
        },
      },
      select: {
        id: true,
        name: true,
        type: true,
      },
    });

    return { success: true, data: role } as const;
  } catch (error: unknown) {
    console.error("Failed to create role:", error);

    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return { success: false, error: "ROLE_NAME_EXISTS" } as const;
    }

    if (
      error instanceof Error &&
      error.message.includes("UniqueConstraintViolation")
    ) {
      return { success: false, error: "ROLE_NAME_EXISTS" } as const;
    }

    return { success: false, error: "SERVER_ERROR" } as const;
  }
}
