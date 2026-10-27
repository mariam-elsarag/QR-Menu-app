"use server";

import { z } from "zod";
import { acceptInvitationSchema } from "@/src/features/auth/schemas/auth.schema";
import { acceptUserInvitation } from "../../user/services/invitation.service";

type AcceptInvitationResult =
  | { success: true }
  | {
      success: false;
      error:
        | "VALIDATION_ERROR"
        | "INVALID_TOKEN"
        | "INVALID_PASSWORD"
        | "SERVER_ERROR";
    };

export async function acceptInvitationAction(
  values: {
    password?: string;
    newPassword: string;
    confirmPassword: string;
  },
  token: string | null,
): Promise<AcceptInvitationResult> {
  try {
    if (!token) {
      return { success: false, error: "INVALID_TOKEN" };
    }

    const parsed = acceptInvitationSchema.safeParse(values);

    if (!parsed.success) {
      return { success: false, error: "VALIDATION_ERROR" };
    }

    await acceptUserInvitation({
      token,
      password: parsed.data.newPassword,
    });

    return { success: true };
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "INVALID_INVITATION_TOKEN"
    ) {
      return { success: false, error: "INVALID_TOKEN" };
    }

    if (
      error instanceof Error &&
      error.message === "INVALID_INVITATION_PASSWORD"
    ) {
      return { success: false, error: "INVALID_PASSWORD" };
    }

    console.error("Failed to accept invitation:", error);

    return { success: false, error: "SERVER_ERROR" };
  }
}
