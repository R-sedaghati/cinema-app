"use client";

import { Checkbox } from "@dgshahr/ui-kit";
import { FieldProps } from "./types";

const CheckboxField: React.FC<FieldProps> = ({ field, value, onChange }) => {
  const selected = Array.isArray(value) ? (value as string[]) : [];

  const toggle = (optionValue: string) => {
    if (selected.includes(optionValue)) {
      onChange(selected.filter((v) => v !== optionValue));
    } else {
      onChange([...selected, optionValue]);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <p className="font-p2-medium">{field.label}</p>
      <div className="flex flex-col gap-2">
        {(field.options ?? []).map((option) => (
          <Checkbox
            key={option.value}
            label={option.label}
            checked={selected.includes(option.value)}
            onChange={() => toggle(option.value)}
          />
        ))}
      </div>
    </div>
  );
};

export default CheckboxField;
