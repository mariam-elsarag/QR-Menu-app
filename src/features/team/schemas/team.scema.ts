import z from "zod";

export const RoleSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "roleNameIsRequired" })
    .max(180, { message: "roleMaxnameCharacter" }),

  permissionIds: z
    .array(z.string().min(1))
    .min(1, { message: "rolePermissionIsRequired" }),
});

export type RoleFormValues = z.infer<typeof RoleSchema>;
