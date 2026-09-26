import type { CSSProperties } from "react";

/** The stored shape of one section, as it lives in `SiteContent`. */
export interface ISectionConfig {
  key: string;
  hidden: boolean;
  /** Layout variant key from the section's catalog entry; falls back to the first. */
  variant?: string;
  /** Size overrides in px; absent = the variant's shipped size. */
  maxWidth?: number;
  minHeight?: number;
  cardWidth?: number;
  cardHeight?: number;
}

export interface IResolvedSection<K extends string> {
  key: K;
  hidden: boolean;
  variant: string;
  maxWidth?: number;
  minHeight?: number;
  cardWidth?: number;
  cardHeight?: number;
}

export const SIZE_KEYS = ["maxWidth", "minHeight", "cardWidth", "cardHeight"] as const;
export type SizeKey = (typeof SIZE_KEYS)[number];

/** Stored JSON is untrusted: keep only sane px values, drop the rest. */
const toPx = (value: unknown): number | undefined =>
  typeof value === "number" && Number.isFinite(value) && value >= 40 && value <= 2000
    ? Math.round(value)
    : undefined;

const sizesOf = (entry: ISectionConfig) => {
  const sizes: Partial<Record<SizeKey, number>> = {};
  for (const k of SIZE_KEYS) {
    const px = toPx(entry[k]);
    if (px !== undefined) sizes[k] = px;
  }
  return sizes;
};

/**
 * Wrapper props that apply a section's size overrides. Card sizes ride CSS vars
 * picked up by `[data-card]` elements (rules in `app/globals.css`); the data
 * attrs gate those rules so unset sizes leave the Tailwind defaults alone.
 */
export function sectionBoxProps(section: Partial<Record<SizeKey, number>>) {
  const style: Record<string, string | number> = {};
  if (section.maxWidth) Object.assign(style, { maxWidth: section.maxWidth, marginInline: "auto" });
  if (section.minHeight) style.minHeight = section.minHeight;
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
    ordered.push({
      key: entry.key,
      hidden: entry.hidden === true,
      variant: resolveVariant(entry.key, entry.variant),
      ...sizesOf(entry),
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
