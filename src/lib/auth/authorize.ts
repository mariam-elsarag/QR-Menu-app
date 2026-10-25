import "server-only";

import { requireAuth } from "./require-auth";
import { requireOrganizationAccess } from "./require-organization-access";
import { requirePermissions } from "./require-permission";

type AuthorizeOptions = {
  permissions?: string[];
};

export async function authorize({ permissions = [] }: AuthorizeOptions = {}) {
  const auth = await requireAuth();

  if (!auth.success) {
    return auth;
  }

  const user = await requireOrganizationAccess(auth.user);

  await requirePermissions(permissions, user);

  return {
    success: true as const,
    user,
    organizationId: user.organizationId,
  };
}
