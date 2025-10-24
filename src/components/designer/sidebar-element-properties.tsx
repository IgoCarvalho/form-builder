import { useDesigner } from "@/hooks/useDesigner";
import React from "react";
import { FormElements } from "../form-elements";
import { Button } from "../ui/button";
import { XIcon } from "lucide-react";
import { Separator } from "../ui/separator";

export function SidebarElementProperties() {
  const { selectedElement, setSelectedElement } = useDesigner();

  if (!selectedElement) return null;

  const PropertiesForm = FormElements[selectedElement.type].propertiesComponent;

  return (
    <div className="flex flex-col p-2">
      <div className="flex items-center justify-between">
        <p className="text-sm text-foreground/70">ELement properties</p>

        <Button
          size="icon"
          variant="ghost"
          onClick={() => setSelectedElement(null)}
        >
          <XIcon />
        </Button>
      </div>
      <Separator className="mb-4" />

      <PropertiesForm elementInstance={selectedElement} />
    </div>
  );
}
