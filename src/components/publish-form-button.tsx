import { LoaderIcon, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { FormEvent, useTransition } from "react";
import { toast } from "sonner";
import { PublishForm } from "@/actions/form";
import { useRouter } from "next/navigation";

type PublishFormButtonProps = {
  formId: number;
};

export function PublishFormButton({ formId }: PublishFormButtonProps) {
  const router = useRouter();

  const [isLoading, startTransition] = useTransition();

  async function publishFormAction() {
    try {
      await PublishForm(formId);

      toast.success("Success", {
        description: "Your form is now available to the public",
      });

      router.refresh();
    } catch (error) {
      toast.error("Error", {
        description: "Something went wrong",
      });
    }
  }

  function handleFormPublish(event: FormEvent) {
    event.preventDefault();

    startTransition(publishFormAction);
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="gap-2 text-lime-950 font-bold bg-gradient-to-r from-lime-300 to-lime-400">
          <Upload className="size-5" />
          Publish
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>

          <AlertDialogDescription>
            This action cannot be undone. After you will not be able to edit
            this form.
            <br />
            <br />
            <span className="font-medium">
              By publishing this form you will make it available to the public
              and you will be able to collect submissions.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction disabled={isLoading} onClick={handleFormPublish}>
            Proceed {isLoading && <LoaderIcon className="animate-spin" />}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
