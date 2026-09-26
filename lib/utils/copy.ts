import type { CSSProperties } from "react";
import { textStyle } from "./fontSize.ts";

export type CopyResolver<K extends string> = {
  (key: K, vars?: Record<string, string | number>): string;
  /** Admin font-size/color for the key, stored as `key@size` / `key@color`. */
  style: (key: K) => CSSProperties | undefined;
};

type Registry<K extends string> = Record<K, { value: string }>;

/**
 * Resolves a copy key against admin overrides, falling back to the registry
 * default. `{name}` placeholders are replaced with `vars`.
 *
 * Shared by the registration-form copy (`formCopy.ts`) and the landing copy
 * (`landingCopy.ts`); both are "flat key → Persian string" registries.
 */
export const makeResolver = <K extends string>(
  defaults: Registry<K>,
  overrides?: Record<string, string | null> | null,
): CopyResolver<K> => {
  const resolve = (key: K, vars?: Record<string, string | number>) => {
    const raw = overrides?.[key]?.trim() || defaults[key].value;

    return vars
      ? raw.replace(/\{(\w+)\}/g, (match, name: string) =>
          vars[name] === undefined ? match : String(vars[name]),
        )
      : raw;
  };

  return Object.assign(resolve, {
    style: (key: K) => textStyle(overrides?.[`${key}@size`], overrides?.[`${key}@color`]),
  });
};
