import { toEnglishDigits } from "./toEnglishDigits.ts";

/** Ascending `priority`, the shared sort key on categories, banners and tutorials.
 *  Priorities are authored in admin inputs that accept Persian digits, so a row can
 *  reach here as `"۲"` — `Number("۲")` is `NaN`, which scrambles the whole list.
 *  A row that was never ordered (`priority` null, which is how every subcategory was
 *  stored before the lists became draggable) sorts last, keeping its server order,
 *  instead of piling up in front of `priority: 0`. */
export const sortByPriority = <T extends { priority?: number | null }>(items: T[]): T[] =>
  [...items].sort((a, b) => readPriority(a.priority) - readPriority(b.priority));

const readPriority = (value: number | null | undefined): number => {
  if (typeof value === "number") return Number.isFinite(value) ? value : Infinity;
  const text = toEnglishDigits(value as unknown as string).trim();
  if (text === "") return Infinity;
  const n = Number(text);
  return Number.isFinite(n) ? n : Infinity;
};
