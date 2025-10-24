"use client";

import { SubmitForm } from "@/actions/form";
import { LoaderIcon, MousePointerClickIcon } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { FormElementInstance, FormElements } from "./form-elements";
import { Button } from "./ui/button";

type FormSubmitComponentProps = {
  formUrl: string;
  content: FormElementInstance[];
};

export function FormSubmitter({ content, formUrl }: FormSubmitComponentProps) {
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm();

  async function onSubmit(data: unknown) {
    try {
      const formContent = JSON.stringify(data);

      await SubmitForm(formUrl, formContent);

      setIsFormSubmitted(true);
    } catch (error) {
      toast.error("Error", { description: "Something went wrong" });
    }
  }

  function onFormInvalid(data: unknown) {
    toast.error("Error", { description: "Please check the form errors" });
  }

  if (isFormSubmitted) {
    return (
      <div className="">
        <p className="font-bold">Form submitted!</p>
        <span className="text-muted-foreground">
          Thank you for submitting the form, you can close this page now.
        </span>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit, onFormInvalid)}
      className="flex flex-col gap-4 grow w-full"
    >
      {content.map((element) => {
        const FormELement = FormElements[element.type].formComponent;

        return (
          <Controller
            key={element.id}
            name={element.id}
            control={control}
            rules={{
              required: {
                value: element.extraAttributes?.required,
                message: "Required field!",
              },
            }}
            render={({
              field: { value = "", ...field },
              fieldState: { invalid, error },
            }) => (
              <FormELement
                key={element.id}
                elementInstance={element}
                value={value}
                isInvalid={invalid}
                errorMessage={error?.message}
                {...field}
              />
            )}
          />
        );
      })}

      <Button className="mt-6" type="submit" disabled={isSubmitting}>
        {isSubmitting ? (
          <LoaderIcon className=" animate-spin" />
        ) : (
          <MousePointerClickIcon />
        )}
        Submit
      </Button>
    </form>
  );
}
