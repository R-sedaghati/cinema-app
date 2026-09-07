"use client";

import { Textarea as UiTextarea } from "@dgshahr/ui-kit";
import { forwardRef } from "react";
import { toEnglishDigits } from "@/lib/utils/toEnglishDigits";

type UiTextareaProps = React.ComponentProps<typeof UiTextarea>;

/** Textarea that normalizes Persian/Arabic-Indic digits to ASCII as the user types. */
const Textarea = forwardRef<HTMLTextAreaElement, UiTextareaProps>(function Textarea(
  { onChange, ...props },
  ref,
) {
  return (
    <UiTextarea
      {...props}
      ref={ref}
      onChange={(event) => {
        if (!onChange) return;
        const normalized = toEnglishDigits(event.target.value);
        if (normalized !== event.target.value) event.target.value = normalized;
        onChange(event);
      }}
    />
  );
});

export default Textarea;
