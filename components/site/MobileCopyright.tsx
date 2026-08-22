"use client";

import { FOOTER_DEFAULTS } from "@/lib/constants/footer";
import { useUserSiteContent } from "@/lib/services/landing/hook";

/** The mobile layout has no footer, so the copyright line is rendered on its own. */
export function MobileCopyright() {
  const { data } = useUserSiteContent();

  return <>{data?.result?.footer?.copyright?.trim() || FOOTER_DEFAULTS.copyright}</>;
}
