import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";

import { requireAuth } from "@/src/lib/auth/require-auth";
import DashboardWrapper from "@/components/dashboard/dashboard-wrapper";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const result = await requireAuth();
  const locale = await getLocale();

  if (!result.success) {
    if (result.error === "UNAUTHENTICATED") {
      redirect(`/${locale}/login?reason=session-expired`);
    }

    if (
      result.error === "ORGANIZATION_UNAVAILABLE" ||
      result.error === "INVALID_USER_ROLE"
    ) {
      redirect(`/${locale}/403`);
    }
    console.log(result.error, "failed");
    // throw new Error("Failed to validate the current session");
  }

  return <DashboardWrapper>{children}</DashboardWrapper>;
}
