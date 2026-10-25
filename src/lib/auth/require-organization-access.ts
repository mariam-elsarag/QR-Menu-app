import "server-only";

import { requireAuth, type AuthenticatedUser } from "./require-auth";
import { AuthError } from "./auth-error";

export async function requireOrganizationAccess(user?: AuthenticatedUser) {
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

  if (!currentUser.organizationId) {
    throw new AuthError("ORGANIZATION_UNAVAILABLE", 403);
  }

  return currentUser;
}
