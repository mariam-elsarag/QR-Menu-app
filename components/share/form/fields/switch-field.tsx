"use client";

import type {
  ControllerRenderProps,
  FieldValues,
  FieldPath,
} from "react-hook-form";
import { Switch } from "@/components/ui/switch";

type Props<T extends FieldValues> = {
  field: ControllerRenderProps<T, FieldPath<T>>;
  disabled?: boolean;
  invalid?: boolean;
};

const SwitchField = <T extends FieldValues>({
  field,
  disabled,
  invalid,
}: Props<T>) => {
  return (
    <Switch
      id={field.name}
      name={field.name}
      checked={Boolean(field.value)}
      onCheckedChange={field.onChange}
      onBlur={field.onBlur}
      disabled={disabled}
      aria-invalid={invalid}
    />
  );
};

export default SwitchField;
