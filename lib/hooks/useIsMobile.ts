"use client";

import { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";

/**
 * `isMobile` is derived from the user agent, which the server doesn't share with the
 * client render — reading it during render hydrates mismatched markup. Reading it after
 * mount costs one extra render and keeps SSR and the client agreeing.
 */
export function useIsMobile(): boolean {
  const [mobile, setMobile] = useState(false);

  useEffect(() => setMobile(isMobile), []);

  return mobile;
}
