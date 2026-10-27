import { redirect } from "@/src/i18n/navigation";

type Locale = "en" | "ar";

type AuthErrorCode = "UNAUTHORIZED" | "PERMISSION_DENIED";

export function handleAuthError(error: AuthErrorCode, locale: Locale): void {
  switch (error) {
    case "UNAUTHORIZED":
      redirect({ href: "/login", locale });
      break;

    case "PERMISSION_DENIED":
      redirect({ href: "/403", locale });
      break;
  }
}
