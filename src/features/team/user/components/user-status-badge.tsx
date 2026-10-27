"use client";

import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import type { UserStatus } from "@/app/generated/prisma/enums";

type UserStatusBadgeProps = {
  status: UserStatus;
};

const statusVariants: Record<UserStatus, "active" | "pending" | "destructive"> =
  {
    ACTIVE: "active",
    PENDING: "pending",
    SUSPENDED: "destructive",
  };

export default function UserStatusBadge({ status }: UserStatusBadgeProps) {
  const t = useTranslations();

  return <Badge variant={statusVariants[status]}>{t(status)}</Badge>;
}
