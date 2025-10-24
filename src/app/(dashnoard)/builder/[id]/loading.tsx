import { LoaderIcon } from "lucide-react";
import React from "react";

export default function loading() {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <LoaderIcon className="animate-spin size-12" />
    </div>
  );
}
