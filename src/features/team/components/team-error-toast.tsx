"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { toast } from "react-toastify";

type TeamErrorToastProps = {
  message: string;
};

export function TeamErrorToast({ message }: TeamErrorToastProps) {
  const t = useTranslations();
  useEffect(() => {
    toast.error(t(message));
  }, [message]);

  return null;
}
