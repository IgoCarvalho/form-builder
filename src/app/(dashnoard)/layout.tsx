import { Header } from "@/components/header";
import { UserButton } from "@/components/user-button";
import { ReactNode } from "react";

export default function DashLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen w-full bg-background">
      <Header UserButton={<UserButton />} />

      <main className="flex flex-grow w-full">{children}</main>
    </div>
  );
}
