"use client";

import { Globe } from "lucide-react";
import { hasLocale, useLocale, useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePathname, useRouter } from "@/src/i18n/navigation";
import { routing, type Locale } from "@/src/i18n/routing";

const languages: { locale: Locale; label: string }[] = [
  { locale: "en", label: "English" },
  { locale: "ar", label: "العربية" },
];

export function LanguageSwitcher() {
  const locale = useLocale();
  const t = useTranslations("LanguageSwitcher");
  const pathname = usePathname();
  const router = useRouter();

  function changeLocale(nextLocale: string) {
    if (!hasLocale(routing.locales, nextLocale)) {
      return;
    }

    const currentUrlSuffix = `${window.location.search}${window.location.hash}`;
    router.replace(`${pathname}${currentUrlSuffix}`, {
      locale: nextLocale,
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          aria-label={t("switchLanguage")}
          size="icon-lg"
          title={t("switchLanguage")}
          variant="ghost"
        >
          <Globe
            aria-hidden="true"
            className="size-5 text-muted-ink"
            strokeWidth={1.5}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuRadioGroup
          className="flex flex-col gap-1"
          value={locale}
          onValueChange={changeLocale}
        >
          {languages.map((language) => {
            const isCurrentLocale = language.locale === locale;

            return (
              <DropdownMenuRadioItem
                key={language.locale}
                value={language.locale}
                disabled={isCurrentLocale}
                className={`${
                  isCurrentLocale ? "cursor-default" : "cursor-pointer"
                } duration-200!`}
              >
                {language.label}
              </DropdownMenuRadioItem>
            );
          })}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
