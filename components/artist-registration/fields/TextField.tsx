"use client";

import { Input } from "@dgshahr/ui-kit";
import { FieldProps } from "./types";

const TextField: React.FC<FieldProps> = ({ field, value, onChange }) => (
  <Input
    labelContent={field.label}
    placeholder={field.placeholder ?? field.label}
    required={field.required}
    wrapperClassName="w-full"
    value={(value as string) ?? ""}
    onChange={(e) => onChange(e.target.value)}
  />
);

export default TextField;
