"use client";

import { UtensilsCrossed } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
type LogoProps = {
  to?: string;
};
const Logo = ({ to = "/" }: LogoProps) => {
  const t = useTranslations();
  const locale = useLocale();
  const isArabic = locale === "ar";

  return (
    <Link
      href={to}
      aria-label={t("menu")}
      className="group inline-flex items-center gap-2.5"
    >
      <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-colors group-hover:bg-primary/90">
        <UtensilsCrossed
          aria-hidden="true"
          className="size-5"
          strokeWidth={1.7}
        />
      </span>

      <span className="flex flex-col gap-1">
        <span
          className={
            isArabic
              ? "font-arabic text-[21px] font-medium leading-normal text-foreground"
              : "font-display text-2xl font-semibold leading-none tracking-tight text-foreground"
          }
        >
          {t("menu")}
        </span>

        <span
          className={
            isArabic
              ? "font-arabic text-[11px] font-normal leading-normal text-muted-foreground"
              : "text-[9px] font-medium uppercase tracking-[0.16em] text-muted-foreground"
          }
        >
          {isArabic ? "للمطاعم" : "Restaurant Platform"}
        </span>
      </span>
    </Link>
  );
};

export default Logo;
