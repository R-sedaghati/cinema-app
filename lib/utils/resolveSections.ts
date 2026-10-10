import type { CSSProperties } from "react";
import { toStoragePath } from "./toStoragePath.ts";
import { cleanStyles } from "./sectionStyles.ts";

/** The stored shape of one section, as it lives in `SiteContent`. */
export interface ISectionConfig {
  key: string;
  hidden: boolean;
  /** Layout variant key from the section's catalog entry; falls back to the first. */
  variant?: string;
  /** Size overrides in px; absent = the variant's shipped size. `width`/`height`
   *  are fixed sizes, `maxWidth`/`minHeight` bounds. */
  width?: number;
  height?: number;
  maxWidth?: number;
  minHeight?: number;
  cardWidth?: number;
  cardHeight?: number;
  /** Inner spacing in px (0–200); absent = the section's own. */
  paddingTop?: number;
  paddingBottom?: number;
  paddingX?: number;
  /** Section background, `#rrggbb`; absent = transparent. */
  background?: string;
  /** Full URL on read, bare storage path on write (see `toStoragePath`). */
  backgroundImage?: string;
  /** 0–90, % black over the image; absent = 50. */
  backgroundOverlay?: number;
  /** Per-element style overrides, see `sectionStyles.ts`. */
  styles?: Record<string, string>;
}

export interface IResolvedSection<K extends string> {
  key: K;
  hidden: boolean;
  variant: string;
  width?: number;
  height?: number;
  maxWidth?: number;
  minHeight?: number;
  cardWidth?: number;
  cardHeight?: number;
  paddingTop?: number;
  paddingBottom?: number;
  paddingX?: number;
  background?: string;
  backgroundImage?: string;
  backgroundOverlay?: number;
  styles?: Record<string, string>;
}

export const SIZE_KEYS = ["width", "height", "maxWidth", "minHeight", "cardWidth", "cardHeight"] as const;
export type SizeKey = (typeof SIZE_KEYS)[number];
export const SPACING_KEYS = ["paddingTop", "paddingBottom", "paddingX"] as const;
export type SpacingKey = (typeof SPACING_KEYS)[number];

/** Stored JSON is untrusted: keep only sane px values, drop the rest. */
const toPx = (value: unknown): number | undefined =>
  typeof value === "number" && Number.isFinite(value) && value >= 40 && value <= 2000
    ? Math.round(value)
    : undefined;

const toSpacing = (value: unknown): number | undefined =>
  typeof value === "number" && Number.isFinite(value) && value >= 0 && value <= 200
    ? Math.round(value)
    : undefined;

const sizesOf = (entry: ISectionConfig) => {
  const sizes: Partial<Record<SizeKey | SpacingKey, number>> = {};
  for (const k of SIZE_KEYS) {
    const px = toPx(entry[k]);
    if (px !== undefined) sizes[k] = px;
  }
  for (const k of SPACING_KEYS) {
    const px = toSpacing(entry[k]);
    if (px !== undefined) sizes[k] = px;
  }
  return sizes;
};

/** Hex only — it lands in a style attr. */
const toHex = (value: unknown): string | undefined =>
  typeof value === "string" && /^#[0-9a-f]{6}$/i.test(value) ? value : undefined;

/** Lands in `url("…")`, so nothing that could close it. */
const toImage = (value: unknown): string | undefined =>
  typeof value === "string" && /^[^"'\\()\s]+$/.test(value) ? value : undefined;

const toOverlay = (value: unknown): number | undefined =>
  typeof value === "number" && Number.isInteger(value) && value >= 0 && value <= 90 ? value : undefined;

const backgroundOf = (entry: ISectionConfig) => {
  const out: Pick<ISectionConfig, "background" | "backgroundImage" | "backgroundOverlay"> = {};
  const color = toHex(entry.background);
  const image = toImage(entry.backgroundImage);
  const overlay = toOverlay(entry.backgroundOverlay);
  if (color) out.background = color;
  if (image) out.backgroundImage = image;
  if (image && overlay !== undefined) out.backgroundOverlay = overlay;
  return out;
};

/**
 * Wrapper props that apply a section's size overrides. Card sizes ride CSS vars
 * picked up by `[data-card]` elements (rules in `app/globals.css`); the data
 * attrs gate those rules so unset sizes leave the Tailwind defaults alone.
 */
export function sectionBoxProps(
  section: Partial<Record<SizeKey | SpacingKey, number>> &
    Pick<ISectionConfig, "background" | "backgroundImage" | "backgroundOverlay">,
) {
  const style: Record<string, string | number> = {};
  // Fixed width still yields to a narrower screen instead of scrolling sideways.
  if (section.width) Object.assign(style, { width: `min(${section.width}px, 100%)`, marginInline: "auto" });
  if (section.height) Object.assign(style, { height: section.height, overflow: "hidden" });
  if (section.maxWidth) Object.assign(style, { maxWidth: section.maxWidth, marginInline: "auto" });
  if (section.minHeight) style.minHeight = section.minHeight;
  // 0 is a real value here ("no padding"), so test for undefined, not truthiness.
  if (section.paddingTop !== undefined) style.paddingTop = section.paddingTop;
  if (section.paddingBottom !== undefined) style.paddingBottom = section.paddingBottom;
  if (section.paddingX !== undefined) style.paddingInline = section.paddingX;
  if (section.background) style.backgroundColor = section.background;
  if (section.backgroundImage) {
    // Overlay as a flat gradient layer on top of the image — no extra element needed.
    const shade = `rgba(0,0,0,${(section.backgroundOverlay ?? 50) / 100})`;
    Object.assign(style, {
      backgroundImage: `linear-gradient(${shade}, ${shade}), url("${section.backgroundImage}")`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    });
  }
  if (section.cardWidth) style["--card-w"] = `${section.cardWidth}px`;
  if (section.cardHeight) style["--card-h"] = `${section.cardHeight}px`;

  return {
    style: style as CSSProperties,
    "data-card-w": section.cardWidth ? "" : undefined,
    "data-card-h": section.cardHeight ? "" : undefined,
  };
}

/** The slice of a section catalog this resolver needs — page catalogs carry more. */
type SectionCatalog<K extends string> = Record<K, { variants: { key: string }[] }>;

/**
 * Stored config → the full ordered section list for the admin panel.
 * Unknown keys are dropped, duplicates collapse to their first occurrence, and
 * catalog keys missing from the config are appended in catalog order — so
 * adding a section in code never needs a DB write. An unknown or missing
 * variant falls back to the catalog default (the entry's first variant).
 */
export function orderedSections<K extends string>(
  catalog: SectionCatalog<K>,
  config?: ISectionConfig[] | null,
): IResolvedSection<K>[] {
  const catalogKeys = Object.keys(catalog) as K[];
  const isKnown = (key: string): key is K => Object.hasOwn(catalog, key);

  const resolveVariant = (key: K, variant?: string): string => {
    const variants = catalog[key].variants;
    const known = variants.some((v) => v.key === variant);

    return known && variant ? variant : (variants[0]?.key ?? "");
  };

  const seen = new Set<K>();
  const ordered: IResolvedSection<K>[] = [];

  for (const entry of config ?? []) {
    if (!entry || !isKnown(entry.key) || seen.has(entry.key)) continue;
    seen.add(entry.key);
    const styles = cleanStyles(entry.styles);
    ordered.push({
      key: entry.key,
      hidden: entry.hidden === true,
      variant: resolveVariant(entry.key, entry.variant),
      ...sizesOf(entry),
      ...backgroundOf(entry),
      ...(styles && { styles }),
    });
  }

  for (const key of catalogKeys) {
    if (!seen.has(key)) {
      ordered.push({ key, hidden: false, variant: resolveVariant(key) });
    }
  }

  return ordered;
}

/** The sections a public page actually renders, in order. */
export function resolveSections<K extends string>(
  catalog: SectionCatalog<K>,
  config?: ISectionConfig[] | null,
): IResolvedSection<K>[] {
  return orderedSections(catalog, config).filter((s) => !s.hidden);
}

/** Admin save: reads carry full image URLs, the backend only accepts bare storage paths. */
export const withStoragePaths = <T extends { backgroundImage?: string }>(sections: T[]): T[] =>
  sections.map((s) => (s.backgroundImage ? { ...s, backgroundImage: toStoragePath(s.backgroundImage) } : s));
