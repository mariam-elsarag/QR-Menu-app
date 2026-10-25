"use client";

import { useState } from "react";
import { CalendarIcon, ChevronDown } from "lucide-react";
import { format, parseISO, isValid } from "date-fns";
import type { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import type { DateRangeFilter, FilterDateRangeValue } from "./types";

type FilterDateRangeProps = {
  filter: DateRangeFilter;
  value?: FilterDateRangeValue;
  onChange: (value: FilterDateRangeValue) => void;
};

function parseDate(value?: string) {
  if (!value) return undefined;

  const date = parseISO(value);
  return isValid(date) ? date : undefined;
}

export function FilterDateRange({
  filter,
  value,
  onChange,
}: FilterDateRangeProps) {
  const [open, setOpen] = useState(false);

  const selectedRange: DateRange = {
    from: parseDate(value?.from),
    to: parseDate(value?.to),
  };

  const handleSelect = (range?: DateRange) => {
    onChange({
      from: range?.from ? format(range.from, "yyyy-MM-dd") : undefined,
      to: range?.to ? format(range.to, "yyyy-MM-dd") : undefined,
    });

    if (range?.from && range?.to) {
      setOpen(false);
    }
  };

  const displayValue = () => {
    if (!selectedRange.from) {
      return "Select date range";
    }

    if (!selectedRange.to) {
      return format(selectedRange.from, "MMM dd, yyyy");
    }

    return `${format(selectedRange.from, "MMM dd, yyyy")} - ${format(selectedRange.to, "MMM dd, yyyy")}`;
  };

  const hasValue = Boolean(selectedRange.from);

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-ink">{filter.label}</label>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger>
          <Button
            type="button"
            variant="outline"
            className="h-10 w-full justify-between font-normal"
          >
            <span className="flex min-w-0 items-center gap-2">
              <CalendarIcon className="size-4 shrink-0 text-muted-foreground" />

              <span
                className={`truncate text-[13px] ${
                  hasValue ? "text-ink" : "text-muted-ink"
                }`}
              >
                {displayValue()}
              </span>
            </span>

            <ChevronDown
              className={`ml-2 size-4 shrink-0 text-muted-foreground transition-transform ${
                open ? "rotate-180" : ""
              }`}
            />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          align="start"
          sideOffset={8}
          className="w-auto max-w-[calc(100vw-2rem)] p-0"
        >
          <Calendar
            mode="range"
            selected={selectedRange}
            onSelect={handleSelect}
            numberOfMonths={1}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
