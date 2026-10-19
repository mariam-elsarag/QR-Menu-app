import React, { ReactNode } from "react";

export default function MenuLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <div>
      <h1>layout</h1>
      {children}
    </div>
  );
}
