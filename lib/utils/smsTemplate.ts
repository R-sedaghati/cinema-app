/**
 * `{firstName}` / `{form.city}` — the only placeholder shape the backend renderer
 * substitutes. Any characters but braces and spaces: form field keys are the admin's.
 */
const PLACEHOLDER = /\{([^{}\s]+)\}/g;

/** A field picked from a record of the stage (form, profile, user, request, ticket …) instead of one it declares. */
export const isDynamicVariable = (name: string) =>
  /^(form|profile|user|request|ticket|contactForm|contact|payment|artist)\./.test(name);

/**
 * Placeholders used in `body` that the stage does not offer. Picked fields are not
 * "unknown": the server checks that they exist. The server rejects the rest with a 400;
 * the panel mirrors the check so the admin sees it while typing.
 */
export const findUnknownVariables = (
  body: string,
  allowed: string[],
): string[] => {
  const unknown = new Set<string>();

  for (const [, name] of body.matchAll(PLACEHOLDER)) {
    if (!allowed.includes(name) && !isDynamicVariable(name)) unknown.add(name);
  }

  return [...unknown];
};

/** Preview render. An unknown placeholder is left as-is so the admin can spot it. */
export const renderSmsTemplate = (
  body: string,
  values: Record<string, string>,
): string =>
  body.replace(PLACEHOLDER, (match, name: string) => values[name] ?? match);
