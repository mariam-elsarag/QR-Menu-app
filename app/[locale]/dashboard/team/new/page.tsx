import { Suspense } from "react";

import FullPageLoader from "@/components/share/full-page-loader";
import { handleAuthError } from "@/src/lib/auth/handle-action-error";
import { getRolesDropdownList } from "@/src/features/team/actions/get-roles";
import UsersForm from "@/src/features/team/components/users-form";
import { redirect } from "@/src/i18n/navigation";
import { UserFormValues } from "@/src/features/team/user/schemas/create-user.schema";
import { createUser } from "@/src/features/team/user/actions/create-user";

type NewUserProps = {
  params: Promise<{
    locale: "en" | "ar";
  }>;
};

async function NewUserContent({ params }: NewUserProps) {
  const { locale } = await params;
  const result = await getRolesDropdownList();

  if (!result.success) {
    if (
      result.error === "UNAUTHORIZED" ||
      result.error === "PERMISSION_DENIED"
    ) {
      handleAuthError(result.error, locale);
    }
    return <p>Failed to load roles. Please try again.</p>;
  }

  return <UsersForm roles={result.data} onSubmit={createUser} />;
}

export default function NewUser(props: NewUserProps) {
  return (
    <Suspense fallback={<FullPageLoader />}>
      <NewUserContent {...props} />
    </Suspense>
  );
}
