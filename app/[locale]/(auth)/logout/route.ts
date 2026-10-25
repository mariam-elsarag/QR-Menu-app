import { NextRequest, NextResponse } from "next/server";

import { SESSION_COOKIE_NAME } from "@/src/lib/auth/auth-config";
import { routing } from "@/src/i18n/routing";

export async function GET(request: NextRequest) {
  const reason = request.nextUrl.searchParams.get("reason");

  const safeReason =
    reason === "account-unavailable"
      ? "account-unavailable"
      : "session-expired";

  const localeFromReferer = request.headers.get("referer");

  // Use the locale passed in the query string, validated against routing.
  const requestedLocale = request.nextUrl.searchParams.get("locale");

  const locale = routing.locales.includes(
    requestedLocale as (typeof routing.locales)[number],
  )
    ? requestedLocale!
    : routing.defaultLocale;

  const response = NextResponse.redirect(
    new URL(`/${locale}/login?reason=${safeReason}`, request.url),
  );

  response.cookies.delete(SESSION_COOKIE_NAME);

  return response;
}
