import React from "react";

type FormHeaderProps = {
  title?: string;
  description?: string;
};
const FormHeader = ({ title, description }: FormHeaderProps) => {
  return (
    <div className="mb-9 space-y-3">
      {title && (
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          {title}
        </h1>
      )}

      {description && (
        <p className="max-w-sm text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  );
};

export default FormHeader;
