"use client";

import Input from "@/components/common/Input";

interface Props {
  label?: string;
  value?: number | null;
  onChange: (value: number | null) => void;
  wrapperClassName?: string;
  isError?: boolean;
  errorMessage?: string;
}

/** Numeric px font-size control. Empty input means "use the default size". */
function FontSizeInput({
  label = "اندازه فونت (پیکسل)",
  value,
  onChange,
  wrapperClassName = "w-full",
  isError,
  errorMessage,
}: Props) {
  return (
    <Input
      labelContent={label}
      placeholder="پیش‌فرض"
      type="text"
      inputMode="numeric"
      wrapperClassName={wrapperClassName}
      isError={isError}
      errorMessage={errorMessage}
      hintMessage="خالی = اندازه پیش‌فرض؛ بین ۸ تا ۱۲۰ پیکسل"
      value={value ?? ""}
      onChange={(e) => {
        const raw = e.target.value;
        if (raw === "") return onChange(null);
        const size = Number(raw);
        // ponytail: min/max moved off the element — type="number" rejects Persian digits
        if (!Number.isFinite(size)) return;
        onChange(Math.min(120, Math.max(8, size)));
      }}
    />
  );
}

export default FontSizeInput;
