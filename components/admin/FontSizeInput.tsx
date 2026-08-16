"use client";

import { Input } from "@dgshahr/ui-kit";

interface Props {
  label?: string;
  value?: number | null;
  onChange: (value: number | null) => void;
  wrapperClassName?: string;
}

/** Numeric px font-size control. Empty input means "use the default size". */
function FontSizeInput({
  label = "اندازه فونت (پیکسل)",
  value,
  onChange,
  wrapperClassName = "w-full",
}: Props) {
  return (
    <Input
      labelContent={label}
      placeholder="پیش‌فرض"
      type="number"
      min={8}
      max={120}
      wrapperClassName={wrapperClassName}
      value={value ?? ""}
      onChange={(e) => {
        const raw = e.target.value;
        onChange(raw === "" ? null : Number(raw));
      }}
    />
  );
}

export default FontSizeInput;
