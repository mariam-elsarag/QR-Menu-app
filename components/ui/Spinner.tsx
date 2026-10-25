import React from "react";

type SpinnerSize = "lg" | "md" | "sm";

interface SpinnerProps {
  size?: SpinnerSize;
  color?: string;
  className?: string;
}

const spinnerSize: Record<SpinnerSize, string> = {
  lg: "w-12 h-12 border-3",
  md: "w-7 h-7 border-2",
  sm: "w-4 h-4 border-2",
};

const Spinner = ({
  size = "md",
  color = "border-primary",
  className = "",
}: SpinnerProps) => {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={`rounded-full animate-spin border-t-transparent ${spinnerSize[size]} border ${color} ${className}`}
    />
  );
};

export default Spinner;
