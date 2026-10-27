"use client";

import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import type { InvitationStatus } from "../typse/types";

type InvitationStatusBadgeProps = {
  status: InvitationStatus;
};

const statusVariants: Record<
  InvitationStatus,
  "active" | "pending" | "destructive" | "default"
> = {
  NOT_SENT: "default",
  PENDING: "pending",
  EXPIRED: "destructive",
  ACCEPTED: "active",
};

export default function InvitationStatusBadge({
  status,
}: InvitationStatusBadgeProps) {
  const t = useTranslations();

  return <Badge variant={statusVariants[status]}>{t(status)}</Badge>;
}
