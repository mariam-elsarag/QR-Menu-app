import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";

import { routing } from "./src/i18n/routing";

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

  // Only check authentication for routes that need it.
  if (!isHomeRoute && !isDashboardRoute && !isAuthRoute) {
    return response;
  }

  const token = request.cookies.get("session")?.value;
  const secret = process.env.SESSION_SECRET;

  let isAuthenticated = false;

  if (token && secret) {
    try {
      const { payload } = await jwtVerify(
        token,
        new TextEncoder().encode(secret),
        { algorithms: ["HS256"] },
      );

      isAuthenticated = typeof payload.userId === "string";
    } catch {
      isAuthenticated = false;
    }
  }

  // Home route: redirect based on authentication.
  if (isHomeRoute) {
    return redirectTo(
      request,
      locale,
      isAuthenticated ? "/dashboard" : "/login",
    );
  }

  // Guests cannot access the dashboard.
  if (isDashboardRoute && !isAuthenticated) {
    return redirectTo(request, locale, "/login");
  }

  // Authenticated users shouldn't revisit auth pages.
  if (isAuthRoute && isAuthenticated) {
    return redirectTo(request, locale, "/dashboard");
  }

  return response;
}

function redirectTo(request: NextRequest, locale: string, path: string) {
  const url = request.nextUrl.clone();

  url.pathname = `/${locale}${path}`;
  url.search = "";

  return NextResponse.redirect(url);
}

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
