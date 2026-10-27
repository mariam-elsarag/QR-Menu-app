"use client";

import React from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import FormBuilder from "@/components/share/form/form-builder";
import PageBreadcrumbs from "@/components/share/page-breadcrumbs";
import type { FormFieldConfig } from "@/components/share/form/types";

import type { RoleItemType } from "../type/types";
import { UserSchema } from "../user/schemas/create-user.schema";
import type { CreateUserResult } from "../user/typse/types";

type UserFormValues = {
  phone: string;
  email: string;
  roleId: string;
  fullName: string;
};

type UserFormProps = {
  isEdit?: boolean;
  roles: RoleItemType[];
  defaultValues?: UserFormValues;
  onSubmit: (values: UserFormValues) => Promise<CreateUserResult>;
};

const UsersForm = ({
  isEdit = false,
  roles,
  defaultValues,
  onSubmit,
}: UserFormProps) => {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();

  const form = useForm<UserFormValues>({
    resolver: zodResolver(UserSchema),
    defaultValues: defaultValues ?? {
      email: "",
      phone: "",
      roleId: "",
    },
  });

  const {
    formState: { isSubmitting },
    setError,
    clearErrors,
  } = form;

  const fields: FormFieldConfig<UserFormValues>[] = [
    {
      type: "input",
      name: "fullName",
      label: "fullName",
      inputType: "text",
      placeholder: "fullNamePlaceholder",
      required: true,
    },
    {
      type: "input",
      name: "email",
      label: "auth.login.email",
      inputType: "email",
      placeholder: "auth.login.emailPlaceholder",
      required: true,
    },
    {
      type: "input",
      name: "phone",
      label: "phone",
      inputType: "tel",
      placeholder: "phonePlaceholder",
      required: true,
    },
    {
      type: "dropdown",
      name: "roleId",
      label: "role",
      placeholder: "selectRole",
      options: roles.map((role) => ({
        label: role.name,
        value: role.id,
      })),
      required: true,
    },
  ];

  const breadcrumbs = [
    {
      label: t("navigation.teamManagment"),
      href: "/dashboard/team",
    },
    {
      label: t(isEdit ? "updateUser" : "createUser"),
    },
  ];

  const handleSubmit = async (values: UserFormValues) => {
    try {
      clearErrors(["email", "phone"]);

      const result = await onSubmit(values);

      if (!result.success) {
        switch (result.error) {
          case "EMAIL_ALREADY_EXISTS":
            setError("email", {
              type: "server",
              message: "users.errors.EMAIL_ALREADY_EXISTS",
            });
            return;

          case "PHONE_ALREADY_EXISTS":
            setError("phone", {
              type: "server",
              message: "users.errors.PHONE_ALREADY_EXISTS",
            });
            return;

          default:
            toast.error(t(`users.errors.${result.error}`));
            return;
        }
      }

      form.reset();

      toast.success(t("users.invitationSent"));

      router.push(`/${locale}/dashboard/team?page=user`);
      router.refresh();
    } catch (error) {
      console.error("Failed to submit user form:", error);
      toast.error(t("users.errors.SERVER_ERROR"));
    }
  };

  return (
    <div className="flex flex-col gap-10">
      <PageBreadcrumbs items={breadcrumbs} />

      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex flex-col gap-10"
        >
          <FormBuilder fields={fields} className="grid gap-6" />

          <Button
            type="submit"
            disabled={isSubmitting}
            loading={isSubmitting}
            className="h-12 w-full gap-2 text-sm font-semibold"
          >
            {t(isEdit ? "updateUser" : "createUser")}

            {!isSubmitting && <ArrowRight className="size-4 rtl:rotate-180" />}
          </Button>
        </form>
      </FormProvider>
    </div>
  );
};

export default UsersForm;
