"use client";

import type {
  ControllerRenderProps,
  FieldValues,
  FieldPath,
} from "react-hook-form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

type Props<T extends FieldValues> = {
  field: ControllerRenderProps<T, FieldPath<T>>;
  options: {
    label: string;
    value: string;
    disabled?: boolean;
  }[];
  disabled?: boolean;
  invalid?: boolean;
};

const RadioField = <T extends FieldValues>({
  field,
  options,
  disabled,
  invalid,
}: Props<T>) => {
  return (
    <RadioGroup
      name={field.name}
      value={field.value ?? ""}
      onValueChange={field.onChange}
      onBlur={field.onBlur}
      disabled={disabled}
      aria-invalid={invalid}
      className="flex flex-wrap gap-4"
    >
      {options.map((option) => (
        <div
          key={option.value}
          className="flex cursor-pointer items-center gap-2"
        >
          <RadioGroupItem
            id={`${field.name}-${option.value}`}
            value={option.value}
            disabled={option.disabled}
          />
          <Label
            htmlFor={`${field.name}-${option.value}`}
            className="cursor-pointer font-normal"
          >
            {option.label}
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
};

export default RadioField;
