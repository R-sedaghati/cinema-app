/**
 * Persian (U+06F0..U+06F9) and Arabic-Indic (U+0660..U+0669) digits to ASCII.
 * The canonical converter — normalize at input, so state, validation and payloads
 * only ever hold ASCII digits.
 */
export const toEnglishDigits = (value: string | null | undefined): string =>
  value == null
    ? ""
    : String(value)
        .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0))
        .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660));

export default toEnglishDigits;

/** Digits-only field to a number. Empty or non-numeric input reads as 0. */
export const toPriority = (value: string): number => {
  const n = Number(toEnglishDigits(value).trim());
  return Number.isFinite(n) ? n : 0;
};
