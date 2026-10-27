export type CreateUserResult =
  | { success: true; userId: string }
  | {
      success: false;
      error:
        | "UNAUTHORIZED"
        | "PERMISSION_DENIED"
        | "VALIDATION_ERROR"
        | "EMAIL_ALREADY_EXISTS"
        | "PHONE_ALREADY_EXISTS"
        | "INVALID_ROLE"
        | "INVITATION_FAILED"
        | "SERVER_ERROR";
    };

export type GetUserssParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  role?: string;
};

import type { UserStatus } from "@/app/generated/prisma/enums";

export type InvitationStatus = "NOT_SENT" | "PENDING" | "EXPIRED" | "ACCEPTED";

export type UserItemType = {
  id: string;
  fullName: string | null;
  email: string;
  phone: string;
  status: UserStatus;
  role: string;
  invitationStatus: InvitationStatus;
  canResendInvitation: boolean;
};

export type GetUsersResult =
  | {
      success: true;
      data: UserItemType[];
      page: number;
      count: number;
      pages: number;
    }
  | {
      success: false;
      error: "UNAUTHORIZED" | "PERMISSION_DENIED" | "SERVER_ERROR";
    };
