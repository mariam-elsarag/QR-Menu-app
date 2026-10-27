import "server-only";

import { createHash, randomBytes } from "node:crypto";
import { hash } from "bcryptjs";

import { prisma } from "@/src/lib/prisma";
import { UserStatus } from "@/app/generated/prisma/enums";
import { sendInvitationEmail } from "@/src/lib/email/send-invitation";

const INVITATION_EXPIRY_HOURS = 24;

function generateInvitationToken() {
  const token = randomBytes(32).toString("hex");

  const tokenHash = createHash("sha256").update(token).digest("hex");

  return { token, tokenHash };
}

function hashInvitationToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function getInvitationUrl(token: string, locale: "en" | "ar") {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  if (!appUrl) {
    throw new Error("NEXT_PUBLIC_APP_URL is not configured");
  }

  const url = new URL(`/${locale}/${token}/accept-invitation`, appUrl);

  return url.toString();
}

/**
 * Creates and emails an invitation for an existing pending user.
 * The original token is sent by email and never stored in the database.
 */
export async function createUserInvitation({
  userId,
  email,
  locale,
}: {
  userId: string;
  email: string;
  locale: "en" | "ar";
}) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      status: true,
      passwordHash: true,
    },
  });

  if (!user) {
    return { success: false as const, error: "USER_NOT_FOUND" as const };
  }

  if (user.status !== UserStatus.PENDING || user.passwordHash !== null) {
    return {
      success: false as const,
      error: "USER_NOT_PENDING" as const,
    };
  }

  const { token, tokenHash } = generateInvitationToken();

  const expiresAt = new Date(
    Date.now() + INVITATION_EXPIRY_HOURS * 60 * 60 * 1000,
  );

  const invitation = await prisma.userInvitation.create({
    data: {
      userId: user.id,
      tokenHash,
      expiresAt,
    },
    select: { id: true },
  });

  try {
    await sendInvitationEmail({
      email: user.email,
      invitationUrl: getInvitationUrl(token, locale),
      expiresAt,
    });

    return { success: true as const };
  } catch (error) {
    await prisma.userInvitation.deleteMany({
      where: { id: invitation.id },
    });

    throw error;
  }
}

export async function acceptUserInvitation({
  token,
  password,
}: {
  token: string;
  password: string;
}) {
  if (!token || !/^[a-f0-9]{64}$/i.test(token)) {
    return {
      success: false as const,
      error: "INVALID_OR_EXPIRED_INVITATION" as const,
    };
  }

  const tokenHash = hashInvitationToken(token);
  const now = new Date();

  const passwordHash = await hash(password, 12);

  try {
    await prisma.$transaction(async (tx) => {
      const invitation = await tx.userInvitation.findUnique({
        where: { tokenHash },
        select: {
          id: true,
          userId: true,
          expiresAt: true,
          usedAt: true,
          user: {
            select: {
              status: true,
              passwordHash: true,
            },
          },
        },
      });

      if (
        !invitation ||
        invitation.usedAt !== null ||
        invitation.expiresAt <= now ||
        invitation.user.status !== UserStatus.PENDING ||
        invitation.user.passwordHash !== null
      ) {
        throw new Error("INVALID_OR_EXPIRED_INVITATION");
      }

      const consumed = await tx.userInvitation.updateMany({
        where: {
          id: invitation.id,
          usedAt: null,
          expiresAt: { gt: now },
        },
        data: { usedAt: now },
      });

      if (consumed.count !== 1) {
        throw new Error("INVALID_OR_EXPIRED_INVITATION");
      }

      const activated = await tx.user.updateMany({
        where: {
          id: invitation.userId,
          status: UserStatus.PENDING,
          passwordHash: null,
        },
        data: {
          passwordHash,
          status: UserStatus.ACTIVE,
          sessionVersion: { increment: 1 },
        },
      });

      if (activated.count !== 1) {
        throw new Error("INVALID_OR_EXPIRED_INVITATION");
      }
    });

    return { success: true as const };
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "INVALID_OR_EXPIRED_INVITATION"
    ) {
      return {
        success: false as const,
        error: "INVALID_OR_EXPIRED_INVITATION" as const,
      };
    }

    console.error("Failed to accept user invitation:", error);

    return { success: false as const, error: "SERVER_ERROR" as const };
  }
}
