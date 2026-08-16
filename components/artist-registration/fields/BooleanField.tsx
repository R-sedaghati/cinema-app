"use client";

import { Checkbox } from "@dgshahr/ui-kit";
import { FieldProps } from "./types";

const BooleanField: React.FC<FieldProps> = ({ field, value, onChange }) => (
  <Checkbox
    label={field.label}
    checked={value === true}
    onChange={(e) => onChange(e.target.checked)}
  />
);

export default BooleanField;
