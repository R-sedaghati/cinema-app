/**
 * Inline font-size override for CMS-editable text.
 * Returns undefined when unset so the Tailwind class on the element still wins.
 */
export function fontSizeStyle(px?: number | null) {
  return px ? { fontSize: `${px}px` } : undefined;
}
