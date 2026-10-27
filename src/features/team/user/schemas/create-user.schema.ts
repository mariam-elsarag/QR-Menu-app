import { z } from "zod";

export const UserSchema = z.object({
  fullName: z
    .string()
    .min(1, { message: "users.validation.fullNameRequired" })
    .max(80, { message: "users.validation.fullNameMaxCharacter" }),
  email: z
    .string()
    .trim()
    .min(1, { message: "auth.login.validation.emailRequired" })
    .pipe(z.email({ message: "auth.login.validation.emailInvalid" })),

  roleId: z
    .string()
    .trim()
    .min(1, { message: "users.validation.roleRequired" }),

  phone: z
    .string()
    .trim()
    .min(1, { message: "users.validation.phoneRequired" })
    .regex(/^01[0125]\d{8}$/, {
      message: "users.validation.phoneInvalid",
    }),
});

export type UserFormValues = z.infer<typeof UserSchema>;
