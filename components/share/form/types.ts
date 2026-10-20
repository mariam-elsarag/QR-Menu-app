import type { ComponentType } from "react";
import type { FieldPath, FieldValues } from "react-hook-form";

type BaseField<T extends FieldValues> = {
  name: FieldPath<T>;
  label: string;
  placeholder?: string;
  description?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
};

export type FieldOption = {
  label: string;
  value: string;
  disabled?: boolean;
};

export type FormFieldConfig<T extends FieldValues> =
  | (BaseField<T> & {
      type: "input";
      inputType?: "text" | "email" | "password" | "number";
      icon?: ComponentType<{ className?: string }>;
    })
  | (BaseField<T> & {
      type: "textarea";
      rows?: number;
    })
  | (BaseField<T> & {
      type: "select";
      options: FieldOption[];
    })
  | (BaseField<T> & {
      type: "switch";
    })
  | (BaseField<T> & {
      type: "dropdown";
      options: FieldOption[];
      searchable?: boolean;
      loading?: boolean;
      multiple?: boolean;
      hasVirtualScroller?: boolean;
      itemSize?: number;
      onChange?: (value: string | string[]) => void;
    })
  | (BaseField<T> & {
      type: "radio";
      options: FieldOption[];
    });

type DropdownFieldConfig<T extends FieldValues> = BaseField<T> & {
  type: "dropdown";
  options: FieldOption[];
  searchable?: boolean;
  loading?: boolean;
  onChange?: (value: string) => void;
};
