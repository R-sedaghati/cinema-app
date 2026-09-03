import { landingCopy } from "./landingCopy";
import type { LandingCopyKey } from "../constants/landingCopy";

/**
 * Backend error strings are English; the panel is Persian-only.
 * Map what we know, and never let a Latin-alphabet message reach a toast.
 * The Persian side of the map is admin-editable copy (`LANDING_COPY`).
 */

const EXACT: Record<string, LandingCopyKey> = {
  Unauthorized: "errorUnauthorized",
  Forbidden: "errorForbidden",
  "Not Found": "errorNotFound",
  "Internal Server Error": "errorServer",
  "Network Error": "errorNetwork",
  "Invalid credentials": "errorCredentials",
};

// ponytail: substring stems, not a full i18n layer — backend messages are few and stable.
const STEMS: [RegExp, LandingCopyKey][] = [
  [/should not be empty|is required|may not be blank/i, "errorRequiredFields"],
  [/must be (a )?(number|integer)/i, "errorNumber"],
  [/must be (a )?(url|string)|invalid/i, "errorInvalidValue"],
  [/already exists|duplicate/i, "errorDuplicate"],
  [/too large|file size/i, "errorFileTooLarge"],
  [/timeout/i, "errorTimeout"],
  [/unauthor/i, "errorUnauthorized"],
  [/not found/i, "errorNotFound"],
];

export function apiErrorFa(raw?: string | null): string {
  if (!raw) return landingCopy("errorGeneric");

  const message = raw.trim();

  if (EXACT[message]) return landingCopy(EXACT[message]);

  for (const [pattern, key] of STEMS) {
    if (pattern.test(message)) return landingCopy(key);
  }

  // Persian text from the backend passes through; anything with Latin letters does not.
  return /[A-Za-z]/.test(message) ? landingCopy("errorGeneric") : message;
}
