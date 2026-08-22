"use client";

import { EFormFieldType } from "@/lib/services/admin/type";
import { FieldProps } from "./types";
import TextField from "./TextField";
import TextareaField from "./TextareaField";
import NumberField from "./NumberField";
import SelectField from "./SelectField";
import RadioField from "./RadioField";
import CheckboxField from "./CheckboxField";
import BooleanField from "./BooleanField";
import DateField from "./DateField";
import ImageUploadField from "./ImageUploadField";
import VideoUploadField from "./VideoUploadField";

const FIELD_COMPONENTS: Record<EFormFieldType, React.FC<FieldProps>> = {
  [EFormFieldType.TEXT]: TextField,
  [EFormFieldType.TEXTAREA]: TextareaField,
  [EFormFieldType.NUMBER]: NumberField,
  [EFormFieldType.SELECT]: SelectField,
  [EFormFieldType.SELECT_PROVINCE]: SelectField,
  [EFormFieldType.SELECT_CITY]: SelectField,
  [EFormFieldType.RADIO]: RadioField,
  [EFormFieldType.CHECKBOX]: CheckboxField,
  [EFormFieldType.BOOLEAN]: BooleanField,
  [EFormFieldType.DATE]: DateField,
  [EFormFieldType.IMAGE]: ImageUploadField,
  [EFormFieldType.VIDEO]: VideoUploadField,
};

const FieldRenderer: React.FC<FieldProps> = (props) => {
  const Component = FIELD_COMPONENTS[props.field.type];
  if (!Component) return null;

  // ponytail: help text is rendered here once instead of in all twelve field components
  if (!props.field.helpText) return <Component {...props} />;

  return (
    <div className="flex flex-col gap-1">
      <Component {...props} />
      <p className="font-p3-regular text-gray-500">{props.field.helpText}</p>
    </div>
  );
};

export default FieldRenderer;
