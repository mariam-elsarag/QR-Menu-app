"use client";

import Link from "next/link";
import { Fragment } from "react";
import { ChevronRight, Home } from "lucide-react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";

export type BreadcrumbHistoryItem = {
  label: string;
  href?: string;
};

type PageBreadcrumbsProps = {
  items: BreadcrumbHistoryItem[];
  showHome?: boolean;
  className?: string;
};

export default function PageBreadcrumbs({
  items,
  showHome = true,
  className,
}: PageBreadcrumbsProps) {
  return (
    <Breadcrumb className={className}>
      <BreadcrumbList className="gap-2">
        {showHome && (
          <>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link
                  href="/dashboard"
                  aria-label="Dashboard home"
                  className="flex items-center gap-1.5"
                >
                  <Home className="size-4" />
                  <span className="sr-only">Dashboard</span>
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>

            {items.length > 0 && (
              <BreadcrumbSeparator>
                <ChevronRight className="size-3.5" />
              </BreadcrumbSeparator>
            )}
          </>
        )}

        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <Fragment key={`${item.label}-${index}`}>
              <BreadcrumbItem>
                {isLast || !item.href ? (
                  <BreadcrumbPage
                    className={cn(
                      isLast
                        ? "font-medium text-foreground"
                        : "text-muted-foreground",
                    )}
                  >
                    {item.label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={item.href}>{item.label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>

              {!isLast && (
                <BreadcrumbSeparator>
                  <ChevronRight className="size-3.5" />
                </BreadcrumbSeparator>
              )}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
