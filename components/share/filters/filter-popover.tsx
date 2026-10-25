"use client";

import { useState } from "react";
import { FilterIcon, ListFilter, RotateCcw } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { FilterDropdown } from "./filter-dropdown";
import { FilterDateRange } from "./filter-date-range";

import type { FilterConfig, FilterValues } from "./types";

type FilterPopoverProps = {
  filters: FilterConfig[];
  value?: FilterValues;
  onApply: (values: FilterValues) => void;
};

export function FilterPopover({
  filters,
  value = {},
  onApply,
}: FilterPopoverProps) {
  const t = useTranslations();

  const [open, setOpen] = useState(false);
  const [draftValues, setDraftValues] = useState<FilterValues>(value);

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      setDraftValues(value);
    }

    setOpen(nextOpen);
  };

  const handleChange = (key: string, nextValue: FilterValues[string]) => {
    setDraftValues((current) => ({
      ...current,
      [key]: nextValue,
    }));
  };

  const handleApply = () => {
    const cleanedValues = Object.fromEntries(
      Object.entries(draftValues).filter(([, filterValue]) => {
        if (Array.isArray(filterValue)) {
          return filterValue.length > 0;
        }

        if (typeof filterValue === "object" && filterValue !== null) {
          return Boolean(filterValue.from || filterValue.to);
        }

        return (
          filterValue !== "" &&
          filterValue !== undefined &&
          filterValue !== null
        );
      }),
    );

    onApply(cleanedValues);
    setOpen(false);
  };

  const handleCancel = () => {
    setDraftValues(value);
    setOpen(false);
  };

  const handleReset = () => {
    setDraftValues({});
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger>
        <Button
          size="icon-lg"
          aria-label={t("filter")}
          type="button"
          variant="outline"
        >
          <FilterIcon strokeWidth={1.6} className="size-4" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        side="bottom"
        sideOffset={8}
        collisionPadding={16}
        className="
          flex max-h-[var(--radix-popover-content-available-height)]
          w-[calc(100vw-2rem)] max-w-[340px]
          flex-col gap-4 overflow-y-auto p-4
        "
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between">
          <h3 className="font-semibold text-ink">Filters</h3>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="text-muted-ink"
          >
            <RotateCcw className="size-4" />
            {t("reset")}
          </Button>
        </div>

        {/* Filter fields */}
        <div className="min-w-0 space-y-4">
          {filters.map((filter) => {
            const filterValue = draftValues[filter.key];

            if (filter.type === "dropdown") {
              return (
                <FilterDropdown
                  key={filter.key}
                  filter={filter}
                  value={
                    typeof filterValue === "string" ||
                    Array.isArray(filterValue)
                      ? filterValue
                      : undefined
                  }
                  onChange={(nextValue) => handleChange(filter.key, nextValue)}
                />
              );
            }

            return (
              <FilterDateRange
                key={filter.key}
                filter={filter}
                value={
                  draftValues[filter.key] as
                    | {
                        from?: string;
                        to?: string;
                      }
                    | undefined
                }
                onChange={(nextValue) => handleChange(filter.key, nextValue)}
              />
            );
          })}
        </div>

        {/* Footer */}
        <div className="grid grid-cols-2 gap-2 border-t pt-4">
          <Button
            type="button"
            size="md"
            variant="outline"
            onClick={handleCancel}
          >
            {t("cancel")}
          </Button>

          <Button type="button" size="md" onClick={handleApply}>
            {t("applyFilter")}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
