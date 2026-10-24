"use client";
import { FilterPopover } from "@/components/share/filters/filter-popover";
import { FilterConfig, FilterValues } from "@/components/share/filters/types";
import PageLayout from "@/components/share/page-layout";
import { useTranslations } from "next-intl";
import React, { useState } from "react";

const filters: FilterConfig[] = [
  {
    type: "dropdown",
    label: "Role",
    key: "roleId",
    placeholder: "selct role",
    multiple: true,
    children: [
      { name: "Owner", value: "owner" },
      { name: "Manager", value: "manager" },
      { name: "Staff", value: "staff" },
    ],
  },
  {
    type: "dropdown",
    label: "Status",
    key: "isActive",
    placeholder: "select status",
    children: [
      { name: "Active", value: "true" },
      { name: "Inactive", value: "false" },
    ],
  },
  {
    type: "date-range",
    label: "Created Date",
    key: "createdAt",
  },
];
const TeamManagmentLayout = () => {
  const t = useTranslations();
  const [appliedFilters, setAppliedFilters] = useState<FilterValues>({});

  const handleApplyFilters = (values: FilterValues) => {
    setAppliedFilters(values);

    // Next step: connect these values to your
    // URL search params or data-fetching logic.
    console.log(values);
  };
  return (
    <PageLayout title={t("navigation.teamManagment")} btnName="add user">
      <FilterPopover
        filters={filters}
        value={appliedFilters}
        onApply={handleApplyFilters}
      />
    </PageLayout>
  );
};

export default TeamManagmentLayout;
