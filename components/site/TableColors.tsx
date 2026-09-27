"use client";

import { useUserSiteContent } from "@/lib/services/landing/hook";
import { tableColorsCss } from "@/lib/utils/tableColors";

/** Admin-set table colors for the public site; renders nothing when unset. */
export function TableColors() {
  const { data } = useUserSiteContent();
  const css = tableColorsCss(data?.result?.tableColors);
  return css ? <style>{css}</style> : null;
}
