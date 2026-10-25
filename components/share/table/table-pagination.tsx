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
  const pages = Math.max(1, totalPages);
  const page = Math.min(Math.max(1, currentPage), pages);

  const changePage = (nextPage: number) => {
    if (isLoading || nextPage < 1 || nextPage > pages || nextPage === page) {
      return;
    }

    onPageChange(nextPage);
  };

  const visiblePages = Array.from({ length: pages }, (_, i) => i + 1).filter(
    (item) => item === 1 || item === pages || Math.abs(item - page) <= 1,
  );

  const previousDisabled = isLoading || page === 1;
  const nextDisabled = isLoading || page === pages;

  return (
    <Pagination className="w-fit mx-0">
      <PaginationContent className="flex flex-row items-center justify-center gap-1 whitespace-nowrap">
        <PaginationItem>
          <PaginationPrevious
            href="#"
            aria-disabled={previousDisabled}
            className={
              previousDisabled
                ? "pointer-events-none opacity-50"
                : "cursor-pointer"
            }
            onClick={(e) => {
              e.preventDefault();
              changePage(page - 1);
            }}
          />
        </PaginationItem>

        {visiblePages.map((item, index) => (
          <Fragment key={item}>
            {index > 0 && item - visiblePages[index - 1] > 1 && (
              <PaginationItem>
                <PaginationEllipsis className="text-muted-ink" />
              </PaginationItem>
            )}

            <PaginationItem>
              <PaginationLink
                href="#"
                isActive={item === page}
                aria-disabled={isLoading}
                className={
                  isLoading
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
                onClick={(e) => {
                  e.preventDefault();
                  changePage(item);
                }}
              >
                {item}
              </PaginationLink>
            </PaginationItem>
          </Fragment>
        ))}

        <PaginationItem>
          <PaginationNext
            href="#"
            aria-disabled={nextDisabled}
            className={
              nextDisabled ? "pointer-events-none opacity-50" : "cursor-pointer"
            }
            onClick={(e) => {
              e.preventDefault();
              changePage(page + 1);
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default TablePagination;
