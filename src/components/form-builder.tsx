"use client";

import { useDesigner } from "@/hooks/useDesigner";
import { Form } from "@/generated/prisma";
import {
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import { toast } from "sonner";
import { Designer } from "./designer";
import { DragOverlayWrapper } from "./designer/drag-overlay-wrapper";
import { PreviewDialogButton } from "./preview-dialog-button";
import { PublishFormButton } from "./publish-form-button";
import { SaveFormButton } from "./save-form-button";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export function FormBuilder({ form }: { form: Form }) {
  const [shareUrl, setShareUrl] = useState("");
  const [confettiSize, setConfettiSize] = useState({ width: 0, height: 0 });
  const { setElements } = useDesigner();

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10,
    },
  });

  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 300,
      tolerance: 5,
    },
  });

  async function handleCopyLink() {
    await navigator.clipboard.writeText(shareUrl);

    toast("Copied!", { description: "Link copied to clipboard" });
  }

  useEffect(() => {
    const elementsParsed = JSON.parse(form.content);

    setShareUrl(`${window.location.origin}/submit/${form.shareURL}`);
    setConfettiSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
    setElements(elementsParsed);
  }, [form.content, setElements]);

  const sensors = useSensors(mouseSensor, touchSensor);

  if (form.published) {
    return (
      <>
        <Confetti
          numberOfPieces={1000}
          width={confettiSize.width}
          height={confettiSize.height}
          recycle={false}
        />
        <div className="flex flex-col items-center justify-center w-full h-full">
          <div className="max-w-[500px]">
            <h1 className="text-center text-4xl font-bold text-primary border-b pb-2 mb-10">
              🎊🎊 Form Published 🎊🎊
            </h1>
            <h2 className="text-2xl">Share this form</h2>
            <h3 className="text-xl text-muted-foreground border-b pb-10">
              Anyone with the link can view and submit the form
            </h3>
            <div
              className="my-4 flex flex-col gap-2 items-center w-full border-b pb-4
          "
            >
              <Input className="w-full" readOnly value={shareUrl} />

              <Button className="mt-2 w-full" onClick={handleCopyLink}>
                Copy link
              </Button>
            </div>

            <div
              className="
          flex justify-between"
            >
              <Button className="gap-2" variant={"link"} asChild>
                <Link href={"/"}>
                  <ArrowLeftIcon />
                  Go back home
                </Link>
              </Button>
              <Button className="gap-2" variant={"link"} asChild>
                <Link href={`/forms/${form.id}`}>
                  Form details
                  <ArrowRightIcon />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  }
  return (
    <DndContext sensors={sensors}>
      <main className="flex flex-col w-full">
        <nav className="flex gap-3 items-center justify-between border-b-2 p-4 ">
          <h2 className="truncate font-medium">
            <span className="text-muted-foreground mr-2">Form:</span>
            {form.name}
          </h2>
          <div className="flex items-center gap-2">
            <PreviewDialogButton />
            {!form.published && (
              <>
                <SaveFormButton formId={form.id} />
                <PublishFormButton formId={form.id} />
              </>
            )}
          </div>
        </nav>
        <div className="flex grow items-center justify-center relative overflow-y-auto h-[200px] w-full bg-accent bg-[url(/paper.svg)] dark:bg-[url(/paper-dark.svg)]">
          <Designer />
        </div>
      </main>

      <DragOverlayWrapper />
    </DndContext>
  );
}
