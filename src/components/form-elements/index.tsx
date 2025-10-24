import React from "react";
import { TextFieldFormElement } from "./text-field";
import { TitleFieldFormElement } from "./title-field";
import { SubtitleFieldFormElement } from "./subtitle-field";
import { ParagraphFieldFormElement } from "./paragraph-field";
import { SeparatorFieldFormElement } from "./separator-field";
import { SpacerFieldFormElement } from "./spacer-field";
import { NumberFieldFormElement } from "./number-field";
import { TextareaFieldFormElement } from "./textarea-field";
import { DateFieldFormElement } from "./date-field";
import { SelectFieldFormElement } from "./select-field";
import { CheckboxFieldFormElement } from "./checkbox-field";

export type ElementsType =
  | "TextField"
  | "DateField"
  | "CheckboxField"
  | "TitleField"
  | "SubtitleField"
  | "ParagraphField"
  | "SeparatorField"
  | "SpacerField"
  | "NumberField"
  | "TextareaField"
  | "SelectField";

export type FormElement = {
  type: ElementsType;

  build: (id: string) => FormElementInstance;

  designerButtonElement: {
    icon: React.ElementType;
    label: string;
  };

  designerComponent: React.FC<{
    elementInstance: FormElementInstance;
  }>;
  formComponent: React.FC<
    React.ComponentProps<"input"> & FormComponentCustomProps
  >;
  propertiesComponent: React.FC<{
    elementInstance: FormElementInstance;
  }>;
};

export type FormComponentCustomProps = {
  elementInstance: FormElementInstance;
  isInvalid?: boolean;
  errorMessage?: string;
};

export type FormElementInstance = {
  id: string;
  type: ElementsType;
  extraAttributes?: Record<string, any>;
};

type FormElementsType = {
  [key in ElementsType]: FormElement;
};

export const FormElements: FormElementsType = {
  TextField: TextFieldFormElement,
  DateField: DateFieldFormElement,
  CheckboxField: CheckboxFieldFormElement,
  TitleField: TitleFieldFormElement,
  SubtitleField: SubtitleFieldFormElement,
  ParagraphField: ParagraphFieldFormElement,
  SeparatorField: SeparatorFieldFormElement,
  SpacerField: SpacerFieldFormElement,
  NumberField: NumberFieldFormElement,
  TextareaField: TextareaFieldFormElement,
  SelectField: SelectFieldFormElement,
};
