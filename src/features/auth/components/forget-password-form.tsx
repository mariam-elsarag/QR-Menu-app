"use client";
import FormHeader from "@/components/auth/form-header";
import FormBuilder from "@/components/share/form/form-builder";
import { FormFieldConfig } from "@/components/share/form/types";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import z from "zod";
import { forgetPasswordAction } from "../actions/forget-password";
import { forgetPasswordSchema } from "../schemas/auth.schema";

type ForgetPasswordValues = z.infer<typeof forgetPasswordSchema>;

const fields: FormFieldConfig<ForgetPasswordValues>[] = [
  {
    type: "input",
    name: "email",
    label: "auth.login.email",
    inputType: "email",
    placeholder: "auth.login.emailPlaceholder",
    required: true,
  },
];
const ForgetPasswordForm = () => {
  const t = useTranslations("auth.forgetPassword");
  const locale = useLocale();

  const form = useForm<ForgetPasswordValues>({
    resolver: zodResolver(forgetPasswordSchema),
    defaultValues: {
      email: "",
    },
  });
  const {
    handleSubmit,

    reset,
    formState: { isSubmitting },
  } = form;
  const onSubmit = async (values: ForgetPasswordValues) => {
    try {
      const result = await forgetPasswordAction(values, locale);

      if (!result.success) {
        switch (result.error) {
          case "VALIDATION_ERROR":
            toast.error(t("errors.validation"));
            return;

          case "SERVER_ERROR":
            toast.error(t("errors.server"));
            return;
        }
      }
      console.log(result, "sss");
      reset({ email: "" });
      toast.success(t("success"));
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

          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-12 w-full gap-2 text-sm font-semibold"
          >
            {isSubmitting ? t("submitting") : t("submit")}
            {!isSubmitting && <ArrowRight className="size-4 rtl:rotate-180" />}
          </Button>
        </form>
      </div>
    </FormProvider>
  );
};

export default ForgetPasswordForm;
