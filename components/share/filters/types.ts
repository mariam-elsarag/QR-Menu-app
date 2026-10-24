export type FilterOption = {
  name: string;
  value: string;
};

export type DropdownFilter = {
  type: "dropdown";
  placeholder: string;
  key: string;
  label: string;
  multiple?: boolean;
  children: FilterOption[];
};

export type DateRangeFilter = {
  type: "date-range";
  key: string;
  label: string;
};

export type FilterConfig = DropdownFilter | DateRangeFilter;

export type FilterDateRangeValue = {
  from?: string;
  to?: string;
};

export type FilterValue = string | string[] | FilterDateRangeValue;

export type FilterValues = Record<string, FilterValue>;
