"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormProvider, useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocale, useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";

import {
  resetPasswordSchema,
  changePasswordSchema,
} from "../schemas/auth.schema";
import { changePasswordAction } from "../actions/change-password";
import type { FormFieldConfig } from "@/components/share/form/types";
import FormBuilder from "@/components/share/form/form-builder";
import FormHeader from "@/components/auth/form-header";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";

type ChangePasswordProps = {
  type: "reset" | "change";
};

type ChangePasswordValues =
  | z.infer<typeof resetPasswordSchema>
  | z.infer<typeof changePasswordSchema>;

type PasswordActionError =
  | "VALIDATION_ERROR"
  | "INVALID_TOKEN"
  | "INVALID_PASSWORD"
  | "UNAUTHORIZED"
  | "SERVER_ERROR";

const errorTranslationKeys: Record<PasswordActionError, string> = {
  VALIDATION_ERROR: "auth.errors.validationError",
  INVALID_TOKEN: "auth.errors.invalidResetToken",
  INVALID_PASSWORD: "auth.errors.invalidPassword",
  UNAUTHORIZED: "auth.errors.unauthorized",
  SERVER_ERROR: "auth.errors.serverError",
};

const ChangePasswordFormContent = ({ type }: ChangePasswordProps) => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const t = useTranslations();
  const router = useRouter();
  const locale = useLocale();

  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const schema = type === "reset" ? resetPasswordSchema : changePasswordSchema;

  const fields: FormFieldConfig<ChangePasswordValues>[] = [
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

  const form = useForm<ChangePasswordValues>({
    resolver: zodResolver(schema) as Resolver<ChangePasswordValues>,
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
      ...(type === "change" ? { password: "" } : {}),
    },
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = form;

  const onSubmit = async (values: ChangePasswordValues) => {
    setFeedback(null);

    try {
      const result = await changePasswordAction(values, token, type);

      if (!result.success) {
        setFeedback({
          type: "error",
          message: t(errorTranslationKeys[result.error]),
        });
        return;
      }

      reset();
      toast.success(
        t(
          type === "reset"
            ? "auth.resetPassword.success"
            : "auth.changePassword.success",
        ),
      );
      if (type === "reset") {
        router.replace(`/${locale}/login`);
      } else {
        router.replace(`/${locale}/login`);
      }
    } catch {
      setFeedback({
        type: "error",
        message: t("auth.errors.serverError"),
      });
    }
  };

  return (
    <FormProvider {...form}>
      <div className="w-full max-w-md">
        <FormHeader
          title={t(
            type === "reset"
              ? "auth.resetPassword.title"
              : "auth.changePassword.title",
          )}
          description={t(
            type === "reset"
              ? "auth.resetPassword.description"
              : "auth.changePassword.description",
          )}
        />

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
          noValidate
        >
          <FormBuilder fields={fields} className="grid gap-6" />

          {feedback && (
            <p
              role={feedback.type === "error" ? "alert" : "status"}
              className={
                feedback.type === "error"
                  ? "text-sm text-destructive"
                  : "text-sm text-green-700"
              }
            >
              {feedback.message}
            </p>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-12 w-full gap-2 text-sm font-semibold"
          >
            {isSubmitting
              ? t(
                  type === "reset"
                    ? "auth.resetPassword.submitting"
                    : "auth.changePassword.submitting",
                )
              : t(
                  type === "reset"
                    ? "auth.resetPassword.submit"
                    : "auth.changePassword.submit",
                )}

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
