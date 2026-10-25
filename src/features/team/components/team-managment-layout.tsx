"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { ShieldCheck, Users } from "lucide-react";

import PageTabs from "@/components/dashboard/tabs";
import type { PageTabItem } from "@/components/dashboard/types";
import PageLayout from "@/components/share/page-layout";
import RolesTable from "./roles-table";
import UsersTable from "./users-table";
import { GetRolesResult, RoleItem } from "../type/types";

type TeamManagmentLayoutProps = {
  data: Extract<GetRolesResult, { success: true }>;
};
function TeamManagementContent({ data }: TeamManagmentLayoutProps) {
  const t = useTranslations();
  const locale = useLocale();
  const searchParams = useSearchParams();
  const router = useRouter();

  const activePage = searchParams.get("page") ?? "users";
  const isRolesPage = activePage === "roles";

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
        <PageTabs tabs={teamTabs} queryKey="page" defaultValue="users" />

        {isRolesPage ? <RolesTable response={data} /> : <UsersTable />}
      </div>
    </PageLayout>
  );
}

export default function TeamManagmentLayout({
  data,
}: TeamManagmentLayoutProps) {
  return (
    <Suspense fallback={null}>
      <TeamManagementContent data={data} />
    </Suspense>
  );
}
