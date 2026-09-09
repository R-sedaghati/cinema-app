/**
 * Portfolio rows carry the schema field they were submitted under (`fieldKey`), the raw
 * storage path, and a presigned `url`. Editing a form needs both halves of that: the
 * answer keeps the *path* (that is what the API expects back), while a preview can only
 * render the *url*.
 */
export interface PortfolioRow {
  /** Row id, the only stable ordering the API gives a gallery. */
  id?: number;
  filePath: string;
  fieldKey: string | null;
  url: string | null;
}

export interface GroupedPortfolios {
  /** fieldKey -> path (or paths, for a `multiple` field) — merged into form answers. */
  answers: Record<string, string | string[]>;
  /** path -> presigned url, for previews. */
  urlByPath: Record<string, string>;
}

export const groupPortfolios = (
  portfolios: readonly PortfolioRow[] | undefined | null,
): GroupedPortfolios => {
  const answers: Record<string, string | string[]> = {};
  const urlByPath: Record<string, string> = {};

  // The API returns rows in whatever order it likes, so a `multiple` field's images
  // could reshuffle between refetches. `id` is the only stable key on the row.
  const rows = [...(portfolios ?? [])].sort(
    (a, b) => (a.id ?? 0) - (b.id ?? 0),
  );

  for (const p of rows) {
    // An empty path is not renderable and not sendable — it would reach an <img> as
    // src="" and resolve to the page itself.
    if (!p.filePath) continue;

    if (p.url) urlByPath[p.filePath] = p.url;

    // Legacy rows predate `fieldKey`; there is no field to hydrate them into.
    if (!p.fieldKey) continue;

    const existing = answers[p.fieldKey];
    if (existing === undefined) {
      answers[p.fieldKey] = p.filePath;
    } else if (Array.isArray(existing)) {
      existing.push(p.filePath);
    } else {
      answers[p.fieldKey] = [existing, p.filePath];
    }
  }

  return { answers, urlByPath };
};
