"use client";

import clsx from "clsx";
import { isDesktop } from "react-device-detect";
import type { CopyFn } from "@/lib/utils/formCopy";

const PromptSection: React.FC<{ copy: CopyFn; variant?: string }> = ({
  copy,
  variant,
}) => (
  <p
    className={clsx(
      "font-h4-bold",
      isDesktop && "font-h3-bold",
      // RTL: "start" is the right edge.
      variant === "start" ? "w-full text-start" : "text-center",
    )}
  >
    {copy("categoryPrompt")}
  </p>
);

export default PromptSection;
