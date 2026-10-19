"use client";

import { Fragment } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type TablePaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
};

const TablePagination = ({
  currentPage,
  totalPages,
  onPageChange,
  isLoading = false,
}: TablePaginationProps) => {
  if (totalPages <= 1) return null;

  const changePage = (page: number) => {
    if (isLoading || page < 1 || page > totalPages || page === currentPage) {
      return;
    }

    onPageChange(page);
  };

  const visiblePages = Array.from(
    { length: totalPages },
    (_, i) => i + 1,
  ).filter(
    (page) =>
      page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1,
  );

  return (
    <Pagination className=" w-fit mx-0">
      <PaginationContent className="flex flex-row items-center justify-center gap-1 whitespace-nowrap">
        <PaginationItem>
          <PaginationPrevious
            href="#"
            aria-disabled={isLoading || currentPage === 1}
            className={
              isLoading || currentPage === 1
                ? "pointer-events-none opacity-50"
                : "cursor-pointer"
            }
            onClick={(e) => {
              e.preventDefault();
              changePage(currentPage - 1);
            }}
          />
        </PaginationItem>

        {visiblePages.map((page, index) => (
          <Fragment key={page}>
            {index > 0 && page - visiblePages[index - 1] > 1 && (
              <PaginationItem>
                <PaginationEllipsis className="text-muted-ink" />
              </PaginationItem>
            )}

            <PaginationItem>
              <PaginationLink
                href="#"
                isActive={page === currentPage}
                aria-disabled={isLoading}
                className={
                  isLoading
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
                onClick={(e) => {
                  e.preventDefault();
                  changePage(page);
                }}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          </Fragment>
        ))}

        <PaginationItem>
          <PaginationNext
            href="#"
            aria-disabled={isLoading || currentPage === totalPages}
            className={
              isLoading || currentPage === totalPages
                ? "pointer-events-none opacity-50"
                : "cursor-pointer"
            }
            onClick={(e) => {
              e.preventDefault();
              changePage(currentPage + 1);
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default TablePagination;
