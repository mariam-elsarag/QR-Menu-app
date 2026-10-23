"use client";
import { LanguageSwitcher } from "@/components/language-switcher";
import Logo from "@/components/share/Logo";
import { Check, QrCode, Smartphone, UtensilsCrossed } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { ReactNode } from "react";

type AuthWrapperProps = {
  children: ReactNode;
};

const AuthWrapper = ({ children }: AuthWrapperProps) => {
  const t = useTranslations("auth.login");
  const locale = useLocale();

  return (
    <main className="grid  lg:grid-cols-2 mx-auto max-w-[1536px]">
      <section className="flex  flex-col gap-10 flex-1  bg-background px-6 py-8 sm:px-12 lg:px-16 xl:px-24">
        <header className="flex items-center justify-between">
          <Logo to={`/${locale}/login`} />

          <LanguageSwitcher />
        </header>
        <div className="flex flex-1 flex-col items-center justify-center py-12">
          {children}
        </div>
      </section>

      {/* Right: Branded visual */}
      <aside className="relative hidden min-h-fvh overflow-hidden border-s bg-card lg:flex lg:flex-col">
        {/* Decorative background */}
        <div className="pointer-events-none absolute -end-32 -top-32 size-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -start-24 bottom-12 size-80 rounded-full bg-primary/5 blur-3xl" />

        <div className="relative z-10 flex  flex-col justify-between px-12 pt-9 pb-14 xl:px-20">
          <div className="space-y-5">
            <span className="inline-flex items-center gap-2 rounded-full border bg-background/70 px-4 py-2 text-xs font-medium">
              <span className="size-2 rounded-full bg-primary" />
              {t("platformLabel")}
            </span>

            <h2 className="max-w-lg text-4xl font-semibold leading-tight tracking-tight xl:text-5xl">
              {t("heroTitle")}
            </h2>

            <p className="max-w-md text-base leading-7 text-muted-foreground">
              {t("heroDescription")}
            </p>
          </div>

          {/* Product preview */}
          <div className="relative mx-auto my-6 w-full max-w-md">
            <div className="rounded-2xl border bg-background p-5 shadow-2xl shadow-foreground/5">
              <div className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <UtensilsCrossed className="size-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">
                      {t("previewRestaurant")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t("previewSubtitle")}
                    </p>
                  </div>
                </div>

                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  {t("live")}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 py-5">
                <div className="rounded-xl border bg-muted/40 p-4">
                  <div className="mb-4 flex size-9 items-center justify-center rounded-lg bg-background">
                    <QrCode className="size-5 text-primary" />
                  </div>
                  <p className="text-2xl font-semibold">01</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {t("previewMenu")}
                  </p>
                </div>

                <div className="rounded-xl border bg-muted/40 p-4">
                  <div className="mb-4 flex size-9 items-center justify-center rounded-lg bg-background">
                    <Smartphone className="size-5 text-primary" />
                  </div>
                  <p className="text-2xl font-semibold">24/7</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {t("previewAccess")}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl border bg-muted/30 p-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Check className="size-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">{t("previewReady")}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {t("previewReadyDescription")}
                  </p>
                </div>
              </div>
            </div>

            {/* Floating QR decoration */}
            <div className="absolute -end-6 -bottom-8 flex size-24 rotate-6 items-center justify-center rounded-2xl border bg-background shadow-xl xl:-end-10">
              <QrCode className="size-14 text-foreground" />
            </div>
          </div>
        </div>
      </aside>
    </main>
  );
};

export default AuthWrapper;
