"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { cn } from "@/lib/utils";
import type { PageTabItem } from "./types";

type PageTabsProps = {
  tabs: PageTabItem[];
  queryKey?: string;
  defaultValue?: string;
  className?: string;
};

export default function PageTabs({
  tabs,
  queryKey = "page",
  defaultValue,
  className,
}: PageTabsProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeValue =
    searchParams.get(queryKey) ?? defaultValue ?? tabs[0]?.value;

  function handleTabChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set(queryKey, value);

    router.push(`${pathname}?${params.toString()}`, {
      scroll: false,
    });
  }

  return (
    <nav
      aria-label="Page navigation"
      className={cn(
        "grid w-full min-w-0 grid-cols-1 gap-3",
        "sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2",
        className,
      )}
      style={{
        gridTemplateColumns: undefined,
      }}
    >
      {tabs.map((tab) => {
        const isActive = activeValue === tab.value;
        const Icon = tab.icon;

        return (
          <button
            key={tab.value}
            type="button"
            aria-pressed={isActive}
            onClick={() => handleTabChange(tab.value)}
            className={cn(
              "flex min-w-0 w-full items-center gap-3 cursor-pointer rounded-xl",
              "border p-3 text-start sm:p-4",
              "transition-colors duration-200",
              "focus-visible:outline-none focus-visible:ring-2",
              "focus-visible:ring-ring focus-visible:ring-offset-2",
              isActive
                ? "border-primary/25 bg-primary/[0.06] shadow-sm"
                : "border-border bg-card hover:border-primary/20",
            )}
          >
            <span
              className={cn(
                "flex size-10 shrink-0 items-center justify-center",
                "rounded-lg transition-colors sm:size-11",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground",
              )}
            >
              <Icon aria-hidden="true" className="size-5" />
            </span>

            <span className="flex min-w-0 flex-1 flex-col gap-1">
              <span className="text-sm font-semibold text-foreground">
                {tab.label}
              </span>

              <span
                className={cn(
                  "text-xs leading-relaxed text-muted-foreground",
                  isActive ? "line-clamp-2" : "line-clamp-1",
                )}
              >
                {tab.description}
              </span>
            </span>

            <span
              aria-hidden="true"
              className={cn(
                "size-2 shrink-0 rounded-full",
                isActive ? "bg-primary" : "bg-border",
              )}
            />
          </button>
        );
      })}
    </nav>
  );
}
