"use client";

import { ShieldCheck, KeyRound } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useTranslations } from "next-intl";

type PermissionListProps = {
  permissions: string[];
  roleType?: "OWNER" | "CUSTOM";
  visibleCount?: number;
};

export default function PermissionList({
  permissions,
  roleType = "CUSTOM",
  visibleCount = 3,
}: PermissionListProps) {
  const t = useTranslations();
  if (roleType === "OWNER") {
    return (
      <div className="flex items-center gap-2">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <ShieldCheck className="size-4" />
        </div>

        <div className="space-y-0.5">
          <p className="text-sm font-medium">{t("fullAccess")}</p>
          <p className="text-xs text-muted-foreground">
            {t("allPermissionsIncluded")}
          </p>
        </div>
      </div>
    );
  }

  if (permissions.length === 0) {
    return (
      <div className="space-y-0.5">
        <p className="text-sm font-medium">
          {t("permissionCount", { count: permissions.length })}
        </p>
        <p className="text-xs text-muted-foreground">
          {t("noPermissionsAssigned")}
        </p>{" "}
      </div>
    );
  }

  const visiblePermissions = permissions.slice(0, visibleCount);
  const remainingCount = Math.max(0, permissions.length - visibleCount);

  return (
    <div className="space-y-1">
      <p className="text-sm font-medium">
        {t("permissionCount", { count: permissions.length })}
      </p>

      <div className="flex flex-wrap items-center gap-x-1 text-sm text-muted-foreground">
        <span>{visiblePermissions.join(", ")}</span>

        {remainingCount > 0 && (
          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="font-medium text-primary hover:underline cursor-pointer"
              >
                {t("more", { count: remainingCount })}
              </button>
            </PopoverTrigger>

            <PopoverContent align="start" className="w-72">
              <p className="mb-2 text-sm font-semibold">
                {t("allPermissions", { count: permissions.length })}
              </p>

              <div className="flex flex-wrap gap-2">
                {permissions.map((permission) => (
                  <span
                    key={permission}
                    className="rounded-md bg-muted px-2 py-1 text-xs"
                  >
                    {permission}
                  </span>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>
    </div>
  );
}
