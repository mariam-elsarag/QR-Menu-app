"use client";

import { Suspense, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";

const KEYS = {
  expired: "sessionExpired",
  expiredDescription: "sessionExpiredDescription",
  unavailable: "accountUnavailable",
  unavailableDescription: "accountUnavailableDescription",
} as const;

function SessionReasonToastContent() {
  const t = useTranslations("auth");
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const reason = searchParams.get("reason");

    const messages =
      reason === "session-expired"
        ? {
            error: t(KEYS.expired),
            info: t(KEYS.expiredDescription),
            errorId: "session-expired",
            infoId: "session-expired-description",
          }
        : reason === "account-unavailable"
          ? {
              error: t(KEYS.unavailable),
              info: t(KEYS.unavailableDescription),
              errorId: "account-unavailable",
              infoId: "account-unavailable-description",
            }
          : null;

    if (!messages) return;

    toast.error(messages.error, {
      toastId: messages.errorId,
      autoClose: 3000,
    });

    const timer = window.setTimeout(() => {
      toast.info(messages.info, {
        toastId: messages.infoId,
        autoClose: 4000,
      });
    }, 3200);

    router.replace(pathname, { scroll: false });

    return () => window.clearTimeout(timer);
  }, [pathname, router, searchParams, t]);

  return null;
}

export default function SessionReasonToast() {
  return (
    <Suspense fallback={null}>
      <SessionReasonToastContent />
    </Suspense>
  );
}
