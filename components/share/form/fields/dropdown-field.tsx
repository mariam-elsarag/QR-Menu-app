"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import type {
  ControllerRenderProps,
  FieldPath,
  FieldValues,
} from "react-hook-form";
import { Check, ChevronDown, Loader2, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export type DropdownOption = {
  label: string;
  value: string;
  disabled?: boolean;
};

type DropdownFieldProps<T extends FieldValues> = {
  field: ControllerRenderProps<T, FieldPath<T>>;
  options: DropdownOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  searchable?: boolean;
  multiple?: boolean;
  loading?: boolean;
  disabled?: boolean;
  invalid?: boolean;
  hasVirtualScroller?: boolean;
  itemSize?: number;
  onChange?: (value: string | string[]) => void;
};

const DEFAULT_ITEM_SIZE = 40;
const DROPDOWN_MAX_HEIGHT = "20vh";
const OVERSCAN = 5;

const DropdownField = <T extends FieldValues>({
  field,
  options,
  placeholder = "Select an option",
  searchPlaceholder = "Search...",
  emptyMessage = "No results found.",
  searchable = false,
  multiple = false,
  loading = false,
  disabled = false,
  invalid = false,
  hasVirtualScroller = false,
  itemSize = DEFAULT_ITEM_SIZE,
  onChange,
}: DropdownFieldProps<T>) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const listRef = useRef<HTMLDivElement | null>(null);

  const selectedValues: string[] = multiple
    ? Array.isArray(field.value)
      ? field.value
      : []
    : typeof field.value === "string" && field.value
      ? [field.value]
      : [];

  const selectedOptions = options.filter((option) =>
    selectedValues.includes(option.value),
  );

  const filteredOptions = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();

    if (!searchable || !query) return options;

    return options.filter((option) =>
      option.label.toLocaleLowerCase().includes(query),
    );
  }, [options, search, searchable]);

  const virtualizer = useVirtualizer({
    count: filteredOptions.length,
    getScrollElement: () => listRef.current,
    estimateSize: () => itemSize,
    overscan: OVERSCAN,
  });

  const measureList = useCallback(() => {
    if (!listRef.current) return;

    virtualizer.measure();
    virtualizer.scrollToOffset(0);
  }, [virtualizer]);

  useEffect(() => {
    if (!open || !hasVirtualScroller) return;

    const frame = requestAnimationFrame(measureList);

    return () => cancelAnimationFrame(frame);
  }, [open, hasVirtualScroller, filteredOptions.length, measureList]);

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);

    if (!nextOpen) {
      setSearch("");
    }
  };

  const handleSelect = (value: string) => {
    let nextValue: string | string[];

    if (multiple) {
      nextValue = selectedValues.includes(value)
        ? selectedValues.filter((item) => item !== value)
        : [...selectedValues, value];

      field.onChange(nextValue);
      onChange?.(nextValue);
    } else {
      nextValue = value;

      field.onChange(value);
      onChange?.(value);

      setOpen(false);
      setSearch("");
    }
  };

  const clearSelection = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    const nextValue: string | string[] = multiple ? [] : "";

    field.onChange(nextValue);
    onChange?.(nextValue);
  };

  const renderOptionContent = (option: DropdownOption) => {
    const selected = selectedValues.includes(option.value);

    return (
      <>
        <Check
          aria-hidden="true"
          className={cn(
            "size-4 shrink-0",
            selected ? "opacity-100" : "opacity-0",
          )}
        />
        <span className="truncate">{option.label}</span>
      </>
    );
  };

  const renderOptions = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center gap-2 p-6 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          <span>Loading...</span>
        </div>
      );
    }

    if (filteredOptions.length === 0) {
      return (
        <div className="px-3 py-6 text-center text-sm text-muted-foreground">
          {emptyMessage}
        </div>
      );
    }

    // Regular scrolling mode.
    if (!hasVirtualScroller) {
      return (
        <div
          className="overflow-y-auto overflow-x-hidden"
          style={{ maxHeight: DROPDOWN_MAX_HEIGHT }}
        >
          {filteredOptions.map((option) => {
            const selected = selectedValues.includes(option.value);

            return (
              <button
                key={option.value}
                type="button"
                disabled={option.disabled}
                aria-pressed={selected}
                onClick={() => handleSelect(option.value)}
                className={cn(
                  "flex min-h-10 w-full items-center gap-2 px-3 py-2 text-start text-sm",
                  "hover:bg-accent disabled:pointer-events-none disabled:opacity-50",
                  selected && "bg-accent/50",
                )}
              >
                {renderOptionContent(option)}
              </button>
            );
          })}
        </div>
      );
    }

    const virtualItems = virtualizer.getVirtualItems();

    const itemsToRender =
      virtualItems.length > 0
        ? virtualItems
        : Array.from(
            {
              length: Math.min(
                filteredOptions.length,
                Math.ceil((listRef.current?.clientHeight ?? 120) / itemSize) +
                  OVERSCAN,
              ),
            },
            (_, index) => ({
              index,
              start: index * itemSize,
              size: itemSize,
              key: index,
            }),
          );

    return (
      <div
        ref={listRef}
        className="max-h-[30vh] overflow-y-auto overflow-x-hidden"
      >
        <div
          style={{
            height: filteredOptions.length * itemSize,
            position: "relative",
            width: "100%",
          }}
        >
          {itemsToRender.map((item) => {
            const option = filteredOptions[item.index];

            if (!option) return null;

            const selected = selectedValues.includes(option.value);

            return (
              <button
                key={option.value}
                type="button"
                disabled={option.disabled}
                aria-pressed={selected}
                onClick={() => handleSelect(option.value)}
                className={cn(
                  "absolute left-0 top-0 flex w-full items-center gap-2 px-3 text-start text-sm",
                  "hover:bg-accent disabled:pointer-events-none disabled:opacity-50",
                  selected && "bg-accent/50",
                )}
                style={{
                  height: itemSize,
                  transform: `translateY(${item.start}px)`,
                }}
              >
                {renderOptionContent(option)}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild className="h-11">
        <Button
          id={field.name}
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-invalid={invalid}
          disabled={disabled || loading}
          onBlur={field.onBlur}
          className={cn(
            "w-full justify-between font-normal",
            selectedOptions.length === 0 && "text-muted-foreground",
            invalid && "border-destructive",
          )}
        >
          <span className="truncate">
            {selectedOptions.length > 0
              ? selectedOptions.map((option) => option.label).join(", ")
              : placeholder}
          </span>

          <span className="ms-2 flex shrink-0 items-center gap-1">
            {selectedValues.length > 0 && (
              <button
                type="button"
                aria-label="Clear selection"
                className="rounded-sm p-1 hover:bg-muted"
                onClick={clearSelection}
                onPointerDown={(event) => event.stopPropagation()}
              >
                <X className="size-3" />
              </button>
            )}

            {loading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <ChevronDown
                className={cn(
                  "size-4 opacity-50 transition-transform duration-200",
                  open && "rotate-180",
                )}
              />
            )}
          </span>
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        className="w-(--radix-popover-trigger-width) overflow-hidden p-0"
        style={{
          maxHeight: "var(--radix-popover-content-available-height)",
        }}
      >
        {searchable && (
          <div className="border-b p-2">
            <input
              type="text"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);

                if (listRef.current) {
                  listRef.current.scrollTop = 0;
                }

                virtualizer.scrollToOffset(0);
              }}
              placeholder={searchPlaceholder}
              aria-label={searchPlaceholder}
              className="h-9 w-full bg-transparent px-2 text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
        )}

        {renderOptions()}
      </PopoverContent>
    </Popover>
  );
};

export default DropdownField;
