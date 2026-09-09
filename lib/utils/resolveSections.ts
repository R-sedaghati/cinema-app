/** The stored shape of one section, as it lives in `SiteContent`. */
export interface ISectionConfig {
  key: string;
  hidden: boolean;
  /** Layout variant key from the section's catalog entry; falls back to the first. */
  variant?: string;
}

export interface IResolvedSection<K extends string> {
  key: K;
  hidden: boolean;
  variant: string;
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
