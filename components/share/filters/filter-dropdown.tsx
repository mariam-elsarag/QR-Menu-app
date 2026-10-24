"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Check, ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";

import type { DropdownFilter } from "./types";

type FilterDropdownProps = {
  filter: DropdownFilter;
  value?: string | string[];
  onChange: (value: string | string[]) => void;
};

const VIRTUALIZATION_THRESHOLD = 40;
const ITEM_SIZE = 36;
const MAX_LIST_HEIGHT = 240;
const OVERSCAN = 5;

export function FilterDropdown({
  filter,
  value,
  onChange,
}: FilterDropdownProps) {
  const t = useTranslations();

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const listRef = useRef<HTMLDivElement | null>(null);

  const selectedValues = Array.isArray(value)
    ? value
    : value !== undefined
      ? [value]
      : [];

  const shouldVirtualize = filter.children.length > VIRTUALIZATION_THRESHOLD;

  const filteredOptions = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();

    if (!query) return filter.children;

    return filter.children.filter((option) =>
      option.name.toLocaleLowerCase().includes(query),
    );
  }, [filter.children, search]);

  const virtualizer = useVirtualizer({
    count: shouldVirtualize ? filteredOptions.length : 0,
    getScrollElement: () => listRef.current,
    estimateSize: () => ITEM_SIZE,
    overscan: OVERSCAN,
  });

  useEffect(() => {
    virtualizer.measure();
    virtualizer.scrollToOffset(0);

    if (listRef.current) {
      listRef.current.scrollTop = 0;
    }
  }, [search, virtualizer]);

  useEffect(() => {
    if (!open) {
      setSearch("");
    }
  }, [open]);

  const handleSelect = (selectedValue: string) => {
    if (!filter.multiple) {
      onChange(selectedValue);
      setOpen(false);
      return;
    }

    const updatedValues = selectedValues.includes(selectedValue)
      ? selectedValues.filter((item) => item !== selectedValue)
      : [...selectedValues, selectedValue];

    onChange(updatedValues);
  };

  const selectedLabels = filter.children
    .filter((option) => selectedValues.includes(option.value))
    .map((option) => option.name)
    .join(", ");

  const renderOption = (option: (typeof filter.children)[number]) => {
    const isSelected = selectedValues.includes(option.value);

    return (
      <>
        <span className="flex-1 truncate">{option.name}</span>

        {isSelected && <Check className="size-4 shrink-0 " />}
      </>
    );
  };

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
            <span
              className={`truncate capitalize text-[13px] ${
                selectedLabels ? "text-ink" : "text-muted-ink"
              }`}
            >
              {selectedLabels || filter.placeholder}
            </span>
            <ChevronDown
              className={`ml-2 size-4 shrink-0 text-muted-foreground transition-transform duration-200 ${
                open ? "rotate-180" : ""
              }`}
            />{" "}
          </Button>
        </PopoverTrigger>

        <PopoverContent align="start" className="w-[var(--anchor-width)] p-0">
          <Command shouldFilter={false}>
            <CommandInput
              value={search}
              onValueChange={setSearch}
              placeholder={`Search ${filter.label}...`}
            />

            <CommandList ref={listRef} className="max-h-[240px]">
              {filteredOptions.length === 0 ? (
                <CommandEmpty className="text-sm text-muted-ink">
                  {t("noResultsFound")}
                </CommandEmpty>
              ) : shouldVirtualize ? (
                <CommandGroup>
                  <div
                    className="relative w-full"
                    style={{
                      height: virtualizer.getTotalSize(),
                    }}
                  >
                    {virtualizer.getVirtualItems().map((item) => {
                      const option = filteredOptions[item.index];

                      if (!option) return null;

                      return (
                        <CommandItem
                          key={option.value}
                          value={option.value}
                          onSelect={() => handleSelect(option.value)}
                          className="absolute left-0 top-0 flex w-full items-center justify-between"
                          style={{
                            height: ITEM_SIZE,
                            transform: `translateY(${item.start}px)`,
                          }}
                        >
                          {renderOption(option)}
                        </CommandItem>
                      );
                    })}
                  </div>
                </CommandGroup>
              ) : (
                <CommandGroup>
                  {filteredOptions.map((option) => (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      onSelect={() => handleSelect(option.value)}
                      className="flex items-center justify-between"
                    >
                      {renderOption(option)}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
