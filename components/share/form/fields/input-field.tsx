"use client";

import type { ComponentType } from "react";
import type { ControllerRenderProps, FieldValues, Path } from "react-hook-form";
import { Input } from "@/components/ui/input";

type InputFieldProps<T extends FieldValues> = {
  field: ControllerRenderProps<T, Path<T>>;
  placeholder?: string;
  inputType?: "text" | "email" | "password" | "number";
  disabled?: boolean;
  invalid?: boolean;
  icon?: ComponentType<{ className?: string }>;
};

const InputField = <T extends FieldValues>({
  field,
  placeholder,
  inputType = "text",
  disabled,
  invalid,
  icon: Icon,
}: InputFieldProps<T>) => {
  return (
    <div className="relative">
      {Icon && (
        <Icon className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      )}

      <Input
        {...field}
        id={field.name}
        type={inputType}
        value={field.value ?? ""}
        placeholder={placeholder}
        disabled={disabled}
        aria-invalid={invalid}
        className={Icon ? "ps-9" : ""}
        onChange={(event) => {
          const value = event.target.value;

          field.onChange(inputType === "email" ? value.toLowerCase() : value);
        }}
      />
    </div>
  );
};

export default InputField;
