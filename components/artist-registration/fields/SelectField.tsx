"use client";

import { Select } from "@dgshahr/ui-kit";
import { FieldProps } from "./types";

const SelectField: React.FC<FieldProps> = ({ field, value, onChange }) => (
  <Select
    inputProps={{
      labelContent: field.label,
      placeholder: field.placeholder ?? field.label,
      required: field.required,
    }}
    value={(value as string) || null}
    options={field.options ?? []}
    wrapperClassName="w-full"
    onChange={(selected) => onChange(selected ?? "")}
    mode="single"
  />
);

export default SelectField;
