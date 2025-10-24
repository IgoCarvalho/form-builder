import { ReactNode } from "react";
import Logo from "./logo";
import { ThemeSwitcher } from "./theme-switcher";

type HeaderProps = {
  UserButton?: ReactNode;
};

export function Header({ UserButton }: HeaderProps) {
  return (
    <div className="border-b border-border">
      <nav className="container mx-auto flex justify-between items-center  h-15 px-4 py-2">
        <Logo />
        <div className="flex gap-4 items-center">
          <ThemeSwitcher />
          {UserButton}
        </div>
      </nav>
    </div>
  );
}
