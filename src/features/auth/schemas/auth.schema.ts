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

export const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(1, {
        message: "auth.resetPassword.validation.passwordRequired",
      })
      .min(8, {
        message: "auth.resetPassword.validation.passwordMin",
      })
      .regex(/[A-Z]/, {
        message: "auth.resetPassword.validation.passwordUppercase",
      })
      .regex(/[a-z]/, {
        message: "auth.resetPassword.validation.passwordLowercase",
      })
      .regex(/[0-9]/, {
        message: "auth.resetPassword.validation.passwordNumber",
      })
      .regex(/[^A-Za-z0-9]/, {
        message: "auth.resetPassword.validation.passwordSpecialCharacter",
      }),

    confirmPassword: z.string().min(1, {
      message: "auth.resetPassword.validation.confirmPasswordRequired",
    }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "auth.resetPassword.validation.passwordsDoNotMatch",
    path: ["confirmPassword"],
  });

export const changePasswordSchema = z
  .object({
    password: z.string().min(1, {
      message: "auth.resetPassword.validation.passwordRequired",
    }),
    newPassword: z
      .string()
      .min(1, {
        message: "auth.resetPassword.validation.passwordRequired",
      })
      .min(8, {
        message: "auth.resetPassword.validation.passwordMin",
      })
      .regex(/[A-Z]/, {
        message: "auth.resetPassword.validation.passwordUppercase",
      })
      .regex(/[a-z]/, {
        message: "auth.resetPassword.validation.passwordLowercase",
      })
      .regex(/[0-9]/, {
        message: "auth.resetPassword.validation.passwordNumber",
      })
      .regex(/[^A-Za-z0-9]/, {
        message: "auth.resetPassword.validation.passwordSpecialCharacter",
      }),

    confirmPassword: z.string().min(1, {
      message: "auth.resetPassword.validation.confirmPasswordRequired",
    }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "auth.resetPassword.validation.passwordsDoNotMatch",
    path: ["confirmPassword"],
  });
export const acceptInvitationSchema = resetPasswordSchema;
