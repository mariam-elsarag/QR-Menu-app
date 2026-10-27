"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { FormProvider, useForm } from "react-hook-form";

import PageBreadcrumbs from "@/components/share/page-breadcrumbs";
import { Button } from "@/components/ui/button";

import FormBuilder from "@/components/share/form/form-builder";
import { FormFieldConfig } from "@/components/share/form/types";
import PermissionSelector, {
  type PermissionItem,
} from "@/src/features/team/components/permission-selector";
import { RoleSchema } from "../schemas/team.scema";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { RoleType } from "@/app/generated/prisma/enums";

type RoleFormValues = {
  name: string;
  permissionIds: string[];
};
export type CreateRoleResult =
  | {
      success: true;
      data: {
        id: string;
        name: string;
        type: RoleType;
      };
    }
  | {
      success: false;
      error:
        | "UNAUTHORIZED"
        | "PERMISSION_DENIED"
        | "SERVER_ERROR"
        | "VALIDATION_ERROR"
        | "INVALID_PERMISSIONS"
        | "ROLE_NAME_EXISTS";
    };
type RoleFormProps = {
  isEdit?: boolean;
  permissions: PermissionItem[];
  defaultValues?: RoleFormValues;
  onSubmit: (values: RoleFormValues) => Promise<CreateRoleResult>;
};
const TRANSLATION_KEYS = {
  navigation: "navigation.teamManagment",
  createRole: "createRole",
  updateRole: "updateRole",
  roleName: "roleName",
  roleNamePlaceholder: "roleNamePlaceholder",
  permissions: "permissions",
  submitCreate: "createRole",
  submitUpdate: "updateRole",
} as const;

const RoleForm = ({
  isEdit = false,
  permissions,
  defaultValues,
  onSubmit,
}: RoleFormProps) => {
  const t = useTranslations();
  const router = useRouter();
  const locale = useLocale();

  const form = useForm<RoleFormValues>({
    resolver: zodResolver(RoleSchema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      permissionIds: defaultValues?.permissionIds ?? [],
    },
  });

  const fields: FormFieldConfig<RoleFormValues>[] = [
    {
      name: "name",
      type: "input",
      label: TRANSLATION_KEYS.roleName,
      placeholder: TRANSLATION_KEYS.roleNamePlaceholder,
      required: true,
      className: "md:col-span-2",
    },
  ];

  const breadcrumbs = [
    {
      label: t(TRANSLATION_KEYS.navigation),
      href: "/dashboard/team",
    },
    {
      label: t(
        isEdit ? TRANSLATION_KEYS.updateRole : TRANSLATION_KEYS.createRole,
      ),
    },
  ];

  const handleSubmit = async (values: RoleFormValues) => {
    const result = await onSubmit(values);

    if (!result.success) {
      switch (result.error) {
        case "ROLE_NAME_EXISTS":
          toast.error(t("roleForm.errors.roleNameExists"));
          break;

        case "INVALID_PERMISSIONS":
          toast.error(t("roleForm.errors.invalidPermissions"));
          break;

        case "VALIDATION_ERROR":
          toast.error(t("roleForm.errors.validationError"));
          break;

        default:
          toast.error(t("roleForm.errors.createFailed"));
      }

      return;
    }

    toast.success(
      t(isEdit ? "roleForm.success.updated" : "roleForm.success.created"),
    );
    router.back();
  };

  const isSubmitting = form.formState.isSubmitting;

  return (
    <div className="flex flex-col gap-10">
      <PageBreadcrumbs items={breadcrumbs} />

      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex flex-col gap-10"
        >
          <FormBuilder<RoleFormValues>
            fields={fields}
            loading={isSubmitting}
            className="grid grid-cols-1 gap-5"
          />

          {/* Permissions */}
          <PermissionSelector
            permissions={permissions}
            value={form.watch("permissionIds")}
            onChange={(permissionIds) => {
              form.setValue("permissionIds", permissionIds, {
                shouldDirty: true,
                shouldValidate: true,
              });
            }}
            disabled={isSubmitting}
          />

          {form.formState.errors.permissionIds?.message && (
            <p role="alert" className="text-sm text-destructive">
              {t(form.formState.errors.permissionIds.message)}
            </p>
          )}

          {/* Actions */}
          <div className="grid grid-cols-2 sm:grid-cols-[300px_1fr] gap-2">
            <Button
              type="button"
              onClick={() => {
                router.back();
              }}
              size="lg"
              variant="outline"
            >
              {t("back")}
            </Button>
            <Button
              loading={isSubmitting}
              type="submit"
              size="lg"
              disabled={isSubmitting}
            >
              {t(
                isEdit
                  ? TRANSLATION_KEYS.submitUpdate
                  : TRANSLATION_KEYS.submitCreate,
              )}
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default RoleForm;
