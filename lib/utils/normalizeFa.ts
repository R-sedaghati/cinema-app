/**
 * Category names carry ZWNJ ("تهیه‌کنندگی") and admins type both the Arabic and the
 * Persian forms of ی/ک, so a raw `includes` misses matches the user clearly meant.
 * The backend folds the same way (`backend/services/normalizeFa.ts`).
 */
export const normalizeFa = (value: string) =>
  value
    .replace(/‌/g, "")
    .replace(/ي/g, "ی")
    .replace(/ك/g, "ک")
    .trim();
