"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Eye, Pencil, Trash2 } from "lucide-react";

import TablePagination from "./table-pagination";
import TableLoader from "./table-loader";
import { useTranslations } from "next-intl";
import type { PaginatedResponse, TableColumn } from "./types";
import type { FilterConfig, FilterValues } from "../filters/types";
import { FilterPopover } from "../filters/filter-popover";

type TableWrapperProps<T extends { id: string | number }> =
  PaginatedResponse<T> & {
    columns: TableColumn<T>[];
    onPageChange: (page: number) => void;
    isLoading?: boolean;
    onView?: (row: T) => void;
    onEdit?: (row: T) => void;
    onDelete?: (row: T) => void;
    filters?: FilterConfig[];
    appliedFilters?: FilterValues;
    handleApplyFilters?: (values: FilterValues) => void;
  };

const TableWrapper = <T extends { id: string | number }>({
  data,
  columns,
  page,
  pages,
  count,
  onPageChange,
  isLoading = false,
  onView,
  onEdit,
  onDelete,
  filters,
  appliedFilters,
  handleApplyFilters,
}: TableWrapperProps<T>) => {
  const hasActions = Boolean(onView || onEdit || onDelete);
  const totalColumns = columns.length + (hasActions ? 1 : 0);
  const t = useTranslations();
  {
  }
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border">
        <header>
          {filters && handleApplyFilters && (
            <FilterPopover
              filters={filters}
              value={appliedFilters}
              onApply={handleApplyFilters}
            />
          )}
        </header>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-accent hover:bg-accent">
                {columns.map((column, idx) => (
                  <TableHead
                    key={String(column.field)}
                    className={`py-3 font-semibold text-primary ${
                      idx === 0 ? "ps-4 rounded-tl-xl" : ""
                    } ${columns?.length === idx && !hasActions ? "rounded-tr-xl" : ""}`}
                  >
                    {column.head}
                  </TableHead>
                ))}

                {hasActions && (
                  <TableHead className="w-[80px] rounded-tr-xl py-3 text-end font-semibold text-primary" />
                )}
              </TableRow>
            </TableHeader>

            {isLoading ? (
              <TableLoader columns={totalColumns} rows={5} />
            ) : (
              <TableBody>
                {data.length > 0 ? (
                  data.map((row) => (
                    <TableRow key={row.id}>
                      {columns.map((column) => {
                        const value = row[column.field];

                        return (
                          <TableCell
                            key={String(column.field)}
                            className="px-4 py-3.5 text-muted-ink"
                          >
                            {column.render
                              ? column.render(value, row)
                              : String(value ?? "-")}
                          </TableCell>
                        );
                      })}

                      {hasActions && (
                        <TableCell className="px-4 py-2 text-end">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="size-8"
                                aria-label="Open row actions"
                              >
                                <MoreHorizontal className="size-4" />
                              </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align="end">
                              {onView && (
                                <DropdownMenuItem
                                  onClick={() => onView(row)}
                                  className="cursor-pointer"
                                >
                                  <Eye className="me-2 size-4" />
                                  {t("view")}
                                </DropdownMenuItem>
                              )}

                              {onEdit && (
                                <DropdownMenuItem
                                  onClick={() => onEdit(row)}
                                  className="cursor-pointer"
                                >
                                  <Pencil className="me-2 size-4" />
                                  {t("edit")}
                                </DropdownMenuItem>
                              )}

                              {onDelete && (
                                <DropdownMenuItem
                                  onClick={() => onDelete(row)}
                                  variant="destructive"
                                  className="cursor-pointer text-destructive focus:text-destructive"
                                >
                                  <Trash2 className="me-2 size-4" />
                                  {t("delete")}
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={totalColumns}
                      className="h-24 text-center text-muted-foreground"
                    >
                      No results found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            )}
          </Table>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <span className="text-nowrap text-sm text-muted-foreground">
          {t("totalItems", { count })}
        </span>
        <TablePagination
          currentPage={page}
          totalPages={pages}
          onPageChange={onPageChange}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default TableWrapper;
