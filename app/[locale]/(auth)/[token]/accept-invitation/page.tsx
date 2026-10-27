import FullPageLoader from "@/components/share/full-page-loader";
import ChangePasswordForm from "@/src/features/auth/components/change-password-form";
import { acceptInvitationAction } from "@/src/features/team/invitations/actions/accept-invitation";
import { Suspense } from "react";

type PageProps = {
  params: Promise<{
    token: string;
  }>;
};

async function AcceptInvitaionContent({ params }: PageProps) {
  const { token } = await params;
  return (
    <ChangePasswordForm
      type="invitation"
      token={token}
      onSubmit={acceptInvitationAction}
    />
  );
}
export default async function AcceptInvitationPage({ params }: PageProps) {
  return (
    <Suspense fallback={<FullPageLoader />}>
      <AcceptInvitaionContent params={params} />
    </Suspense>
  );
}
