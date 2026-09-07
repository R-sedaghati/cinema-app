"use client";

import Textarea from "@/components/common/Textarea";
import { FieldProps } from "./types";

const TextareaField: React.FC<FieldProps> = ({ field, value, onChange }) => (
  <Textarea
    labelContent={field.label}
    placeholder={field.placeholder ?? field.label}
    required={field.required}
    value={(value as string) ?? ""}
    onChange={(e) => onChange(e.target.value)}
  />
);

export default TextareaField;
