import { UpdateFormContent } from "@/actions/form";
import { useDesigner } from "@/hooks/useDesigner";
import { Button } from "@/components/ui/button";
import { LoaderIcon, SaveAll } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";

type SaveFormButtonProps = {
  formId: number;
};

export function SaveFormButton({ formId }: SaveFormButtonProps) {
  const [loading, startTransition] = useTransition();

  const { elements } = useDesigner();

  async function updateFormContent() {
    try {
      const formContent = JSON.stringify(elements);
      await UpdateFormContent(formId, formContent);

      toast("Success", { description: "Your form has been saved" });
    } catch (error) {
      toast.error("Error", { description: "Something went wrong" });
    }
  }

  return (
    <Button
      variant="outline"
      className="gap-2"
      disabled={loading}
      onClick={() => startTransition(updateFormContent)}
    >
      <SaveAll className="size-5" />
      Save
      {loading && <LoaderIcon className="size-5 animate-spin" />}
    </Button>
  );
}
