export interface CategoryOption {
  id: number;
  title: string;
}

export interface SearchableCategory extends CategoryOption {
  children?: CategoryOption[];
  /** Set by `matchCategories` when the card is shown only because of these subcategories. */
  matchedChildren?: CategoryOption[];
}

/** Folds the spellings a Persian keyboard can produce for the same word (Arabic ي/ك, ZWNJ). */
export const normalizeFa = (s: string) =>
  s
    .toLowerCase()
    .replace(/ي/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/‌/g, "")
    .replace(/\s+/g, " ")
    .trim();

/**
 * Filters the registration forms by their own name or any subcategory name. A form hit
 * by name keeps no hint; one hit only through subcategories carries them in `matchedChildren`.
 */
export const matchCategories = <T extends SearchableCategory>(items: T[], query: string): T[] => {
  const q = normalizeFa(query);
  if (!q) return items;
  const hits = (title: string) => normalizeFa(title).includes(q);

  return items.flatMap((item) => {
    if (hits(item.title)) return [item];
    const matchedChildren = (item.children ?? []).filter((child) => hits(child.title));
    return matchedChildren.length ? [{ ...item, matchedChildren }] : [];
  });
};
