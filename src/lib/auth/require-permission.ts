import "server-only";

import { prisma } from "@/src/lib/prisma";
import { requireAuth, type AuthenticatedUser } from "./require-auth";
import { AuthError } from "./auth-error";

const PERMISSION_DEPENDENCIES: Record<string, string[]> = {
  category_create: ["category_view"],
  category_update: ["category_view"],
  category_delete: ["category_view"],

  product_create: ["product_view"],
  product_update: ["product_view"],
  product_delete: ["product_view"],

  branch_create: ["branch_view"],
  branch_update: ["branch_view"],
  branch_delete: ["branch_view"],

  discount_create: ["discount_view"],
  discount_update: ["discount_view"],
  discount_delete: ["discount_view"],

  promotion_create: ["promotion_view"],
  promotion_update: ["promotion_view"],
  promotion_delete: ["promotion_view"],

  user_create: ["user_view"],
  user_update: ["user_view"],
  user_deactivate: ["user_view"],

  role_create: ["role_view"],
  role_update: ["role_view"],
  role_delete: ["role_view"],
  role_permissions_manage: ["role_view"],

  organization_update: ["organization_view"],
  settings_update: ["settings_view"],
};

export async function requirePermissions(
  permissions: string[],
  user?: AuthenticatedUser,
): Promise<AuthenticatedUser> {
  let currentUser: AuthenticatedUser;

  if (user) {
    currentUser = user;
  } else {
    const auth = await requireAuth();

    if (!auth.success) {
      throw new AuthError(auth.error, 401);
    }

    currentUser = auth.user;
  }

  if (currentUser.roleType === "OWNER") {
    return currentUser;
  }

  const requiredPermissions = [
    ...new Set(
      permissions.flatMap((permission) => [
        permission,
        ...(PERMISSION_DEPENDENCIES[permission] ?? []),
      ]),
    ),
  ];

  if (requiredPermissions.length === 0) {
    return currentUser;
  }

  const grantedPermissions = await prisma.rolePermission.findMany({
    where: {
      roleId: currentUser.roleId,
      permission: {
        key: {
          in: requiredPermissions,
        },
      },
    },
    select: {
      permission: {
        select: {
          key: true,
        },
      },
    },
  });

  const grantedKeys = new Set(
    grantedPermissions.map((item) => item.permission.key),
  );

  const hasAllPermissions = requiredPermissions.every((permission) =>
    grantedKeys.has(permission),
  );

  if (!hasAllPermissions) {
    throw new AuthError("PERMISSION_DENIED", 403);
  }

  return currentUser;
}

export async function requirePermission(
  permission: string,
  user?: AuthenticatedUser,
): Promise<AuthenticatedUser> {
  return requirePermissions([permission], user);
}
