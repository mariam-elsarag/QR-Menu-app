import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { Cormorant_Garamond, Inter } from "next/font/google";
import type { ReactNode } from "react";

import { routing } from "@/src/i18n/routing";
import "./../globals.css";
import ToastProvider from "@/components/share/toast-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: "swap",
});

export const metadata: Metadata = {
  title: "QR Menu",
  description: "Restaurant menu management",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  return (
    <html
      lang={locale}
      dir={locale === "ar" ? "rtl" : "ltr"}
      className={`${inter.variable}  ${cormorant.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <NextIntlClientProvider>
          {children}

          <ToastProvider />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
