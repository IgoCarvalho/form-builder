"use client";

import { TrashIcon } from "lucide-react";
import { Button } from "../ui/button";
import { FormElementInstance, FormElements } from "../form-elements";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import { useDesigner } from "@/hooks/useDesigner";
import { cn } from "@/lib/utils";

type DesignerElementWrapperProps = {
  formElement: FormElementInstance;
};

export function DesignerElement({ formElement }: DesignerElementWrapperProps) {
  const { removeElement, setSelectedElement } = useDesigner();

  const topHalf = useDroppable({
    id: formElement.id + "-top",
    data: {
      type: formElement.type,
      elementId: formElement.id,
      isTopHalfDesignerElement: true,
    },
  });
  const bottomHalf = useDroppable({
    id: formElement.id + "-bottom",
    data: {
      type: formElement.type,
      elementId: formElement.id,
      isBottomHalfDesignerElement: true,
    },
  });

  const draggable = useDraggable({
    id: formElement.id + "-drag-handler",
    data: {
      type: formElement.type,
      elementId: formElement.id,
      isDesignerElement: true,
    },
  });

  if (draggable.isDragging) return null;

  const DesignerElementComponent =
    FormElements[formElement.type].designerComponent;

  return (
    <div
      ref={draggable.setNodeRef}
      {...draggable.listeners}
      {...draggable.attributes}
      onClick={(e) => {
        e.stopPropagation();
        setSelectedElement(formElement);
      }}
      className="relative group h-30 flex flex-col text-foreground hover:cursor-pointer rounded-md ring-1 ring-accent ring-inset"
    >
      <div
        ref={topHalf.setNodeRef}
        className={cn(
          "absolute  w-full h-1/2 rounded-t-md",
          topHalf.isOver && "border-t-4 border-primary"
        )}
      />
      <div
        ref={bottomHalf.setNodeRef}
        className={cn(
          "absolute bottom-0  w-full h-1/2 rounded-b-md",
          bottomHalf.isOver && "border-b-4 border-primary"
        )}
      />

      <div className="group-hover:flex hidden absolute bg inset-0  justify-center items-center">
        <div></div>

        <Button
          className="absolute right-0 h-full rounded-md rounded-l-none border hover:cursor-pointer bg-red-500"
          variant="secondary"
          onClick={(e) => {
            e.stopPropagation();
            removeElement(formElement.id);
          }}
        >
          <TrashIcon className="size-5" />
        </Button>

        <p className="text-muted-foreground text-sm animate-pulse">
          Click for properties or drag to move
        </p>
      </div>

      <div className="flex w-full items-center h-30 rounded-md bg-accent/40 px-4 py-2 pointer-events-none group-hover:opacity-30">
        <DesignerElementComponent elementInstance={formElement} />
      </div>
    </div>
  );
}
