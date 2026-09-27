"use client";

import { useEffect, useMemo, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HomeSections } from "@/components/home/HomeSections";
import { LandingCopyDraftProvider } from "@/lib/hooks/useLandingCopy";
import { PREVIEW_DRAFT, PREVIEW_READY } from "@/lib/constants/pageBuilderPreview";
import type { IResolvedHomeSection } from "@/lib/utils/resolveHomeSections";

interface IDraft {
  sections: IResolvedHomeSection[];
  landing: Record<string, string>;
  guides: boolean;
}

/** Iframe target of the admin page-builder: renders whatever draft the parent posts. */
export default function PageBuilderPreview() {
  const queryClient = useMemo(() => new QueryClient(), []);
  const [draft, setDraft] = useState<IDraft | null>(null);

  useEffect(() => {
    // Only the same-origin admin panel that embeds us may drive the preview.
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== location.origin || e.source !== window.parent) return;
      if (e.data?.type === PREVIEW_DRAFT) setDraft(e.data);
    };
    addEventListener("message", onMessage);
    window.parent.postMessage({ type: PREVIEW_READY }, location.origin);
    return () => removeEventListener("message", onMessage);
  }, []);

  if (!draft) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <LandingCopyDraftProvider value={draft.landing}>
        {/* pointer-events-none: the real sections navigate — the preview must stay put. */}
        <div
          data-guides={draft.guides ? "" : undefined}
          className="pointer-events-none select-none pb-6"
        >
          <HomeSections sections={draft.sections.filter((s) => !s.hidden)} guides={draft.guides} />
        </div>
      </LandingCopyDraftProvider>
    </QueryClientProvider>
  );
}
