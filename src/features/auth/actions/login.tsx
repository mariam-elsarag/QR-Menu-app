"use server";

import { cookies } from "next/headers";
import { SignJWT } from "jose";
import { compare } from "bcryptjs";

import { loginSchema } from "../schemas/auth.schema";
import { prisma } from "@/src/lib/prisma";
import {
  SESSION_COOKIE_NAME,
  SESSION_ALGORITHM,
  getSessionSecret,
} from "@/src/lib/auth/auth-config";
import { UserStatus } from "@/app/generated/prisma/enums";

type LoginResult =
  | { success: true }
  | {
      success: false;
      error: "INVALID_CREDENTIALS" | "VALIDATION_ERROR" | "SERVER_ERROR";
    };

export async function loginAction(values: unknown): Promise<LoginResult> {
  try {
    const parsed = loginSchema.safeParse(values);

    if (!parsed.success) {
      return { success: false, error: "VALIDATION_ERROR" };
    }

    const { email, password, rememberMe } = parsed.data;

    const user = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
      select: {
        id: true,
        email: true,
        passwordHash: true,
        status: true,
        organizationId: true,
        roleId: true,
        sessionVersion: true,
      },
    });
    if (!user?.passwordHash) {
      return { success: false, error: "INVALID_CREDENTIALS" };
    }
    if (
      !user ||
      user.status !== UserStatus.ACTIVE ||
      !(await compare(password, user.passwordHash))
    ) {
      return { success: false, error: "INVALID_CREDENTIALS" };
    }

    if (!user.organizationId || !user.roleId) {
      return { success: false, error: "INVALID_CREDENTIALS" };
    }

    const organization = await prisma.organization.findUnique({
      where: { id: user.organizationId },
      select: { deletedAt: true },
    });

    if (!organization || organization.deletedAt) {
      return { success: false, error: "INVALID_CREDENTIALS" };
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        sessionVersion: { increment: 1 },
      },
      select: {
        id: true,
        organizationId: true,
        sessionVersion: true,
      },
    });

    const maxAge = rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24;

    const token = await new SignJWT({
      sessionVersion: updatedUser.sessionVersion,
    })
      .setProtectedHeader({ alg: SESSION_ALGORITHM })
      .setSubject(updatedUser.id)
      .setIssuedAt()
      .setExpirationTime(rememberMe ? "30d" : "1d")
      .sign(getSessionSecret());

    const cookieStore = await cookies();

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/",
      maxAge,
    };

    cookieStore.set(SESSION_COOKIE_NAME, token, cookieOptions);

    cookieStore.set("organization", updatedUser.organizationId, cookieOptions);

    return { success: true };
  } catch (error) {
    console.error("Login action failed:", error);

    return { success: false, error: "SERVER_ERROR" };
  }
}
