/**
 * Page-builder per-element styles. A section's catalog entry lists `IStyleField`s;
 * the stored `styles` map (`key` → value, `key-md` → desktop value) becomes one
 * scoped `<style>` block. Element hooks are `data-el="…"` attrs in the section
 * component. Unlayered rules beat Tailwind's layered utilities, and only set
 * values emit a rule — so unset fields keep the shipped look.
 */

export type StyleType = "color" | "px" | "align" | "weight" | "count";

export interface IStyleField {
  key: string;
  label: string;
  /** Admin panel heading the field sits under. */
  group: string;
  type: StyleType;
  /** Two inputs: `key` below 768px, `key-md` from 768px up. */
  responsive?: boolean;
  /** Selector inside the section → declarations. `$` is the value; for `align`,
   *  `$m` is the matching `margin-inline` (start/center/end in RTL). */
  css: Record<string, string>;
}

const VALID: Record<StyleType, (v: string) => boolean> = {
  color: (v) => /^#[0-9a-f]{6}$/i.test(v),
  px: (v) => /^\d{1,4}$/.test(v) && Number(v) <= 2000,
  align: (v) => v === "start" || v === "center" || v === "end",
  weight: (v) => /^[1-9]00$/.test(v),
  count: (v) => /^\d{1,2}$/.test(v) && Number(v) >= 1 && Number(v) <= 12,
};

const MARGIN: Record<string, string> = { start: "0 auto", center: "auto", end: "auto 0" };

const fill = (template: string, type: StyleType, v: string) => {
  const value = type === "px" ? `${v}px` : type === "count" ? `repeat(${v}, minmax(0, 1fr))` : v;
  return template.replaceAll("$m", MARGIN[v] ?? "").replaceAll("$", value);
};

/** Stored JSON is untrusted: same shape rule as the backend sanitizer. */
export function cleanStyles(raw: unknown): Record<string, string> | undefined {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return undefined;
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(raw)) {
    if (/^[a-z][a-z0-9-]{0,39}$/.test(k) && typeof v === "string" && /^(#[0-9a-f]{6}|\d{1,4}|start|center|end)$/i.test(v)) {
      out[k] = v;
    }
  }
  return Object.keys(out).length ? out : undefined;
}

/** `styles` → CSS text scoped under `scope`; values failing their field's type are skipped. */
export function sectionCss(
  scope: string,
  fields: IStyleField[] | undefined,
  styles: Record<string, string> | undefined,
): string {
  if (!fields || !styles) return "";
  const out: string[] = [];
  for (const field of fields) {
    const slots = field.responsive
      ? [["", "(max-width: 767.98px)"], ["-md", "(min-width: 768px)"]]
      : [["", ""]];
    for (const [suffix, media] of slots) {
      const v = styles[field.key + suffix];
      if (!v || !VALID[field.type](v)) continue;
      const rules = Object.entries(field.css)
        .map(([sel, decl]) => `${scope} ${sel}{${fill(decl, field.type, v)}}`)
        .join("");
      out.push(media ? `@media ${media}{${rules}}` : rules);
    }
  }
  return out.join("\n");
}

/** Font size (mobile/desktop) + color for one element, grouped under `group`.
 *  `hover` adds a hover-color field. Keys: `${key}-size`, `${key}-color`, `${key}-hover`. */
export const textFields = (group: string, key: string, sel: string, hover = false): IStyleField[] => [
  { group, key: `${key}-size`, label: "اندازه فونت", type: "px", responsive: true, css: { [sel]: "font-size:$" } },
  { group, key: `${key}-color`, label: "رنگ", type: "color", css: { [sel]: "color:$" } },
  ...(hover
    ? [{ group, key: `${key}-hover`, label: "رنگ هنگام هاور", type: "color" as const, css: { [`${sel}:hover`]: "color:$" } }]
    : []),
];

/** `[label, key, selector, hover?]` rows → fields; the common shape of a styles catalog. */
export const textElements = (rows: [string, string, string, boolean?][]): IStyleField[] =>
  rows.flatMap(([group, key, sel, hover]) => textFields(group, key, sel, hover));
