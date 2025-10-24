"use client";

import { useDesigner } from "@/hooks/useDesigner";
import { zodResolver } from "@hookform/resolvers/zod";
import { CaseSensitiveIcon } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ElementsType, FormElement, FormElementInstance } from ".";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

const type: ElementsType = "ParagraphField";
const extraAttributes = {
  text: "Paragraph field",
};

const propertiesSchema = z.object({
  text: z.string().min(2).max(250),
});

type PropertiesSchemaType = z.infer<typeof propertiesSchema>;

export const ParagraphFieldFormElement: FormElement = {
  type,
  build: (id) => ({
    id,
    type,
    extraAttributes,
  }),

  designerButtonElement: {
    icon: CaseSensitiveIcon,
    label: "Paragraph field",
  },

  designerComponent: DesignerComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesComponent,
};

type DesignerComponentProps = {
  elementInstance: FormElementInstance;
};

type ParagraphFieldInstance = FormElementInstance & {
  extraAttributes: typeof extraAttributes;
};

function PropertiesComponent({ elementInstance }: DesignerComponentProps) {
  const element = elementInstance as ParagraphFieldInstance;

  const { updateElement } = useDesigner();

  const form = useForm({
    resolver: zodResolver(propertiesSchema),
    mode: "onBlur",
    defaultValues: {
      ...element.extraAttributes,
    },
  });

  useEffect(() => {
    form.reset(element.extraAttributes);
  }, [element, form]);

  function applyChanges(values: PropertiesSchemaType) {
    updateElement(element.id, {
      ...element,
      extraAttributes: {
        ...values,
      },
    });
  }

  return (
    <Form {...form}>
      <form
        onBlur={form.handleSubmit(applyChanges)}
        onSubmit={form.handleSubmit(applyChanges)}
        className="space-y-3"
      >
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Text</FormLabel>
              <FormControl>
                <Textarea {...field} rows={5} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}

type FormComponentProps = React.ComponentProps<FormElement["formComponent"]>;

function FormComponent({ elementInstance }: FormComponentProps) {
  const element = elementInstance as ParagraphFieldInstance;

  const { text } = element.extraAttributes;

  return <p>{text}</p>;
}

function DesignerComponent({ elementInstance }: DesignerComponentProps) {
  const element = elementInstance as ParagraphFieldInstance;

  const { text } = element.extraAttributes;

  return (
    <div className="flex flex-col gap-2 w-full">
      <Label className="text-muted-foreground">Paragraph field</Label>
      <p>{text}</p>
    </div>
  );
}
