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
    <div className="flex flex-col gap-2">
      {(field.options ?? []).map((option) => (
        <RadioButton
          key={option.value}
          label={option.label}
          containerClassName="w-full"
          name={field.key}
          checked={value === option.value}
          // change never fires on an already-checked radio, so toggle on click
          onChange={() => {}}
          onClick={() => onChange(value === option.value ? "" : option.value)}
        />
      ))}
    </div>
  </div>
);

export default RadioField;
