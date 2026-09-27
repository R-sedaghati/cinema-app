import type { CSSProperties } from "react";

/** One page's content box as stored in `SiteContent.pageLayouts`. Spacing is px;
 *  the `*Desktop` twin applies from 768px up, else the mobile value holds. */
export interface IPageLayout {
  maxWidth?: number;
  paddingX?: number;
  paddingXDesktop?: number;
  paddingTop?: number;
  paddingTopDesktop?: number;
  paddingBottom?: number;
  paddingBottomDesktop?: number;
  gap?: number;
  gapDesktop?: number;
}

export type PageLayoutKey = keyof IPageLayout;

/** Field → [min, max, CSS var]. The var names are what `app/pageLayout.css` reads. */
export const PAGE_LAYOUT_FIELDS: Record<PageLayoutKey, [number, number, string]> = {
  maxWidth: [320, 2400, "w"],
  paddingX: [0, 200, "x"],
  paddingXDesktop: [0, 200, "x-d"],
  paddingTop: [0, 200, "t"],
  paddingTopDesktop: [0, 200, "t-d"],
  paddingBottom: [0, 200, "b"],
  paddingBottomDesktop: [0, 200, "b-d"],
  gap: [0, 200, "gap"],
  gapDesktop: [0, 200, "gap-d"],
};

/** Stored JSON is untrusted: keep only in-range numbers, drop the rest. */
export function cleanPageLayout(raw: unknown): IPageLayout {
  const layout: IPageLayout = {};
  if (!raw || typeof raw !== "object") return layout;
  for (const [field, [min, max]] of Object.entries(PAGE_LAYOUT_FIELDS) as [PageLayoutKey, [number, number, string]][]) {
    const value = (raw as Record<string, unknown>)[field];
    if (typeof value === "number" && Number.isFinite(value) && value >= min && value <= max) {
      layout[field] = Math.round(value);
    }
  }
  return layout;
}

/** The layout for a pathname: `default` with the page's own entry merged over it, field by field. */
export function resolvePageLayout(
  map: Record<string, IPageLayout> | null | undefined,
  pathname: string,
): IPageLayout {
  const key = pathname.split("/")[1] || "home";
  return { ...cleanPageLayout(map?.default), ...cleanPageLayout(map?.[key]) };
}

/**
 * Props for the element wrapping the page. Each set field becomes a `--pl-*` var
 * plus a `data-pl-*` gate, so unset fields leave the page's Tailwind classes alone.
 */
export function pageLayoutProps(layout: IPageLayout) {
  const style: Record<string, string> = {};
  const gates: Record<string, string> = {};
  for (const [field, [, , name]] of Object.entries(PAGE_LAYOUT_FIELDS) as [PageLayoutKey, [number, number, string]][]) {
    const value = layout[field];
    if (value === undefined) continue;
    style[`--pl-${name}`] = `${value}px`;
    gates[`data-pl-${name}`] = "";
  }
  return { style: style as CSSProperties, ...gates };
}
