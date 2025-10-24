import { useDesigner } from "@/hooks/useDesigner";
import { Active, DragOverlay, useDndMonitor } from "@dnd-kit/core";
import { useState } from "react";
import { ElementsType, FormElements } from "../form-elements";
import { SidebarButtonElementDragOverlay } from "./sidebar-button-element";

export function DragOverlayWrapper() {
  const { elements } = useDesigner();
  const [draggedItem, setDraggedItem] = useState<Active | null>(null);

  useDndMonitor({
    onDragStart(event) {
      setDraggedItem(event.active);
    },
    onDragCancel() {
      setDraggedItem(null);
    },
    onDragEnd() {
      setDraggedItem(null);
    },
  });

  if (!draggedItem) return null;

  let node = <div>Nod drag overlay</div>;
  const isSidebarButtonElement =
    draggedItem.data.current?.isDesignerButtonElement;

  if (isSidebarButtonElement) {
    const elementType = draggedItem.data.current?.type as ElementsType;

    node = (
      <SidebarButtonElementDragOverlay
        formElement={FormElements[elementType]}
      />
    );
  }

  const isDesignerElement = draggedItem.data.current?.isDesignerElement;

  if (isDesignerElement) {
    const elementId = draggedItem.data.current?.elementId;

    const elementInstance = elements.find(
      (element) => element.id === elementId
    );

    if (!elementInstance) {
      node = <div>Element not found!</div>;
    } else {
      const DesignerElement =
        FormElements[elementInstance.type].designerComponent;

      node = (
        <div className="flex items-center bg-accent border rounded-md h-30 w-full py-2 px-4 opacity-80 pointer-events-none">
          <DesignerElement elementInstance={elementInstance} />
        </div>
      );
    }
  }

  return <DragOverlay>{node}</DragOverlay>;
}
