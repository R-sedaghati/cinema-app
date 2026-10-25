"use client";

import { useUserSiteContent } from "@/lib/services/landing/hook";
import { themeColorsCss } from "@/lib/utils/themeColors";

/** Admin-set site palette for the public site; renders nothing when unset. */
export function ThemeColors() {
  const { data } = useUserSiteContent();
  const css = themeColorsCss(data?.result?.themeColors);
  return css ? <style>{css}</style> : null;
}
