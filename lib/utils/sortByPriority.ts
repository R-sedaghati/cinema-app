import { toPriority } from "./toEnglishDigits.ts";

/** Ascending `priority`, the shared sort key on categories, banners and tutorials.
 *  Priorities are authored in admin inputs that accept Persian digits, so a row can
 *  reach here as `"۲"` — `Number("۲")` is `NaN`, which scrambles the whole list. */
export const sortByPriority = <T extends { priority?: number | null }>(
  items: T[],
): T[] =>
  [...items].sort((a, b) => readPriority(a.priority) - readPriority(b.priority));

const readPriority = (value: number | null | undefined): number =>
  typeof value === "number" && Number.isFinite(value)
    ? value
    : toPriority(String(value ?? ""));
