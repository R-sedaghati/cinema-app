"use client";

import { Input as UiInput } from "@dgshahr/ui-kit";
import type { InputProps } from "@dgshahr/ui-kit/Form/Input";
import { forwardRef } from "react";
import { toEnglishDigits } from "@/lib/utils/toEnglishDigits";

/**
 * The app's Input. Persian/Arabic-Indic digits become ASCII as the user types, so
 * component state, validation and request payloads only ever hold ASCII digits.
 *
 * Use this instead of importing Input from @dgshahr/ui-kit directly.
 */
const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { onChange, ...props },
  ref,
) {
  return (
    <UiInput
      {...props}
      ref={ref}
      onChange={(event) => {
        if (!onChange) return;
        const normalized = toEnglishDigits(event.target.value);
        // ponytail: mutate in place so call sites keep reading e.target.value
        if (normalized !== event.target.value) event.target.value = normalized;
        onChange(event);
      }}
    />
  );
});

export default Input;
export type { InputProps };
