export type Jalali = { jy: number; jm: number; jd: number };

const fmt = new Intl.DateTimeFormat("en-u-ca-persian-nu-latn", {
  year: "numeric",
  month: "numeric",
  day: "numeric",
});

/** Jalali parts of a Date, in the local timezone. */
export function toJalali(date: Date): Jalali {
  const parts = Object.fromEntries(fmt.formatToParts(date).map((p) => [p.type, p.value]));
  return { jy: Number(parts.year), jm: Number(parts.month), jd: Number(parts.day) };
}

/** Local-noon Date for a Jalali day, or null if the day doesn't exist (e.g. 30 Esfand in a common year). */
export function fromJalali(jy: number, jm: number, jd: number): Date | null {
  const dayOfYear = (jm - 1) * 31 - Math.max(0, jm - 7) + jd - 1;
  // ponytail: Nowruz falls Mar 19–22, so a Mar 21 estimate is within ±3 days; Intl checks each candidate
  for (const offset of [0, -1, 1, -2, 2, -3, 3]) {
    const d = new Date(jy + 621, 2, 21 + dayOfYear + offset, 12);
    const j = toJalali(d);
    if (j.jy === jy && j.jm === jm && j.jd === jd) return d;
  }
  return null;
}

export function jalaliMonthLength(jy: number, jm: number): number {
  if (jm <= 6) return 31;
  if (jm <= 11) return 30;
  return fromJalali(jy, 12, 30) ? 30 : 29;
}

export const JALALI_MONTHS = [
  "فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور",
  "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند",
];
