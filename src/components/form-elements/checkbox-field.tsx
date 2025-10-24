"use client";

import { useDesigner } from "@/hooks/useDesigner";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { SquareCheckIcon } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ElementsType, FormElement, FormElementInstance } from ".";
import { Checkbox } from "../ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";

const type: ElementsType = "CheckboxField";
const extraAttributes = {
  label: "Checkbox field",
  helperText: "Helper text",
  required: false,
};

const propertiesSchema = z.object({
  label: z.string().min(2).max(50),
  helperText: z.string().max(200),
  required: z.boolean().default(false),
});

type PropertiesSchemaType = z.infer<typeof propertiesSchema>;

export const CheckboxFieldFormElement: FormElement = {
  type,
  build: (id) => ({
    id,
    type,
    extraAttributes,
  }),

  designerButtonElement: {
    icon: SquareCheckIcon,
    label: "Checkbox Field",
  },

  designerComponent: DesignerComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesComponent,
};

type DesignerComponentProps = {
  elementInstance: FormElementInstance;
};

type CheckboxFieldInstance = FormElementInstance & {
  extraAttributes: typeof extraAttributes;
};

function PropertiesComponent({ elementInstance }: DesignerComponentProps) {
  const element = elementInstance as CheckboxFieldInstance;

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
  const element = elementInstance as CheckboxFieldInstance;

  const { label, required, helperText } = element.extraAttributes;

  const fieldMessage = errorMessage || helperText;
  const id = `form-checkbox-${element.id}`;

  return (
    <div className="flex items-start gap-2">
      <Checkbox
        id={id}
        className={cn(isInvalid && "text-red-500")}
        required={required}
        checked={(inputProps.value as any) === true}
        onCheckedChange={(checked) => {
          inputProps.onChange?.((checked === true) as any);
        }}
      />

      <div className="flex flex-col gap-1.5 leading-none">
        <Label htmlFor={id} className={cn(isInvalid && "text-red-500")}>
          {label}
          {required && "*"}
        </Label>
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
    </div>
  );
}

function DesignerComponent({ elementInstance }: DesignerComponentProps) {
  const element = elementInstance as CheckboxFieldInstance;

  const { label, required, helperText } = element.extraAttributes;

  const id = `designer-checkbox-${element.id}`;

  return (
    <div className="flex items-start gap-2">
      <Checkbox id={id} />

      <div className="flex flex-col gap-1.5 leading-none">
        <Label htmlFor={id}>
          {label}
          {required && "*"}
        </Label>
        {helperText && (
          <p className="text-muted-foreground text-xs">{helperText}</p>
        )}
      </div>
    </div>
  );
}
