"use client";

import Input from "@/components/common/Input";
import { toEnglishDigits } from "@/lib/utils/toEnglishDigits";
import { FieldProps } from "./types";

// ponytail: keep the answer a digit string, not a number — Number() eats the leading
// zeros a national/postal code needs and turns Persian digits into NaN. validateFormStep
// already reads min/max out of a numeric string.
const NumberField: React.FC<FieldProps> = ({ field, value, onChange }) => (
  <Input
    labelContent={field.label}
    placeholder={field.placeholder ?? field.label}
    required={field.required}
    wrapperClassName="w-full"
    type="text"
    inputMode="numeric"
    value={value == null ? "" : String(value)}
    onChange={(e) => {
      const raw = toEnglishDigits(e.target.value).replace(/[^\d.-]/g, "");
      onChange(raw === "" ? null : raw);
    }}
  />
);

export default NumberField;
