import Link from "next/link";
import React from "react";

export default function Logo() {
  return (
    <Link
      href={"/"}
      className="font-bold text-3xl bg-gradient-to-r from-lime-300 to-lime-400 text-transparent bg-clip-text "
    >
      Form Builder
    </Link>
  );
}
