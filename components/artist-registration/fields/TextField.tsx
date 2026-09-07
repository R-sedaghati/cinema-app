"use client";

import Input from "@/components/common/Input";
import { FieldProps } from "./types";

const TextField: React.FC<FieldProps> = ({ field, value, onChange, disabled }) => (
  <Input
    labelContent={field.label}
    placeholder={field.placeholder ?? field.label}
    required={field.required}
    disabled={disabled}
    wrapperClassName="w-full"
    value={(value as string) ?? ""}
    onChange={(e) => onChange(e.target.value)}
  />
);

export default TextField;
