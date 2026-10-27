import ChangePasswordForm from "@/src/features/auth/components/change-password-form";
import { resetPasswordAction } from "@/src/features/auth/actions/reset-password";

type PageProps = {
  params: Promise<{
    token: string;
  }>;
};

export default async function ResetPasswordPage({ params }: PageProps) {
  const { token } = await params;

  return (
    <ChangePasswordForm
      type="reset"
      token={token}
      onSubmit={resetPasswordAction}
    />
  );
}
