"use client";

import { LANDING_COPY } from "@/lib/constants/landingCopy";
import type { LandingCopyKey } from "@/lib/constants/landingCopy";
import { useUserSiteContent } from "@/lib/services/landing/hook";
import { makeResolver } from "@/lib/utils/copy";
import { setLandingCopy } from "@/lib/utils/landingCopy";
import type { CopyResolver } from "@/lib/utils/copy";
import { createContext, useContext, useMemo } from "react";

/**
 * Unsaved copy edits injected by the admin page-builder preview. `null` on the
 * public site, where the saved overrides are the whole story.
 */
const DraftCopyContext = createContext<Record<string, string> | null>(null);
export const LandingCopyDraftProvider = DraftCopyContext.Provider;

/**
 * Public-site copy: the admin overrides from site-content, falling back to the
 * defaults in LANDING_COPY. Safe to call before the request resolves — it just
 * renders the defaults.
 */
export function useLandingCopy(): CopyResolver<LandingCopyKey> {
  const { data } = useUserSiteContent();
  const overrides = data?.result?.landing;
  const draft = useContext(DraftCopyContext);

  return useMemo(() => {
    const resolver = makeResolver(
      LANDING_COPY,
      draft ? { ...overrides, ...draft } : overrides,
    );
    // Non-React callers (axios interceptors, upload helpers) read the same
    // overrides — but never the panel's unsaved draft.
    if (!draft) setLandingCopy(resolver);

    return resolver;
  }, [overrides, draft]);
}
