"use client";

import { ShieldCheck, Users } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Suspense, useTransition } from "react";

import PageTabs from "@/components/dashboard/tabs";
import type { PageTabItem } from "@/components/dashboard/types";
import PageLayout from "@/components/share/page-layout";
import type { GetRolesResult } from "../type/types";
import type { GetUsersResult } from "../user/typse/types";
import RolesTable from "./roles-table";
import UsersTable from "../user/components/users-table";

type SuccessResult<T> = Extract<T, { success: true }>;

type TeamManagmentLayoutProps =
  | {
      page: "roles";
      data: SuccessResult<GetRolesResult>;
    }
  | {
      page: "users";
      data: SuccessResult<GetUsersResult>;
    };

function TeamManagementContent(props: TeamManagmentLayoutProps) {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const teamTabs: PageTabItem[] = [
    {
      label: "Users",
      description: "Manage team members and their access.",
      value: "users",
      icon: Users,
    },
    {
      label: "Roles & Permissions",
      description: "Configure roles and control permissions.",
      value: "roles",
      icon: ShieldCheck,
    },
  ];

  const isRolesPage = props.page === "roles";

  function handleTabChange(value: string) {
    if (value !== "users" && value !== "roles") return;

    startTransition(() => {
      router.push(`/${locale}/dashboard/team?page=${value}`);
    });
  }

  return (
    <PageLayout
      title={t("navigation.teamManagment")}
      btnName={t(isRolesPage ? "createRole" : "addUser")}
      btnAction={() => {
        const path = isRolesPage
          ? "dashboard/team/roles/new"
          : "dashboard/team/new";

        router.push(`/${locale}/${path}`);
      }}
    >
      <div className="space-y-6">
        <PageTabs
          tabs={teamTabs}
          queryKey="page"
          defaultValue="users"
          onTabChange={handleTabChange}
        />

        {props.page === "roles" ? (
          <RolesTable response={props.data} loading={isPending} />
        ) : (
          <UsersTable response={props.data} loading={isPending} />
        )}
      </div>
    </PageLayout>
  );
}

export default function TeamManagmentLayout(props: TeamManagmentLayoutProps) {
  return (
    <Suspense fallback={null}>
      <TeamManagementContent {...props} />
    </Suspense>
  );
}
