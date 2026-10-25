import "server-only";

export const SESSION_COOKIE_NAME = "session";
export const SESSION_ALGORITHM = "HS256";

export function getSessionSecret() {
  const secret = process.env.SESSION_SECRET;

  if (!secret) {
    throw new Error("SESSION_SECRET is not configured");
  }

  return new TextEncoder().encode(secret);
}
