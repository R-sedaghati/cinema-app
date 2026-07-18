"use client";

import { Input } from "@dgshahr/ui-kit";
import { FieldProps } from "./types";

const NumberField: React.FC<FieldProps> = ({ field, value, onChange }) => (
  <Input
    labelContent={field.label}
    placeholder={field.placeholder ?? field.label}
    required={field.required}
    wrapperClassName="w-full"
    value={(value as number) ?? ""}
    onChange={(e) => onChange(e.target.value ? Number(e.target.value) : null)}
  />
);

export default NumberField;
