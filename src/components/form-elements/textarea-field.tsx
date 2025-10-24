"use client";

import { useDesigner } from "@/hooks/useDesigner";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { CaptionsIcon } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  ElementsType,
  FormComponentCustomProps,
  FormElement,
  FormElementInstance,
} from ".";
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
import { Slider } from "../ui/slider";
import { Switch } from "../ui/switch";
import { Textarea } from "../ui/textarea";

const type: ElementsType = "TextareaField";
const extraAttributes = {
  label: "Textarea field",
  helperText: "Helper text",
  required: false,
  placeholder: "Value here...",
  rows: 3,
};

const propertiesSchema = z.object({
  label: z.string().min(2).max(50),
  helperText: z.string().max(200),
  required: z.boolean().default(false),
  placeholder: z.string().max(50),
  rows: z.number().min(1).max(10),
});

type PropertiesSchemaType = z.infer<typeof propertiesSchema>;

export const TextareaFieldFormElement: FormElement = {
  type,
  build: (id) => ({
    id,
    type,
    extraAttributes,
  }),

  designerButtonElement: {
    icon: CaptionsIcon,
    label: "Textarea Field",
  },

  designerComponent: DesignerComponent,
  formComponent: FormComponent as FormElement["formComponent"],
  propertiesComponent: PropertiesComponent,
};

type DesignerComponentProps = {
  elementInstance: FormElementInstance;
};

type TextareaFieldInstance = FormElementInstance & {
  extraAttributes: typeof extraAttributes;
};

function PropertiesComponent({ elementInstance }: DesignerComponentProps) {
  const element = elementInstance as TextareaFieldInstance;

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
          name="rows"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rows {field.value}</FormLabel>
              <FormControl>
                <Slider
                  defaultValue={[field.value]}
                  min={1}
                  max={10}
                  step={1}
                  onValueChange={(value) => field.onChange(value[0])}
                />
                {/* <Input {...field} /> */}
              </FormControl>
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

type FormComponentProps = React.ComponentProps<"textarea"> &
  FormComponentCustomProps;

function FormComponent({
  elementInstance,
  isInvalid,
  errorMessage,
  ...inputProps
}: FormComponentProps) {
  const element = elementInstance as TextareaFieldInstance;

  const { label, required, helperText, placeholder, rows } =
    element.extraAttributes;

  const fieldMessage = errorMessage || helperText;

  return (
    <div className="flex flex-col gap-2 w-full">
      <Label className={cn(isInvalid && "text-red-500")}>
        {label}
        {required && "*"}
      </Label>
      <Textarea
        {...inputProps}
        rows={rows}
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
  const element = elementInstance as TextareaFieldInstance;

  const { label, required, helperText, placeholder } = element.extraAttributes;

  return (
    <div className="flex flex-col gap-2 w-full">
      <Label>
        {label}
        {required && "*"}
      </Label>
      <Textarea
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
