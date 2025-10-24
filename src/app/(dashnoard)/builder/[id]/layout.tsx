import { DesignerContextProvider } from "@/context/designer-context";
import React, { ReactNode } from "react";

export default function layout({ children }: { children: ReactNode }) {
  return (
    <DesignerContextProvider>
      <div className="flex w-full grow">{children}</div>
    </DesignerContextProvider>
  );
}
