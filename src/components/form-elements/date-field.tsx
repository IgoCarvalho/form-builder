"use client";

import { useDesigner } from "@/hooks/useDesigner";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarDaysIcon, CalendarIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ElementsType, FormElement, FormElementInstance } from ".";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
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
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Switch } from "../ui/switch";

const type: ElementsType = "DateField";
const extraAttributes = {
  label: "Date field",
  helperText: "Pick a date",
  required: false,
};

const propertiesSchema = z.object({
  label: z.string().min(2).max(50),
  helperText: z.string().max(200),
  required: z.boolean().default(false),
});

type PropertiesSchemaType = z.infer<typeof propertiesSchema>;

export const DateFieldFormElement: FormElement = {
  type,
  build: (id) => ({
    id,
    type,
    extraAttributes,
  }),

  designerButtonElement: {
    icon: CalendarDaysIcon,
    label: "Date Field",
  },

  designerComponent: DesignerComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesComponent,
};

type DesignerComponentProps = {
  elementInstance: FormElementInstance;
};

type DateFieldInstance = FormElementInstance & {
  extraAttributes: typeof extraAttributes;
};

function PropertiesComponent({ elementInstance }: DesignerComponentProps) {
  const element = elementInstance as DateFieldInstance;

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
  const element = elementInstance as DateFieldInstance;

  const [open, setOpen] = useState(false);

  const { label, required, helperText } = element.extraAttributes;

  const fieldMessage = errorMessage || helperText;

  return (
    <div className="flex flex-col gap-2 w-full">
      <Label className={cn(isInvalid && "text-red-500")}>
        {label}
        {required && "*"}
      </Label>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              isInvalid && "border-red-500"
            )}
          >
            <CalendarIcon className="size-4" />
            {inputProps.value ? (
              format(String(inputProps.value), "PPP")
            ) : (
              <span>Pick a date {inputProps.value}</span>
            )}
          </Button>
        </PopoverTrigger>

        <PopoverContent>
          <Calendar
            mode="single"
            selected={
              inputProps.value
                ? new Date(inputProps.value as string)
                : undefined
            }
            onSelect={(selectedDate) => {
              if (!selectedDate) return;
              inputProps.onChange?.(selectedDate.toUTCString() as any);
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>

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
  const element = elementInstance as DateFieldInstance;

  const { label, required, helperText, placeholder } = element.extraAttributes;

  return (
    <div className="flex flex-col gap-2 w-full">
      <Label>
        {label}
        {required && "*"}
      </Label>
      <Button
        variant={"outline"}
        className="w-full justify-start text-left font-normal"
      >
        <CalendarIcon className="size-4" />
        <span>Pick a date</span>
      </Button>

      {helperText && (
        <p className="text-muted-foreground text-xs">{helperText}</p>
      )}
    </div>
  );
}
