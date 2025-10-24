import { FormElements } from "@/components/form-elements";
import { SidebarButtonElement } from "./sidebar-button-element";
import { useDesigner } from "@/hooks/useDesigner";
import { SidebarFormElements } from "./sidebar-form-elements";
import { SidebarElementProperties } from "./sidebar-element-properties";

export function DesignerSidebar() {
  const { selectedElement } = useDesigner();

  return (
    <aside className="w-100 max-w-100 flex flex-col grow gap-2 border-l-2 border-muted p-4 bg-background overflow-y-auto h-full">
      {!selectedElement && <SidebarFormElements />}
      {selectedElement && <SidebarElementProperties />}
    </aside>
  );
}
