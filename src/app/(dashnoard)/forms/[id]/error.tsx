"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect } from "react";

export default function ErrorPage({ error }: { error: Error }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center gap-4 h-full w-full">
      <h2 className="text-destructive text-4xl">Something went wrong!</h2>

      <Button asChild>
        <Link href={"/"}>Go back to Home</Link>
      </Button>
    </div>
  );
}
