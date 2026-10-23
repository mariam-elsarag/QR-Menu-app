"use server";

import { createHash } from "node:crypto";
import { SignJWT } from "jose";

import { prisma } from "@/src/lib/prisma";
import { routing } from "@/src/i18n/routing";
import { forgetPasswordSchema } from "../schemas/auth.schema";
import { sendPasswordResetEmail } from "@/src/lib/email";

type ForgetPasswordResult =
  | { success: true }
  | {
      success: false;
      error: "VALIDATION_ERROR" | "SERVER_ERROR";
    };

export async function forgetPasswordAction(
  values: unknown,
  locale: string,
): Promise<ForgetPasswordResult> {
  try {
    const parsed = forgetPasswordSchema.safeParse(values);

    if (!parsed.success) {
      return { success: false, error: "VALIDATION_ERROR" };
    }

    if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
      return { success: false, error: "VALIDATION_ERROR" };
    }

    const email = parsed.data.email.trim().toLowerCase();

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
      },
    });

    if (!user) {
      return { success: true };
    }

    const secret = process.env.FORGET_PASSWORD_SECRET;
    const appUrl = process.env.APP_URL;

    if (!secret || !appUrl) {
      throw new Error("Password reset configuration is missing");
    }

    const token = await new SignJWT({
      userId: user.id,
      purpose: "password-reset",
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("15m")
      .sign(new TextEncoder().encode(secret));

    const tokenHash = createHash("sha256").update(token).digest("hex");

    await prisma.user.update({
      where: { id: user.id },
      data: {
        forgetPasswordToken: tokenHash,
        forgetPasswordTokenCreatedAt: new Date(),
      },
    });

    const resetUrl = new URL(`/${locale}/reset-password`, appUrl);
    resetUrl.searchParams.set("token", token);

    await sendPasswordResetEmail(user.email, resetUrl.toString());

    return { success: true };
  } catch (error) {
    console.error("Forget password failed:", error);

    return { success: false, error: "SERVER_ERROR" };
  }
}
