"use client";

import { RadioButton } from "@dgshahr/ui-kit";
import { Asterisk } from "lucide-react";
import { FieldProps } from "./types";

const RadioField: React.FC<FieldProps> = ({ field, value, onChange }) => (
  <div className="flex flex-col gap-2">
    <div className="flex gap-1">
      <p className="font-p2-medium">{field.label}</p>
      {field.required && <Asterisk size={12} className="text-error-500" />}
    </div>
    <div className="flex flex-wrap gap-5">
      {(field.options ?? []).map((option) => (
        <RadioButton
          key={option.value}
          label={option.label}
          name={field.key}
          checked={value === option.value}
          onChange={() => onChange(option.value)}
        />
      ))}
    </div>
  </div>
);

export default RadioField;
