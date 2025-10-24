import { useDesigner } from "@/hooks/useDesigner";
import { Button } from "@/components/ui/button";
import { ScanEye } from "lucide-react";
import { FormElements } from "./form-elements";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";

export function PreviewDialogButton() {
  const { elements } = useDesigner();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <ScanEye className="size-5" />
          Preview
        </Button>
      </DialogTrigger>
      <DialogContent className="w-screen h-screen max-h-screen max-w-full! flex flex-col grow p-0 gap-0">
        <DialogTitle className="px-4 py-2 border-b">
          <p className="text-lg font-bold text-muted-foreground">
            Form preview
          </p>
          <span className="text-sm font-normal text-muted-foreground">
            Thus is how your form will look like to your users.
          </span>
        </DialogTitle>
        <div className="bg-accent flex flex-col grow items-center justify-center p-4 bg-[url(/paper.svg)] dark:bg-[url(/paper-dark.svg)] overflow-y-auto">
          <div className="max-w-[620px] flex flex-col gap-4 grow bg-background h-full w-full rounded-2xl p-8 overflow-y-auto">
            {elements.map((element) => {
              const FormComponent = FormElements[element.type].formComponent;

              return (
                <FormComponent key={element.id} elementInstance={element} />
              );
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
