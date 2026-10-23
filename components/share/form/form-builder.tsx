"use client";

import { useTranslations } from "next-intl";
import {
  Controller,
  type ControllerRenderProps,
  type FieldPath,
  type FieldValues,
  useFormContext,
} from "react-hook-form";

import { Label } from "@/components/ui/label";
import type { FormFieldConfig } from "./types";

import DropdownField from "./fields/dropdown-field";
import InputField from "./fields/input-field";
import RadioField from "./fields/radio-field";
import SwitchField from "./fields/switch-field";
import TextareaField from "./fields/textarea-field";

type FormBuilderProps<T extends FieldValues> = {
  fields: FormFieldConfig<T>[];
  loading?: boolean;
  className?: string;
};

const FormBuilder = <T extends FieldValues>({
  fields,
  loading = false,
  className,
}: FormBuilderProps<T>) => {
  const { control } = useFormContext<T>();
  const t = useTranslations();

  const renderField = (
    item: FormFieldConfig<T>,
    field: ControllerRenderProps<T, FieldPath<T>>,
    invalid: boolean,
  ) => {
    const disabled = loading || item.disabled;

    switch (item.type) {
      case "input":
        return (
          <InputField
            field={field}
            inputType={item.inputType}
            placeholder={item.placeholder ? t(item.placeholder) : undefined}
            icon={item.icon}
            disabled={disabled}
            invalid={invalid}
          />
        );

      case "textarea":
        return (
          <TextareaField
            field={field}
            rows={item.rows}
            placeholder={item.placeholder ? t(item.placeholder) : undefined}
            disabled={disabled}
            invalid={invalid}
          />
        );

      case "dropdown":
        return (
          <DropdownField
            field={field}
            options={item.options}
            placeholder={t(item.placeholder ?? "common.selectOption")}
            searchPlaceholder={t("common.search")}
            emptyMessage={t("common.noResults")}
            searchable={item.searchable}
            multiple={item.multiple}
            hasVirtualScroller={item.hasVirtualScroller}
            itemSize={item.itemSize}
            loading={item.loading}
            disabled={item.disabled}
            invalid={invalid}
            onChange={item.onChange}
          />
        );

      case "switch":
        return (
          <SwitchField field={field} disabled={disabled} invalid={invalid} />
        );

      case "radio":
        return (
          <RadioField
            field={field}
            options={item.options.map((option) => ({
              ...option,
              label: t(option.label),
            }))}
            disabled={disabled}
            invalid={invalid}
          />
        );
    }
  };

  return (
    <div className={` ${className ?? "grid grid-cols-1 gap-5 md:grid-cols-2"}`}>
      {fields.map((item) => (
        <Controller
          key={item.name}
          name={item.name}
          control={control}
          render={({ field, fieldState }) => (
            <div className={`space-y-2 ${item.className ?? ""}`}>
              {item.type === "switch" ? (
                <div className="flex items-center justify-between gap-4 rounded-lg border border-border p-4">
                  <div className="space-y-1">
                    <Label htmlFor={item.name}>{t(item.label)}</Label>
                    {item.description && (
                      <p className="text-xs text-muted-foreground">
                        {t(item.description)}
                      </p>
                    )}
                  </div>

                  {renderField(item, field, fieldState.invalid)}
                </div>
              ) : (
                <>
                  <Label className="capitalize gap-0" htmlFor={item.name}>
                    {t(item.label)}
                    {item.required && (
                      <span className="ms-1 text-destructive">*</span>
                    )}
                  </Label>

                  {renderField(item, field, fieldState.invalid)}

                  {item.description && !fieldState.error && (
                    <p className="text-xs text-muted-foreground">
                      {t(item.description)}
                    </p>
                  )}
                </>
              )}

              {fieldState.error?.message && (
                <p role="alert" className="text-xs text-destructive">
                  {t(fieldState.error.message)}
                </p>
              )}
            </div>
          )}
        />
      ))}
    </div>
  );
};

export default FormBuilder;
