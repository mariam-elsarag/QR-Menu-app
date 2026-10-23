"use server";

import { createHash } from "node:crypto";
import { compare, hash } from "bcryptjs";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

import { prisma } from "@/src/lib/prisma";
import {
  resetPasswordSchema,
  changePasswordSchema,
} from "../schemas/auth.schema";

type PasswordActionResult =
  | { success: true }
  | {
      success: false;
      error:
        | "VALIDATION_ERROR"
        | "INVALID_TOKEN"
        | "INVALID_PASSWORD"
        | "UNAUTHORIZED"
        | "SERVER_ERROR";
    };

const RESET_TOKEN_EXPIRY_MS = 15 * 60 * 1000;

export async function changePasswordAction(
  values: unknown,
  token: string | null,
  type: "change" | "reset",
): Promise<PasswordActionResult> {
  try {
    if (type === "reset") {
      const parsed = resetPasswordSchema.safeParse(values);

      if (!parsed.success || !token) {
        return {
          success: false,
          error: !parsed.success ? "VALIDATION_ERROR" : "INVALID_TOKEN",
        };
      }

      const secret = process.env.FORGET_PASSWORD_SECRET;

      if (!secret) {
        throw new Error("errors.passwordResetConfigurationMissing");
      }

      let userId: string;

      try {
        const { payload } = await jwtVerify(
          token,
          new TextEncoder().encode(secret),
          { algorithms: ["HS256"] },
        );

        if (
          payload.purpose !== "password-reset" ||
          typeof payload.userId !== "string"
        ) {
          return { success: false, error: "INVALID_TOKEN" };
        }

        userId = payload.userId;
      } catch {
        return { success: false, error: "INVALID_TOKEN" };
      }

      const tokenHash = createHash("sha256").update(token).digest("hex");

      const expiresAfter = new Date(Date.now() - RESET_TOKEN_EXPIRY_MS);

      const newPasswordHash = await hash(parsed.data.newPassword, 12);

      const result = await prisma.user.updateMany({
        where: {
          id: userId,
          forgetPasswordToken: tokenHash,
          forgetPasswordTokenCreatedAt: {
            gt: expiresAfter,
          },
        },
        data: {
          passwordHash: newPasswordHash,
          forgetPasswordToken: null,
          forgetPasswordTokenCreatedAt: null,
        },
      });

      if (result.count !== 1) {
        return { success: false, error: "INVALID_TOKEN" };
      }

      return { success: true };
    }

    const parsed = changePasswordSchema.safeParse(values);

    if (!parsed.success) {
      return { success: false, error: "VALIDATION_ERROR" };
    }

    const sessionSecret = process.env.SESSION_SECRET;

    if (!sessionSecret) {
      throw new Error("errors.passwordChangeConfigurationMissing");
    }

    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session")?.value;

    if (!sessionToken) {
      return { success: false, error: "UNAUTHORIZED" };
    }

    let userId: string;

    try {
      const { payload } = await jwtVerify(
        sessionToken,
        new TextEncoder().encode(sessionSecret),
        { algorithms: ["HS256"] },
      );

      if (typeof payload.userId !== "string") {
        return { success: false, error: "UNAUTHORIZED" };
      }

      userId = payload.userId;
    } catch {
      return { success: false, error: "UNAUTHORIZED" };
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        passwordHash: true,
      },
    });

    if (!user) {
      return { success: false, error: "UNAUTHORIZED" };
    }

    // Verify the user's current password.
    const isPasswordValid = await compare(
      parsed.data.password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      return { success: false, error: "INVALID_PASSWORD" };
    }

    const newPasswordHash = await hash(parsed.data.newPassword, 12);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: newPasswordHash,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Change password failed:", error);

    return { success: false, error: "SERVER_ERROR" };
  }
}
