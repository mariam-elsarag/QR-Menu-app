import AuthWrapper from "@/src/features/auth/components/auth-wrapper";
import React, { ReactNode } from "react";
type AuthLayoutProps = {
  children: ReactNode;
};
const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div>
      <AuthWrapper>{children}</AuthWrapper>
    </div>
  );
};

export default AuthLayout;
