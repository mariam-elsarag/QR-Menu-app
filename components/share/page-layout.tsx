"use client";
import React, { ReactNode } from "react";
import { Button } from "../ui/button";
import { PlusIcon } from "lucide-react";

type PageLayoutProps = {
  children?: ReactNode;
  title: string;
  btnName?: string;
  btnAction?: () => void;
};
const PageLayout = ({
  children,
  title,
  btnName,
  btnAction,
}: PageLayoutProps) => {
  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-center justify-between gap-2">
        <h1 className="text-ink text-2xl font-medium ">{title}</h1>
        <Button size="md" onClick={btnAction}>
          <PlusIcon />
          {btnName}
        </Button>
      </header>
      <div>{children}</div>
    </div>
  );
};

export default PageLayout;
