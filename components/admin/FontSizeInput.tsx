"use client";

import Input from "@/components/common/Input";

interface Props {
  label?: string;
  value?: number | null;
  onChange: (value: number | null) => void;
  wrapperClassName?: string;
  isError?: boolean;
  errorMessage?: string;
  /** Size the public page renders when no override is set, e.g. "20" or "24–48". */
  defaultSize?: string;
}

/** Numeric px font-size control. Empty input means "use the default size". */
function FontSizeInput({
  label = "اندازه فونت (پیکسل)",
  value,
  onChange,
  wrapperClassName = "w-full",
  isError,
  errorMessage,
  defaultSize,
}: Props) {
  const current = defaultSize ? `${defaultSize}px` : null;
  return (
    <Input
      labelContent={label}
      placeholder={current ? `پیش‌فرض (${current})` : "پیش‌فرض"}
      type="text"
      inputMode="numeric"
      wrapperClassName={wrapperClassName}
      isError={isError}
      errorMessage={errorMessage}
      hintMessage={`${current ? `اندازه فعلی پیش‌فرض: ${current}؛ ` : ""}خالی = اندازه پیش‌فرض؛ بین ۸ تا ۱۲۰ پیکسل`}
      value={value ?? ""}
      onChange={(e) => {
        // Persian (۰-۹) / Arabic (٠-٩) digits → ASCII; type="number" would reject them
        const raw = e.target.value
          .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0))
          .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660))
          .replace(/\D/g, "");
        if (raw === "") return onChange(null);
        // Only cap the max while typing — clamping the min here turns "1" into 8 before "14" can be typed
        onChange(Math.min(120, Number(raw)));
      }}
      onBlur={() => {
        if (value != null && value < 8) onChange(8);
      }}
    />
  );
}

export default FontSizeInput;
