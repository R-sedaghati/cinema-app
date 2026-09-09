/**
 * `count` for list endpoints the UI consumes whole rather than paging through.
 * The API caps a page at 100 (api.md), so anything larger is silently clamped there.
 */
export const MAX_PAGE_SIZE = 100;

/** Categories drive the registration grid and its deep links; the whole set must be
 *  present or a link to a category on page 2 resolves to nothing. */
export const CATEGORY_PAGE_SIZE = MAX_PAGE_SIZE;
