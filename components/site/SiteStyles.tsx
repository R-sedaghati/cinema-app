"use client";

import { useUserSiteContent } from "@/lib/services/landing/hook";
import { SITE_STYLE_AREAS } from "@/lib/constants/siteStyles";
import { cleanStyles, sectionCss } from "@/lib/utils/sectionStyles";

/** Admin-set text styles per site area (`/admin/site-styles`); renders nothing when unset. */
export function SiteStyles() {
  const { data } = useUserSiteContent();
  const saved = data?.result?.siteStyles ?? {};
  const css = Object.entries(SITE_STYLE_AREAS)
    .map(([area, { fields, scope }]) =>
      sectionCss(scope ?? `[data-area="${area}"]`, fields, cleanStyles(saved[area])),
    )
    .filter(Boolean)
    .join("\n");
  return css ? <style>{css}</style> : null;
}
