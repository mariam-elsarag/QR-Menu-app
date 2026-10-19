"use client";
import React, { ReactNode, useState } from "react";
import Sidebar from "./sidebar";
import TopNav from "./top-nav";
type DashboardWrapperProps = {
  children: ReactNode;
};
const DashboardWrapper = ({ children }: DashboardWrapperProps) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className=" relative w-full max-w-384 px-4 md:px-0  py-4 md:py-8 min-h-dvh overflow-hidden">
      <Sidebar isOpen={isOpen} onClose={() => setIsOpen(false)} />
      <div
        className={`flex flex-col gap-6 md:w-[calc(100%_-_256px_-_90px)] md:me-8 ms-auto`}
      >
        <TopNav toggleSidebar={setIsOpen} />
        {children}
      </div>
    </div>
  );
};

export default DashboardWrapper;
