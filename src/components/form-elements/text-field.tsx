"use client";

import { CaseSensitiveIcon, Text, TextIcon, TypeIcon } from "lucide-react";
import { ElementsType, FormElement, FormElementInstance } from ".";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useDesigner } from "@/hooks/useDesigner";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Switch } from "../ui/switch";
import { cn } from "@/lib/utils";

const type: ElementsType = "TextField";
const extraAttributes = {
  label: "Text field",
  helperText: "Helper text",
  required: false,
  placeholder: "Value here...",
};

const propertiesSchema = z.object({
  label: z.string().min(2).max(50),
  helperText: z.string().max(200),
  required: z.boolean().default(false),
  placeholder: z.string().max(50),
});

type PropertiesSchemaType = z.infer<typeof propertiesSchema>;

export const TextFieldFormElement: FormElement = {
  type,
  build: (id) => ({
    id,
    type,
    extraAttributes,
  }),

  designerButtonElement: {
    icon: TypeIcon,
    label: "Text Field",
  },

  designerComponent: DesignerComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesComponent,
};

type DesignerComponentProps = {
  elementInstance: FormElementInstance;
};

type TextFieldInstance = FormElementInstance & {
  extraAttributes: typeof extraAttributes;
};

function PropertiesComponent({ elementInstance }: DesignerComponentProps) {
  const element = elementInstance as TextFieldInstance;

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
          name="label"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Label</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>
                The label of the field. <br /> It will be displayed above the
                field.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="placeholder"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Placeholder</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>Placeholder of the field.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="helperText"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Helper text</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>
                The helper text of the field. <br />
                It will br displayed below the field.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="required"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Required</FormLabel>
                <FormDescription>
                  The helper text of the field. <br />
                  It will br displayed below the field.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  {...field}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  value={String(field.value)}
                />
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

function FormComponent({
  elementInstance,
  isInvalid,
  errorMessage,
  ...inputProps
}: FormComponentProps) {
  const element = elementInstance as TextFieldInstance;

  const { label, required, helperText, placeholder } = element.extraAttributes;

  const fieldMessage = errorMessage || helperText;

  return (
    <div className="flex flex-col gap-2 w-full">
      <Label className={cn(isInvalid && "text-red-500")}>
        {label}
        {required && "*"}
      </Label>
      <Input
        {...inputProps}
        className={cn(isInvalid && "border-red-500")}
        placeholder={placeholder}
        required={required}
      />

      {fieldMessage && (
        <p
          className={cn(
            "text-muted-foreground text-xs",
            isInvalid && "text-red-500"
          )}
        >
          {fieldMessage}
        </p>
      )}
    </div>
  );
}
function DesignerComponent({ elementInstance }: DesignerComponentProps) {
  const element = elementInstance as TextFieldInstance;

  const { label, required, helperText, placeholder } = element.extraAttributes;

  return (
    <div className="flex flex-col gap-2 w-full">
      <Label>
        {label}
        {required && "*"}
      </Label>
      <Input
        readOnly
        disabled
        placeholder={placeholder}
        className="bg-transparent! border-transparent"
      />

      {helperText && (
        <p className="text-muted-foreground text-xs">{helperText}</p>
      )}
    </div>
  );
}
