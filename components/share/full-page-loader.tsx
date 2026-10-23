import { LoaderCircle } from "lucide-react";

export default function FullPageLoader() {
  return (
    <div
      role="status"
      aria-label="Loading"
      className="fixed inset-0 z-50 flex min-h-dvh bg-white/20 backdrop-filter-4 w-full items-center justify-center"
    >
      <LoaderCircle
        aria-hidden="true"
        className="size-8 animate-spin text-primary"
        strokeWidth={1.75}
      />
    </div>
  );
}
