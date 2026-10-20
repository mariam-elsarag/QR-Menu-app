"use client";

import type {
  ControllerRenderProps,
  FieldValues,
  FieldPath,
} from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";

type Props<T extends FieldValues> = {
  field: ControllerRenderProps<T, FieldPath<T>>;
  placeholder?: string;
  rows?: number;
  disabled?: boolean;
  invalid?: boolean;
};

const TextareaField = <T extends FieldValues>({
  field,
  placeholder,
  rows = 4,
  disabled,
  invalid,
}: Props<T>) => {
  return (
    <Textarea
      {...field}
      id={field.name}
      value={field.value ?? ""}
      placeholder={placeholder}
      rows={rows}
      disabled={disabled}
      aria-invalid={invalid}
      className="resize-none h-[120px]"
    />
  );
};

export default TextareaField;
