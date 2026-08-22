"use client";

import { LANDING_COPY } from "@/lib/constants/landingCopy";
import type { LandingCopyKey } from "@/lib/constants/landingCopy";
import { useUserSiteContent } from "@/lib/services/landing/hook";
import { makeResolver } from "@/lib/utils/copy";
import type { CopyResolver } from "@/lib/utils/copy";
import { useMemo } from "react";

/**
 * Public-site copy: the admin overrides from site-content, falling back to the
 * defaults in LANDING_COPY. Safe to call before the request resolves — it just
 * renders the defaults.
 */
export function useLandingCopy(): CopyResolver<LandingCopyKey> {
  const { data } = useUserSiteContent();
  const overrides = data?.result?.landing;

  return useMemo(() => makeResolver(LANDING_COPY, overrides), [overrides]);
}
