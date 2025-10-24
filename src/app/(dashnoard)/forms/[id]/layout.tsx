import { DesignerContextProvider } from "@/context/designer-context";
import React, { ReactNode } from "react";

export default function layout({ children }: { children: ReactNode }) {
  return <div className="flex flex-col w-full grow mx-auto">{children}</div>;
}
