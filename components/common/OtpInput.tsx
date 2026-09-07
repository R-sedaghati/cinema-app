"use client";

import UiOtpInput from "@dgshahr/ui-kit/Form/OtpInput";
import type { OtpInputProps } from "@dgshahr/ui-kit/Form/OtpInput";
import { toEnglishDigits } from "@/lib/utils/toEnglishDigits";

/**
 * OtpInput that accepts Persian and Arabic-Indic digits.
 * The ui-kit component already maps `۰-۹` itself but not `٠-٩`.
 */
const OtpInput = ({ onChange, onEnd, ...props }: OtpInputProps) => (
  <UiOtpInput
    {...props}
    onChange={(value) => onChange(toEnglishDigits(value))}
    onEnd={onEnd ? (value) => onEnd(toEnglishDigits(value)) : undefined}
  />
);

export default OtpInput;
