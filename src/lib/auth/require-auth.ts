import "server-only";

import { cache } from "react";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

import { prisma } from "@/src/lib/prisma";
import {
  SESSION_ALGORITHM,
  SESSION_COOKIE_NAME,
  getSessionSecret,
} from "./auth-config";

type AuthenticatedUser = {
  id: string;
  email: string;
  organizationId: string;
  roleId: string;
  roleType: string;
};

type RequireAuthResult =
  | { success: true; user: AuthenticatedUser }
  | {
      success: false;
      error:
        | "UNAUTHENTICATED"
        | "ORGANIZATION_UNAVAILABLE"
        | "INVALID_USER_ROLE"
        | "SERVER_ERROR";
    };

export const requireAuth = cache(
  async function requireAuth(): Promise<RequireAuthResult> {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (!token) {
      return { success: false, error: "UNAUTHENTICATED" };
    }

    let userId: string;
    let sessionVersion: number;

    try {
      const { payload } = await jwtVerify(token, getSessionSecret(), {
        algorithms: [SESSION_ALGORITHM],
      });

      if (
        typeof payload.sub !== "string" ||
        !payload.sub ||
        typeof payload.sessionVersion !== "number" ||
        !Number.isSafeInteger(payload.sessionVersion) ||
        payload.sessionVersion < 0 ||
        typeof payload.exp !== "number"
      ) {
        return { success: false, error: "UNAUTHENTICATED" };
      }

      userId = payload.sub;
      sessionVersion = payload.sessionVersion;
    } catch {
      return { success: false, error: "UNAUTHENTICATED" };
    }

    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          isActive: true,
          sessionVersion: true,
          organizationId: true,
          roleId: true,
          organization: {
            select: {
              deletedAt: true,
            },
          },
          role: {
            select: {
              type: true,
              organizationId: true,
            },
          },
        },
      });

      if (!user || !user.isActive) {
        return { success: false, error: "UNAUTHENTICATED" };
      }

      if (user.sessionVersion !== sessionVersion) {
        return { success: false, error: "UNAUTHENTICATED" };
      }

      if (user.organization.deletedAt) {
        return {
          success: false,
          error: "ORGANIZATION_UNAVAILABLE",
        };
      }

      if (user.role.organizationId !== user.organizationId) {
        return { success: false, error: "INVALID_USER_ROLE" };
      }

      return {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          organizationId: user.organizationId,
          roleId: user.roleId,
          roleType: user.role.type,
        },
      };
    } catch {
      return { success: false, error: "SERVER_ERROR" };
    }
  },
);

export type { AuthenticatedUser, RequireAuthResult };
