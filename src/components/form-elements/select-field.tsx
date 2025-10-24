"use client";

import { useDesigner } from "@/hooks/useDesigner";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { ListCheckIcon, PlusIcon, XIcon } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ElementsType, FormElement, FormElementInstance } from ".";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Switch } from "../ui/switch";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";

const type: ElementsType = "SelectField";
const extraAttributes = {
  label: "Select field",
  helperText: "Helper text",
  required: false,
  placeholder: "Value here...",
  options: [],
};

const propertiesSchema = z.object({
  label: z.string().min(2).max(50),
  helperText: z.string().max(200),
  required: z.boolean().default(false),
  placeholder: z.string().max(50),
  options: z.array(z.string()).default([]),
});

type PropertiesSchemaType = z.infer<typeof propertiesSchema>;

export const SelectFieldFormElement: FormElement = {
  type,
  build: (id) => ({
    id,
    type,
    extraAttributes,
  }),

  designerButtonElement: {
    icon: ListCheckIcon,
    label: "Select Field",
  },

  designerComponent: DesignerComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesComponent,
};

type DesignerComponentProps = {
  elementInstance: FormElementInstance;
};

type SelectFieldInstance = FormElementInstance & {
  extraAttributes: typeof extraAttributes;
};

function PropertiesComponent({ elementInstance }: DesignerComponentProps) {
  const element = elementInstance as SelectFieldInstance;

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
        <Separator />
        <FormField
          control={form.control}
          name="options"
          render={({ field }) => (
            <FormItem>
              <div className="flex justify-between items-center">
                <FormLabel>Options</FormLabel>
                <Button
                  type="button"
                  variant={"outline"}
                  onClick={() => {
                    form.setValue("options", field.value?.concat("New option"));
                  }}
                >
                  <PlusIcon />
                  Add
                </Button>
              </div>
              <div className="flex flex-col gap-2">
                {field.value?.map((option, index) => (
                  <div key={index} className="flex items-center gap-1">
                    <Input
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...(field.value || [])];
                        newOptions[index] = e.target.value;
                        field.onChange(newOptions);
                      }}
                    />

                    <Button
                      type="button"
                      variant={"ghost"}
                      size={"icon"}
                      onClick={() => {
                        const newOptions = [...(field.value || [])];
                        newOptions.splice(index, 1);
                        field.onChange(newOptions);
                      }}
                    >
                      <XIcon />
                    </Button>
                  </div>
                ))}
              </div>
              {/* <FormControl>
                <Input {...field} />
              </FormControl> */}
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
  const element = elementInstance as SelectFieldInstance;

  const { label, required, helperText, placeholder, options } =
    element.extraAttributes;

  const fieldMessage = errorMessage || helperText;

  return (
    <div className="flex flex-col gap-2 w-full">
      <Label className={cn(isInvalid && "text-red-500")}>
        {label}
        {required && "*"}
      </Label>
      {/* <Input
        {...inputProps}
        className={cn(isInvalid && "border-red-500")}
        placeholder={placeholder}
        required={required}
      /> */}

      <Select defaultValue={inputProps.value?.toString()} onValueChange={inputProps.onChange as any}>
        <SelectTrigger className={cn("w-full", isInvalid && "border-red-500")}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>

        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

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
  const element = elementInstance as SelectFieldInstance;

  const { label, required, helperText, placeholder } = element.extraAttributes;

  return (
    <div className="flex flex-col gap-2 w-full">
      <Label>
        {label}
        {required && "*"}
      </Label>
      <Select>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
      </Select>

      {helperText && (
        <p className="text-muted-foreground text-xs">{helperText}</p>
      )}
    </div>
  );
}
