import { FORM_COPY } from "../constants/formCopy.ts";
import type { FormCopyKey } from "../constants/formCopy.ts";
import { makeResolver } from "./copy.ts";
import type { CopyResolver } from "./copy.ts";

export type CopyFn = CopyResolver<FormCopyKey>;

/**
 * Resolves a copy key against the admin overrides of a category (form-schema
 * `formCopy`), falling back to the default in FORM_COPY.
 */
export const makeCopy = (overrides?: Record<string, string | null> | null): CopyFn =>
  makeResolver(FORM_COPY, overrides);

/** Copy resolver with no overrides — the built-in defaults. */
export const defaultCopy = makeCopy();
