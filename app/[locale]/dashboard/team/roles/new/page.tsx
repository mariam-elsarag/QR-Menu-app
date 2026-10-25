import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";

import FullPageLoader from "@/components/share/full-page-loader";
import RoleForm from "@/src/features/team/components/role-form";
import { getPermissions } from "@/src/features/team/actions/get-permissions";
import { createRole } from "@/src/features/team/actions/create-role";
// Import your actual create-role server action here.

async function CreateRoleContent() {
  const result = await getPermissions();

  if (!result.success) {
    const locale = await getLocale();

    if (result.error === "UNAUTHORIZED") {
      redirect(`/${locale}/login`);
    }

    if (result.error === "PERMISSION_DENIED") {
      redirect(`/${locale}/403`);
    }

    throw new Error("Failed to load permissions.");
  }

  return <RoleForm permissions={result.data} onSubmit={createRole} />;
}

export default function CreateNewRole() {
  return (
    <Suspense fallback={<FullPageLoader />}>
      <CreateRoleContent />
    </Suspense>
  );
}
