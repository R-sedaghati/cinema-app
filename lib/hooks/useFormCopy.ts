"use client";

import { useUserSiteContent } from "@/lib/services/landing/hook";
import { makeCopy } from "@/lib/utils/formCopy";
import type { CopyFn } from "@/lib/utils/formCopy";
import { useMemo } from "react";

/**
 * Registration-form copy: the admin overrides from site-content, falling back
 * to the defaults in FORM_COPY. Safe to call before the request resolves — it
 * just renders the defaults.
 */
export function useFormCopy(): CopyFn {
  const { data } = useUserSiteContent();
  const overrides = data?.result?.form;

  return useMemo(() => makeCopy(overrides), [overrides]);
}
