import {
  DEFAULT_HOME_SECTIONS,
  HOME_SECTIONS,
  type HomeSectionKey,
} from "../constants/homeSections.ts";

export interface IHomeSectionConfig {
  key: string;
  hidden: boolean;
  /** Layout variant key from the section's catalog entry; falls back to the first. */
  variant?: string;
}

export interface IResolvedHomeSection {
  key: HomeSectionKey;
  hidden: boolean;
  variant: string;
}

/** Falls back to the catalog default whenever the stored variant no longer exists. */
function resolveVariant(key: HomeSectionKey, variant?: string): string {
  const variants = HOME_SECTIONS[key].variants;
  const known = variants.some((v) => v.key === variant);

  return known && variant ? variant : (variants[0]?.key ?? "");
}

function isKnown(key: string): key is HomeSectionKey {
  return Object.hasOwn(HOME_SECTIONS, key);
}

/**
 * Stored config → the full ordered section list for the admin panel.
 * Unknown keys are dropped, duplicates collapse to their first occurrence, and
 * catalog keys missing from the config are appended in catalog order — so
 * adding a section in code never needs a DB write.
 */
export function orderedHomeSections(
  config?: IHomeSectionConfig[] | null,
): IResolvedHomeSection[] {
  const seen = new Set<HomeSectionKey>();
  const ordered: IResolvedHomeSection[] = [];

  for (const entry of config ?? []) {
    if (!entry || !isKnown(entry.key) || seen.has(entry.key)) continue;
    seen.add(entry.key);
    ordered.push({
      key: entry.key,
      hidden: entry.hidden === true,
      variant: resolveVariant(entry.key, entry.variant),
    });
  }

  for (const key of DEFAULT_HOME_SECTIONS) {
    if (!seen.has(key)) {
      ordered.push({ key, hidden: false, variant: resolveVariant(key) });
    }
  }

  return ordered;
}

/** The sections the public page actually renders, in order. */
export function resolveHomeSections(
  config?: IHomeSectionConfig[] | null,
): IResolvedHomeSection[] {
  return orderedHomeSections(config).filter((s) => !s.hidden);
}
