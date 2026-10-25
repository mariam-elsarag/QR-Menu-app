import { ReactNode } from "react";

export type TableColumn<T> = {
  head: string;
  field: keyof T;
  render?: (value: T[keyof T], row: T) => ReactNode;
};

export type PaginatedResponse<T> = {
  data: T[];
  page: number;
  pages: number;
  count: number;
};
