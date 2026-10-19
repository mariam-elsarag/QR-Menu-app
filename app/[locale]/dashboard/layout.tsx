import DashboardWrapper from "@/components/dashboard/dashboard-wrapper";
import { ReactNode } from "react";

type DashboardLayoutProps = {
  children: ReactNode;
};
const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div>
      <DashboardWrapper>{children}</DashboardWrapper>
    </div>
  );
};

export default DashboardLayout;
