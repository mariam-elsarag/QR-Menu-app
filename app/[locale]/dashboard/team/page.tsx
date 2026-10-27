import FullPageLoader from "@/components/share/full-page-loader";
import { getRoles } from "@/src/features/team/actions/get-roles";
import { TeamErrorToast } from "@/src/features/team/components/team-error-toast";
import TeamManagmentLayout from "@/src/features/team/components/team-managment-layout";
import { getUsers } from "@/src/features/team/user/actions/get-users";
import { redirect } from "@/src/i18n/navigation";
import { handleAuthError } from "@/src/lib/auth/handle-action-error";
import { Suspense } from "react";

type TeamPageProps = {
  searchParams: Promise<{
    page?: string;
  }>;
  params: Promise<{
    locale: "en" | "ar";
  }>;
};

type TeamPageFallbackProps = {
  page: "roles" | "users";
  message: "failedToGetRoles" | "failedToGetUsers";
};

function TeamPageFallback({ page, message }: TeamPageFallbackProps) {
  return (
    <>
      <TeamErrorToast message={message} />

      {page === "roles" ? (
        <TeamManagmentLayout
          page="roles"
          data={{
            success: true,
            data: [],
            page: 1,
            pages: 0,
            count: 0,
          }}
        />
      ) : (
        <TeamManagmentLayout
          page="users"
          data={{
            success: true,
            data: [],
            page: 1,
            pages: 0,
            count: 0,
          }}
        />
      )}
    </>
  );
}
async function TeamContent({ searchParams, params }: TeamPageProps) {
  const searchParam = await searchParams;
  const { locale } = await params;

  const activePage = searchParam.page === "roles" ? "roles" : "users";
  if (activePage === "roles") {
    const result = await getRoles();

    if (!result.success) {
      if (
        result.error === "UNAUTHORIZED" ||
        result.error === "PERMISSION_DENIED"
      ) {
        handleAuthError(result.error, locale);
      }

      return <TeamPageFallback page="roles" message="failedToGetRoles" />;
    }

    return <TeamManagmentLayout page="roles" data={result} />;
  }

  const result = await getUsers();

  if (!result.success) {
    if (
      result.error === "UNAUTHORIZED" ||
      result.error === "PERMISSION_DENIED"
    ) {
      handleAuthError(result.error, locale);
    }

    return <TeamPageFallback page="users" message="failedToGetUsers" />;
  }

  return <TeamManagmentLayout page="users" data={result} />;
}
export default function TeamPage({ searchParams, params }: TeamPageProps) {
  return (
    <Suspense fallback={<FullPageLoader />}>
      <TeamContent searchParams={searchParams} params={params} />
    </Suspense>
  );
}
