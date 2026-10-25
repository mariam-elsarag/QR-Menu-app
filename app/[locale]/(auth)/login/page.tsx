import AuthWrapper from "@/src/features/auth/components/auth-wrapper";
import { LoginForm } from "@/src/features/auth/components/login-form";
import SessionReasonToast from "@/src/features/auth/components/session-reason-toast";
import React from "react";

const page = () => {
  return (
    <>
      <LoginForm />
      <SessionReasonToast />
    </>
  );
};

export default page;
