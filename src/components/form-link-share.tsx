"use client";

import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { ShareIcon } from "lucide-react";
import { useIsClient } from "@/hooks/useIsClient";

type FormLinkShareProps = {
  shareUrl: string;
};

export function FormLinkShare({ shareUrl }: FormLinkShareProps) {
  const { isClient } = useIsClient();

  if (!isClient) return null;

  const shareLink = `${window.location.origin}/submit/${shareUrl}`;

  async function handleCopyLink() {
    await navigator.clipboard.writeText(shareLink);

    toast("Copied!", { description: "Link copied to clipboard" });
  }

  return (
    <div className="flex grow gap-4 items-center">
      <Input readOnly value={shareLink} />
      <Button className="w-[250px]" onClick={handleCopyLink}>
        <ShareIcon />
        Share link
      </Button>
    </div>
  );
}
