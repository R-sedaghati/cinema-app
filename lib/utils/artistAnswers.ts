/**
 * Public artist pages read convention keys (`gender`, `province`, …). Live forms
 * often store the Persian label as the key instead, so lookups try both.
 */
export const ANSWER_KEYS = {
  gender: ["gender", "جنسیت"],
  province: ["province", "استان"],
  city: ["city", "شهر"],
  aboutMe: ["aboutMe", "درباره من"],
  birthDate: ["birthDate", "birthday", "تاریخ تولد"],
} as const;

export const pickAnswer = (
  answers: Record<string, unknown> | null | undefined,
  keys: readonly string[],
): unknown => {
  if (!answers) return undefined;
  const entries = Object.entries(answers);
  for (const key of keys) {
    const hit = entries.find(
      ([k]) => k === key || k.toLowerCase() === key.toLowerCase(),
    );
    if (hit && hit[1] != null && hit[1] !== "") return hit[1];
  }
  return undefined;
};

/** String a stored answer can be shown as — option objects, ids, raw labels. */
export const displayAnswer = (value: unknown): string | undefined => {
  if (value == null || value === "") return undefined;
  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    const text = String(value).trim();
    return text || undefined;
  }
  if (Array.isArray(value)) {
    const parts = value.map(displayAnswer).filter(Boolean) as string[];
    return parts.length ? parts.join("، ") : undefined;
  }
  if (typeof value === "object") {
    const row = value as Record<string, unknown>;
    return displayAnswer(row.label ?? row.name ?? row.value ?? row.faName);
  }
  return undefined;
};

export const displayGender = (
  value: unknown,
  labels: { man: string; woman: string },
): string | undefined => {
  const raw = displayAnswer(value);
  if (!raw) return undefined;
  const upper = raw.trim().toUpperCase();
  if (upper === "MAN" || upper === "MALE" || raw === "مرد") return labels.man;
  if (upper === "WOMAN" || upper === "FEMALE" || raw === "زن")
    return labels.woman;
  return raw;
};

export const displayAboutMe = (
  answers: Record<string, unknown> | null | undefined,
): string | undefined => {
  return displayAnswer(pickAnswer(answers, ANSWER_KEYS.aboutMe));
};
