interface PagedCategory {
  id: number;
  children?: { id: number }[];
}

/** Walks `GET /categories` (public and admin) to the end and returns every row once.
 *
 *  The server paginates the flat category rows but answers with the *main* categories
 *  found in that slice, so a page holds an unpredictable number of them, `count` is not
 *  the total, `next` is always null, and a main category whose subcategories straddle a
 *  page boundary comes back twice with its children split. Hence: read until a page adds
 *  nothing new, merge the duplicates by id.
 *  // ponytail: page cap 50, raise it if a deployment ever holds >50 pages of categories.
 */
export const fetchAllCategoryPages = async <T extends PagedCategory>(
  fetchPage: (page: number) => Promise<T[]>,
): Promise<T[]> => {
  const byId = new Map<number, T>();

  for (let page = 1; page <= 50; page++) {
    const rows = await fetchPage(page);
    if (rows.length === 0) break;

    const before = byId.size;
    for (const row of rows) {
      const seen = byId.get(row.id);
      if (!seen) {
        byId.set(row.id, row);
        continue;
      }
      const children = [...(seen.children ?? [])];
      for (const child of row.children ?? []) {
        if (!children.some((c) => c.id === child.id)) children.push(child);
      }
      byId.set(row.id, { ...seen, children });
    }
    // A server ignoring `page` would otherwise hand back page 1 forever.
    if (byId.size === before) break;
  }

  return [...byId.values()];
};
