import z, { email } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: "auth.login.validation.emailRequired" })
    .pipe(z.email({ message: "auth.login.validation.emailInvalid" })),

  password: z
    .string()
    .min(1, { message: "auth.login.validation.passwordRequired" }),

  rememberMe: z.boolean(),
});

export const forgetPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: "auth.login.validation.emailRequired" })
    .pipe(z.email({ message: "auth.login.validation.emailInvalid" })),
});
