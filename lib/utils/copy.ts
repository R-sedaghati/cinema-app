export type CopyResolver<K extends string> = (
  key: K,
  vars?: Record<string, string | number>,
) => string;

type Registry<K extends string> = Record<K, { value: string }>;

/**
 * Resolves a copy key against admin overrides, falling back to the registry
 * default. `{name}` placeholders are replaced with `vars`.
 *
 * Shared by the registration-form copy (`formCopy.ts`) and the landing copy
 * (`landingCopy.ts`); both are "flat key → Persian string" registries.
 */
export const makeResolver =
  <K extends string>(defaults: Registry<K>, overrides?: Record<string, string | null> | null): CopyResolver<K> =>
  (key, vars) => {
    const raw = overrides?.[key]?.trim() || defaults[key].value;

    return vars
      ? raw.replace(/\{(\w+)\}/g, (match, name: string) =>
          vars[name] === undefined ? match : String(vars[name]),
        )
      : raw;
  };
