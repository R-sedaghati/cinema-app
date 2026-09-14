/**
 * Form answers ride in the URL as JSON. The URL is user-editable and shareable, so anything
 * unparseable or not a plain object reads as "no answers" instead of crashing the form.
 */
export const parseAnswers = (raw: string | null): Record<string, unknown> => {
  if (!raw) return {};
  try {
    const value: unknown = JSON.parse(raw);
    return value && typeof value === "object" && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : {};
  } catch {
    return {};
  }
};

/** Comma-separated category ids; junk entries are dropped. */
export const parseIds = (raw: string | null): number[] =>
  (raw ?? "")
    .split(",")
    .map(Number)
    .filter((n) => Number.isInteger(n) && n > 0);
