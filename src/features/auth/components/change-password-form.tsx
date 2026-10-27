"use client";

import { Suspense, useState } from "react";
import { useRouter } from "next/navigation";
import { FormProvider, useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocale, useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { toast } from "react-toastify";

import {
  resetPasswordSchema,
  changePasswordSchema,
  acceptInvitationSchema,
} from "../schemas/auth.schema";

import type { FormFieldConfig } from "@/components/share/form/types";
import FormBuilder from "@/components/share/form/form-builder";
import FormHeader from "@/components/auth/form-header";
import { Button } from "@/components/ui/button";

type FormType = "reset" | "change" | "invitation";

type PasswordFormValues = {
  password?: string;
  newPassword: string;
  confirmPassword: string;
};

type PasswordActionError =
  | "VALIDATION_ERROR"
  | "INVALID_TOKEN"
  | "INVALID_PASSWORD"
  | "UNAUTHORIZED"
  | "SERVER_ERROR";

type PasswordActionResult =
  | { success: true }
  | { success: false; error: PasswordActionError };

type ChangePasswordProps = {
  type: FormType;
  token?: string | null;
  onSubmit: (
    values: PasswordFormValues,
    token: string | null,
  ) => Promise<PasswordActionResult>;
};

const errorTranslationKeys: Record<PasswordActionError, string> = {
  VALIDATION_ERROR: "auth.errors.validationError",
  INVALID_TOKEN: "auth.errors.invalidResetToken",
  INVALID_PASSWORD: "auth.errors.invalidPassword",
  UNAUTHORIZED: "auth.errors.unauthorized",
  SERVER_ERROR: "auth.errors.serverError",
};

const formConfig = {
  reset: {
    title: "auth.resetPassword.title",
    description: "auth.resetPassword.description",
    submit: "auth.resetPassword.submit",
    submitting: "auth.resetPassword.submitting",
    success: "auth.resetPassword.success",
  },
  change: {
    title: "auth.changePassword.title",
    description: "auth.changePassword.description",
    submit: "auth.changePassword.submit",
    submitting: "auth.changePassword.submitting",
    success: "auth.changePassword.success",
  },
  invitation: {
    title: "auth.invitation.title",
    description: "auth.invitation.description",
    submit: "auth.invitation.submit",
    submitting: "auth.invitation.submitting",
    success: "auth.invitation.success",
  },
} satisfies Record<
  FormType,
  {
    title: string;
    description: string;
    submit: string;
    submitting: string;
    success: string;
  }
>;

const ChangePasswordFormContent = ({
  type,
  token = null,
  onSubmit,
}: ChangePasswordProps) => {
  const t = useTranslations();
  const router = useRouter();
  const locale = useLocale();

  const [feedback, setFeedback] = useState<string | null>(null);

  const schema =
    type === "change"
      ? changePasswordSchema
      : type === "invitation"
        ? acceptInvitationSchema
        : resetPasswordSchema;

  const config = formConfig[type];

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(schema) as Resolver<PasswordFormValues>,
    defaultValues: {
      ...(type === "change" ? { password: "" } : {}),
      newPassword: "",
      confirmPassword: "",
    },
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = form;

  const fields: FormFieldConfig<PasswordFormValues>[] = [
    ...(type === "change"
      ? [
          {
            type: "input" as const,
            name: "password" as const,
            label: "auth.changePassword.currentPassword",
            inputType: "password" as const,
            placeholder: "auth.login.passwordPlaceholder",
            required: true,
          },
        ]
      : []),
    {
      type: "input",
      name: "newPassword",
      label: "auth.resetPassword.newPassword",
      inputType: "password",
      placeholder: "auth.resetPassword.passwordPlaceholder",
      required: true,
    },
    {
      type: "input",
      name: "confirmPassword",
      label: "auth.resetPassword.confirmPassword",
      inputType: "password",
      placeholder: "auth.resetPassword.passwordPlaceholder",
      required: true,
    },
  ];

  const handleFormSubmit = async (values: PasswordFormValues) => {
    setFeedback(null);

    if (type !== "change" && !token) {
      setFeedback(t("auth.errors.invalidResetToken"));
      return;
    }

    try {
      const result = await onSubmit(values, token);

      if (!result.success) {
        setFeedback(t(errorTranslationKeys[result.error]));
        return;
      }

      reset();

      toast.success(t(config.success));

      router.replace(`/${locale}/login`);
    } catch (error) {
      console.error("Password form submission failed:", error);
      setFeedback(t("auth.errors.serverError"));
    }
  };

  return (
    <FormProvider {...form}>
      <div className="w-full max-w-md">
        <FormHeader
          title={t(config.title)}
          description={t(config.description)}
        />

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="space-y-6"
          noValidate
        >
          <FormBuilder fields={fields} className="grid gap-6" />

          {feedback && (
            <p role="alert" className="text-sm text-destructive">
              {feedback}
            </p>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            loading={isSubmitting}
            className="h-12 w-full gap-2 text-sm font-semibold"
          >
            {t(isSubmitting ? config.submitting : config.submit)}

            {!isSubmitting && <ArrowRight className="size-4 rtl:rotate-180" />}
          </Button>
        </form>
      </div>
    </FormProvider>
  );
};

const ChangePasswordForm = (props: ChangePasswordProps) => (
  <Suspense fallback={<div className="w-full max-w-md" />}>
    <ChangePasswordFormContent {...props} />
  </Suspense>
);

export default ChangePasswordForm;
