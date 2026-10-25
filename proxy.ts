import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";

import { routing } from "./src/i18n/routing";
import {
  SESSION_ALGORITHM,
  SESSION_COOKIE_NAME,
  getSessionSecret,
} from "./src/lib/auth/auth-config";

const intlMiddleware = createMiddleware(routing);

const authRoutes = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
];

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const response = intlMiddleware(request);

  const locale = routing.locales.find(
    (item) => pathname === `/${item}` || pathname.startsWith(`/${item}/`),
  );

  if (!locale) {
    return response;
  }

  const pathWithoutLocale = pathname.slice(locale.length + 1) || "/";

  const isHomeRoute = pathWithoutLocale === "/";

  const isDashboardRoute =
    pathWithoutLocale === "/dashboard" ||
    pathWithoutLocale.startsWith("/dashboard/");

  const isAuthRoute = authRoutes.some(
    (route) =>
      pathWithoutLocale === route || pathWithoutLocale.startsWith(`${route}/`),
  );

  if (!isHomeRoute && !isDashboardRoute && !isAuthRoute) {
    return response;
  }

  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  let isAuthenticated = false;
  let invalidSession = false;

  if (token) {
    try {
      const { payload } = await jwtVerify(token, getSessionSecret(), {
        algorithms: [SESSION_ALGORITHM],
      });

      isAuthenticated =
        typeof payload.sub === "string" &&
        payload.sub.length > 0 &&
        typeof payload.sessionVersion === "number" &&
        Number.isSafeInteger(payload.sessionVersion) &&
        payload.sessionVersion >= 0;

      invalidSession = !isAuthenticated;
    } catch {
      invalidSession = true;
    }
  }

  let result: NextResponse;

  if (isHomeRoute) {
    result = redirectTo(
      request,
      locale,
      isAuthenticated ? "/dashboard" : "/login",
    );
  } else if (isDashboardRoute && !isAuthenticated) {
    result = redirectTo(
      request,
      locale,
      "/login",
      invalidSession ? "session-expired" : undefined,
    );
  } else if (isAuthRoute && isAuthenticated) {
    result = redirectTo(request, locale, "/dashboard");
  } else {
    result = response;
  }

  if (invalidSession) {
    result.cookies.delete(SESSION_COOKIE_NAME);
  }

  return result;
}

function redirectTo(
  request: NextRequest,
  locale: string,
  path: string,
  reason?: string,
) {
  const url = request.nextUrl.clone();

  url.pathname = `/${locale}${path}`;
  url.search = "";

  if (reason) {
    url.searchParams.set("reason", reason);
  }

  return NextResponse.redirect(url);
}

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
