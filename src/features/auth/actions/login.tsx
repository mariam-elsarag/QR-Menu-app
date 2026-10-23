"use server";

import { cookies } from "next/headers";
import { SignJWT } from "jose";
import { compare } from "bcryptjs";

import { loginSchema } from "../schemas/auth.schema";
import { prisma } from "@/src/lib/prisma";

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
      where: { email: email.toLowerCase().trim() },
    });

    if (!user || !(await compare(password, user.passwordHash))) {
      return { success: false, error: "INVALID_CREDENTIALS" };
    }

    const secret = process.env.SESSION_SECRET;

    if (!secret) {
      throw new Error("SESSION_SECRET is not configured");
    }

    const key = new TextEncoder().encode(secret);

    const token = await new SignJWT({
      userId: user.id,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(rememberMe ? "30d" : "1d")
      .sign(key);

    const cookieStore = await cookies();

    cookieStore.set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24,
    });

    return { success: true };
  } catch (error) {
    console.error("Login action failed:", error);

    return { success: false, error: "SERVER_ERROR" };
  }
}
