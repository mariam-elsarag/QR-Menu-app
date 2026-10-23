"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

import FormBuilder from "@/components/share/form/form-builder";
import type { FormFieldConfig } from "@/components/share/form/types";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import { loginAction } from "../actions/login";
import { loginSchema } from "../schemas/auth.schema";
import FormHeader from "@/components/auth/form-header";

type LoginValues = z.infer<typeof loginSchema>;

const fields: FormFieldConfig<LoginValues>[] = [
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
    name: "password",
    label: "auth.login.password",
    inputType: "password",
    placeholder: "auth.login.passwordPlaceholder",
    required: true,
  },
];

export function LoginForm() {
  const t = useTranslations("auth.login");
  const router = useRouter();
  const locale = useLocale();

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const {
    handleSubmit,
    setError,
    clearErrors,
    watch,
    setValue,
    reset,
    formState: { isSubmitting },
  } = form;

  const rememberMe = watch("rememberMe");

  const onSubmit = async (values: LoginValues) => {
    clearErrors(["email", "password"]);

    try {
      const result = await loginAction(values);

      if (!result.success) {
        switch (result.error) {
          case "INVALID_CREDENTIALS":
            setError("email", {
              type: "server",
              message: "invalidCredentials",
            });
            setError("password", {
              type: "server",
              message: "invalidCredentials",
            });
            return;

          case "VALIDATION_ERROR":
            toast.error(t("errors.validation"));
            return;

          case "SERVER_ERROR":
            toast.error(t("errors.server"));
            return;
        }
      }

      reset({
        email: "",
        password: "",
        rememberMe: false,
      });

      toast.success(t("success"));

      router.replace(`/${locale}/dashboard`);
      router.refresh();
    } catch {
      toast.error(t("errors.server"));
    }
  };

  return (
    <FormProvider {...form}>
      <div className="w-full max-w-md">
        <FormHeader title={t("title")} description={t("description")} />

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
          noValidate
        >
          <FormBuilder fields={fields} className="grid gap-6" />

          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Checkbox
                id="rememberMe"
                checked={rememberMe}
                onCheckedChange={(checked) => {
                  setValue("rememberMe", checked === true, {
                    shouldDirty: true,
                    shouldValidate: true,
                  });
                }}
              />

              <label
                htmlFor="rememberMe"
                className="cursor-pointer text-sm text-muted-foreground"
              >
                {t("rememberMe")}
              </label>
            </div>

            <Link
              href={`/${locale}/forget-password`}
              className="text-sm font-medium text-primary hover:underline"
            >
              {t("forgotPassword")}
            </Link>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-12 w-full gap-2 text-sm font-semibold"
          >
            {isSubmitting ? t("signingIn") : t("signIn")}
            {!isSubmitting && <ArrowRight className="size-4 rtl:rotate-180" />}
          </Button>
        </form>
      </div>
    </FormProvider>
  );
}
