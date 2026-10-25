import FullPageLoader from "@/components/share/full-page-loader";
import { getRoles } from "@/src/features/team/actions/get-roles";
import { TeamErrorToast } from "@/src/features/team/components/team-error-toast";
import TeamManagmentLayout from "@/src/features/team/components/team-managment-layout";
import { redirect } from "@/src/i18n/navigation";
import { Suspense } from "react";

type TeamPageProps = {
  searchParams: Promise<{
    page?: string;
  }>;
  params: Promise<{
    locale: "en" | "ar";
  }>;
};

async function TeamContent({ searchParams, params }: TeamPageProps) {
  const searchParam = await searchParams;
  const { locale } = await params;

  const activePage = searchParam.page === "users" ? "users" : "role";

  if (activePage === "role") {
    const result = await getRoles();

    if (!result.success && result.error === "UNAUTHORIZED") {
      redirect({ href: "/login", locale: locale });
    }

    if (!result.success && result.error === "PERMISSION_DENIED") {
      redirect({ href: "/403", locale: locale });
    }

    if (!result.success) {
      return (
        <>
          <TeamErrorToast message="failedToGetRoles" />
          <TeamManagmentLayout
            data={{ success: true, data: [], page: 0, pages: 0, count: 0 }}
          />
        </>
      );
    }

    return <TeamManagmentLayout data={result} />;
  }

  // get user()
  return (
    <TeamManagmentLayout
      data={{ success: true, data: [], page: 0, pages: 0, count: 0 }}
    />
  );
}

export default function TeamPage({ searchParams, params }: TeamPageProps) {
  return (
    <Suspense fallback={<FullPageLoader />}>
      <TeamContent searchParams={searchParams} params={params} />
    </Suspense>
  );
}
