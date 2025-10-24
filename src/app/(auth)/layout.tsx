import { Header } from "@/components/header";
import { ReactNode } from "react";

export default function DashLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen w-full bg-background">
      <Header />

      <main className="grow grid place-content-center">{children}</main>
    </div>
  );
}
