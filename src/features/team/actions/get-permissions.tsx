"use server";

import { prisma } from "@/src/lib/prisma";
import { AuthError } from "@/src/lib/auth/auth-error";
import { authorize } from "@/src/lib/auth/authorize";

export type PermissionItem = {
  id: string;
  key: string;
};

export type GetPermissionsResult =
  | {
      success: true;
      data: PermissionItem[];
    }
  | {
      success: false;
      error: "UNAUTHORIZED" | "PERMISSION_DENIED" | "SERVER_ERROR";
    };

export async function getPermissions(): Promise<GetPermissionsResult> {
  try {
    const auth = await authorize({
      permissions: ["role_create", "role_permissions_manage"],
    });

    if (!auth.success) {
      return {
        success: false,
        error:
          auth.error === "UNAUTHENTICATED" ? "UNAUTHORIZED" : "SERVER_ERROR",
      };
    }

    const permissions = await prisma.permission.findMany({
      select: {
        id: true,
        key: true,
      },
      orderBy: {
        key: "asc",
      },
    });

    return {
      success: true,
      data: permissions,
    };
  } catch (error: unknown) {
    if (error instanceof AuthError) {
      if (error.message === "UNAUTHORIZED") {
        return {
          success: false,
          error: "UNAUTHORIZED",
        };
      }

      if (error.message === "PERMISSION_DENIED") {
        return {
          success: false,
          error: "PERMISSION_DENIED",
        };
      }
    }

    console.error("Failed to fetch permissions:", error);

    return {
      success: false,
      error: "SERVER_ERROR",
    };
  }
}
