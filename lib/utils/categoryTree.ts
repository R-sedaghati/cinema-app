import type { ICategoryItem } from "../services/admin/type.ts";

export interface CategoryGroup {
  parent: ICategoryItem;
  children: ICategoryItem[];
  /** All children of the parent, regardless of filters. */
  childCount: number;
}

export type CategoryRow = ICategoryItem & { depth: 0 | 1; childCount: number };

interface Filters {
  query?: string | null;
  isActive?: boolean | null;
}

/**
 * Groups the flat admin category list into main → sub. A group survives when the
 * parent or any child matches; a subcategory whose parent isn't in the list is shown
 * as its own top-level group so it never disappears.
 */
export const buildCategoryGroups = (
  items: ICategoryItem[],
  { query, isActive }: Filters,
): CategoryGroup[] => {
  const q = (query ?? "").trim().toLowerCase();
  const matches = (item: ICategoryItem) =>
    (isActive == null || item.isActive === isActive) &&
    (!q ||
      [item.faName, item.enName, item.description].some((field) =>
        field?.toLowerCase().includes(q),
      ));

  const ids = new Set(items.map((item) => item.id));
  const childrenOf = new Map<number, ICategoryItem[]>();
  for (const item of items) {
    if (item.parent === null || !ids.has(item.parent)) continue;
    childrenOf.set(item.parent, [...(childrenOf.get(item.parent) ?? []), item]);
  }

  return items
    .filter((item) => item.parent === null || !ids.has(item.parent))
    .flatMap((parent) => {
      const all = childrenOf.get(parent.id) ?? [];
      const children = all.filter(matches);
      if (!matches(parent) && children.length === 0) return [];
      return [{ parent, children, childCount: all.length }];
    });
};

export const flattenCategoryGroups = (
  groups: CategoryGroup[],
  isExpanded: (id: number) => boolean,
): CategoryRow[] =>
  groups.flatMap(({ parent, children, childCount }) => [
    { ...parent, depth: 0 as const, childCount },
    ...(isExpanded(parent.id)
      ? children.map((child) => ({ ...child, depth: 1 as const, childCount: 0 }))
      : []),
  ]);
