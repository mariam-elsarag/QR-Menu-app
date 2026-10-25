"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";

import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type PermissionItem = {
  id: string;
  key: string;
};

type PermissionSelectorProps = {
  permissions: PermissionItem[];
  value: string[];
  onChange: (permissionIds: string[]) => void;
  disabled?: boolean;
};

const GROUP_LABELS: Record<string, string> = {
  dashboard: "dashboard",
  organization: "organization",
  settings: "settings",
  branch: "branches",
  category: "categories",
  product: "products",
  discount: "discounts",
  promotion: "promotions",
  user: "teamMembers",
  role: "roles",
  report: "reports",
};

const ACTION_LABELS: Record<string, string> = {
  view: "view",
  create: "create",
  update: "edit",
  delete: "delete",
  deactivate: "deactivate",
  manage: "manage",
  permissions_manage: "managePermissions",
};

const ACTION_ORDER = [
  "view",
  "create",
  "update",
  "delete",
  "deactivate",
  "manage",
  "permissions_manage",
];

function getGroup(key: string) {
  return key.split("_")[0];
}

function getAction(key: string) {
  return key.split("_").slice(1).join("_");
}

function formatLabel(key: string) {
  return key
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default function PermissionSelector({
  permissions,
  value,
  onChange,
  disabled = false,
}: PermissionSelectorProps) {
  const t = useTranslations("permissionSelector");

  const selected = useMemo(() => new Set(value), [value]);

  const groups = useMemo(() => {
    const map = new Map<string, PermissionItem[]>();

    for (const permission of permissions) {
      const group = getGroup(permission.key);
      const items = map.get(group) ?? [];

      items.push(permission);
      map.set(group, items);
    }

    return Array.from(map, ([key, items]) => ({
      key,
      items,
    }));
  }, [permissions]);

  const actions = useMemo(() => {
    const available = new Set(
      permissions.map((permission) => getAction(permission.key)),
    );

    return [
      ...ACTION_ORDER.filter((action) => available.has(action)),
      ...Array.from(available).filter(
        (action) => action && !ACTION_ORDER.includes(action),
      ),
    ];
  }, [permissions]);

  const selectedCount = permissions.filter((permission) =>
    selected.has(permission.id),
  ).length;

  function getLabel(key: string, fallback: string) {
    return t.has(key) ? t(key) : fallback;
  }

  function handleChange(permission: PermissionItem, checked: boolean) {
    const group = getGroup(permission.key);
    const action = getAction(permission.key);

    const groupPermissions = permissions.filter(
      (item) => getGroup(item.key) === group,
    );

    const viewPermission = groupPermissions.find(
      (item) => getAction(item.key) === "view",
    );

    const next = new Set(value);

    if (checked) {
      next.add(permission.id);

      if (action !== "view" && viewPermission) {
        next.add(viewPermission.id);
      }
    } else {
      next.delete(permission.id);

      if (action === "view") {
        for (const item of groupPermissions) {
          if (getAction(item.key) !== "view") {
            next.delete(item.id);
          }
        }
      }
    }

    onChange(Array.from(next));
  }

  function handleGroupChange(items: PermissionItem[], checked: boolean) {
    const next = new Set(value);

    for (const item of items) {
      if (checked) {
        next.add(item.id);
      } else {
        next.delete(item.id);
      }
    }

    onChange(Array.from(next));
  }

  return (
    <section className="min-w-0 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <h2 className="text-base font-semibold">{t("title")}</h2>
          <p className="text-sm text-muted-foreground">{t("description")}</p>
        </div>

        <span className="text-sm font-medium text-muted-foreground">
          {t("totalSelected", {
            selected: selectedCount,
            total: permissions.length,
          })}
        </span>
      </div>

      <div className="rounded-xl border border-border">
        <div className="w-full overflow-x-auto">
          <Table className="min-w-[700px]">
            <TableHeader>
              <TableRow className="bg-accent hover:bg-accent">
                <TableHead className=" rounded-tl-xl py-3 ps-4 font-semibold text-primary">
                  {getLabel("module", "Module")}
                </TableHead>

                {actions.map((action, idx) => (
                  <TableHead
                    key={action}
                    className={`min-w-[90px] px-3 py-3 text-center font-semibold text-primary ${actions?.length - 1 === idx ? "rounded-tr-xl" : ""}`}
                  >
                    {getLabel(
                      ACTION_LABELS[action] ?? "other",
                      formatLabel(action),
                    )}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody>
              {groups.map(({ key, items }) => {
                const label = getLabel(
                  GROUP_LABELS[key] ?? "other",
                  formatLabel(key),
                );

                const selectedInGroup = items.filter((item) =>
                  selected.has(item.id),
                ).length;

                const allSelected =
                  items.length > 0 && selectedInGroup === items.length;

                return (
                  <TableRow key={key}>
                    <TableCell className="px-4 py-3.5 text-muted-ink">
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={
                            allSelected
                              ? true
                              : selectedInGroup > 0
                                ? "indeterminate"
                                : false
                          }
                          disabled={disabled}
                          onCheckedChange={(checked) =>
                            handleGroupChange(items, checked === true)
                          }
                          aria-label={t("selectAll", { module: label })}
                        />

                        <span className="font-medium">{label}</span>
                      </div>
                    </TableCell>

                    {actions.map((action) => {
                      const permission = items.find(
                        (item) => getAction(item.key) === action,
                      );

                      return (
                        <TableCell
                          key={action}
                          className="px-3 py-3.5 text-center text-muted-ink"
                        >
                          {permission ? (
                            <div className="flex justify-center">
                              <Checkbox
                                checked={selected.has(permission.id)}
                                disabled={disabled}
                                onCheckedChange={(checked) =>
                                  handleChange(permission, checked === true)
                                }
                                aria-label={`${label}: ${getLabel(
                                  ACTION_LABELS[action] ?? "other",
                                  formatLabel(action),
                                )}`}
                              />
                            </div>
                          ) : (
                            <span className="text-muted-foreground/40">—</span>
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}

              {groups.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={actions.length + 1}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No permissions available.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">{t("dependencyHint")}</p>
    </section>
  );
}
