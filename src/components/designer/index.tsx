"use client";

import { useDesigner } from "@/hooks/useDesigner";
import { generateId } from "@/lib/id-generator";
import { cn } from "@/lib/utils";
import { useDndMonitor, useDroppable } from "@dnd-kit/core";
import { ElementsType, FormElements } from "../form-elements";
import { DesignerElement } from "./designer-element";
import { DesignerSidebar } from "./sidebar";

export function Designer() {
  const { elements, addElement, setSelectedElement, removeElement } =
    useDesigner();

  useDndMonitor({
    onDragEnd(event) {
      const { active, over } = event;

      if (!active || !over) return;

      const isDesignerButtonElement =
        active.data.current?.isDesignerButtonElement;
      const isDroppingOverDesignerDropArea =
        over.data.current?.isDesignerDropArea;

      const droppingSidebarButtonOverDesignerDropArea =
        isDesignerButtonElement && isDroppingOverDesignerDropArea;

      if (droppingSidebarButtonOverDesignerDropArea) {
        const elementType = active.data.current?.type as ElementsType;
        const newElement = FormElements[elementType].build(generateId());

        addElement(elements.length, newElement);

        return;
      }

      const isDroppingOverDesignerElementTopHalf =
        over.data.current?.isTopHalfDesignerElement;
      const isDroppingOverDesignerElementBottomHalf =
        over.data.current?.isBottomHalfDesignerElement;

      const isDroppingOverDesignerElement =
        isDroppingOverDesignerElementTopHalf ||
        isDroppingOverDesignerElementBottomHalf;

      const droppingSidebarButtonOverDesignerElement =
        isDesignerButtonElement && isDroppingOverDesignerElement;

      if (droppingSidebarButtonOverDesignerElement) {
        const elementType = active.data.current?.type as ElementsType;
        const newElement = FormElements[elementType].build(generateId());

        const overElementId = over.data.current?.elementId;

        const overElementIndex = elements.findIndex(
          (element) => element.id === overElementId
        );

        if (overElementIndex === -1) {
          throw new Error("element not found");
        }

        const newElementIndex = isDroppingOverDesignerElementTopHalf
          ? overElementIndex
          : overElementIndex + 1;

        addElement(newElementIndex, newElement);

        return;
      }

      const isDraggingDesignerElement = active.data.current?.isDesignerElement;

      const draggingDesignerElementOverAnotherDesignerElement =
        isDroppingOverDesignerElement && isDraggingDesignerElement;

      if (draggingDesignerElementOverAnotherDesignerElement) {
        const activeId = active.data.current?.elementId;
        const overId = over.data.current?.elementId;

        const activeElementIndex = elements.findIndex(
          (element) => element.id === activeId
        );
        const overElementIndex = elements.findIndex(
          (element) => element.id === overId
        );

        if (activeElementIndex < 0 || overElementIndex < 0) {
          throw new Error("element not found");
        }

        const activeElement = { ...elements[activeElementIndex] };
        removeElement(activeId);

        const newElementIndex = isDroppingOverDesignerElementTopHalf
          ? overElementIndex
          : overElementIndex + 1;

        addElement(newElementIndex, activeElement);
      }
    },
  });

  const droppable = useDroppable({
    id: "designer-drop-area",
    data: {
      isDesignerDropArea: true,
    },
  });

  return (
    <div className="flex w-full h-full">
      <div
        className="p-4 w-full"
        onClick={(e) => {
          e.stopPropagation();
          setSelectedElement(null);
        }}
      >
        <div
          ref={droppable.setNodeRef}
          className={cn(
            "bg-background max-w-[920px] h-full m-auto rounded-xl flex flex-col grow items-center justify-start flex-1 overflow-y-auto",
            droppable.isOver && "ring-2 ring-primary"
          )}
        >
          {!droppable.isOver && elements.length === 0 && (
            <p className="text-3xl text-muted-foreground flex grow items-center font-bold">
              Drop here
            </p>
          )}

          {droppable.isOver && elements.length === 0 && (
            <div className="p-4 w-full">
              <div className="h-30 rounded-md bg-primary/20"></div>
            </div>
          )}

          {elements.length > 0 && (
            <div className="flex flex-col text-foreground w-full gap-2 p-4">
              {elements.map((formElement) => (
                <DesignerElement
                  key={formElement.id}
                  formElement={formElement}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <DesignerSidebar />
    </div>
  );
}
