'use client'

import { cn } from "@/lib/utils";
import { useDraggable } from "@dnd-kit/core";
import { FormElement } from "../form-elements";
import { Button } from "../ui/button";

type SidebarButtonElementProps = {
  formElement: FormElement;
};

export function SidebarButtonElement({
  formElement,
}: SidebarButtonElementProps) {
  const { icon: Icon, label } = formElement.designerButtonElement;

  const draggable = useDraggable({
    id: `designer-button-${formElement.type}`,
    data: {
      type: formElement.type,
      isDesignerButtonElement: true,
    },
  });

  return (
    <Button
      ref={draggable.setNodeRef}
      variant="outline"
      className={cn(
        "flex flex-col gap-2 size-30 cursor-grab",
        draggable.isDragging && "ring-2 ring-primary"
      )}
      {...draggable.listeners}
      {...draggable.attributes}
    >
      <Icon className="size-8 text-primary cursor-grab" />
      <p className="text-xs">{label}</p>
    </Button>
  );
}

export function SidebarButtonElementDragOverlay({
  formElement,
}: SidebarButtonElementProps) {
  const { icon: Icon, label } = formElement.designerButtonElement;

  return (
    <Button
      variant="outline"
      className="flex flex-col gap-2 size-30 cursor-grab"
    >
      <Icon className="size-8 text-primary cursor-grab" />
      <p className="text-xs">{label}</p>
    </Button>
  );
}
