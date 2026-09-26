import { FORM_COPY } from "../constants/formCopy.ts";
import type { FormCopyKey } from "../constants/formCopy.ts";
import { makeResolver } from "./copy.ts";
import type { CopyResolver } from "./copy.ts";

export type CopyFn = CopyResolver<FormCopyKey>;

/**
 * Resolves a copy key against the site-wide admin overrides
 * (`SiteContent.form`), falling back to the default in FORM_COPY.
 */
export const makeCopy = (overrides?: Record<string, string | null> | null): CopyFn =>
  makeResolver(FORM_COPY, overrides);

/** Copy resolver with no overrides — the built-in defaults. */
export const defaultCopy = makeCopy();

/**
 * Inner padding (px) of the registration form-step cards. Admin-set in the
 * registration builder and stored beside the copy in `SiteContent.form`, like the
 * `key@size` styles — so it rides the existing endpoint with no new field.
 */
export const FORM_CARD_PADDING = {
  mobile: { key: "formCard@paddingMobile", fallback: 16 },
  desktop: { key: "formCard@padding", fallback: 24 },
} as const;

/** Stored value → px; blank or out-of-range (0–64) falls back to the shipped default. */
export const formCardPadding = (
  overrides: Record<string, string | null> | null | undefined,
  device: keyof typeof FORM_CARD_PADDING,
): number => {
  const { key, fallback } = FORM_CARD_PADDING[device];
  const raw = overrides?.[key]?.trim();
  const px = raw ? Number(raw) : NaN;

  return Number.isFinite(px) && px >= 0 && px <= 64 ? Math.round(px) : fallback;
};
