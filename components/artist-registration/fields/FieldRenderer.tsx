"use client";

import { EFormFieldType } from "@/lib/services/admin/type";
import { FieldProps } from "./types";
import TextField from "./TextField";
import TextareaField from "./TextareaField";
import NumberField from "./NumberField";
import SelectField from "./SelectField";
import RadioField from "./RadioField";
import CheckboxField from "./CheckboxField";
import DateField from "./DateField";
import ImageUploadField from "./ImageUploadField";
import VideoUploadField from "./VideoUploadField";

const FIELD_COMPONENTS: Record<EFormFieldType, React.FC<FieldProps>> = {
  [EFormFieldType.TEXT]: TextField,
  [EFormFieldType.TEXTAREA]: TextareaField,
  [EFormFieldType.NUMBER]: NumberField,
  [EFormFieldType.SELECT]: SelectField,
  [EFormFieldType.RADIO]: RadioField,
  [EFormFieldType.CHECKBOX]: CheckboxField,
  [EFormFieldType.DATE]: DateField,
  [EFormFieldType.IMAGE]: ImageUploadField,
  [EFormFieldType.VIDEO]: VideoUploadField,
};

const FieldRenderer: React.FC<FieldProps> = (props) => {
  const Component = FIELD_COMPONENTS[props.field.type];
  if (!Component) return null;
  return <Component {...props} />;
};

export default FieldRenderer;
