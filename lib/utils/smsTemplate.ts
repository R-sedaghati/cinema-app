/** `{firstName}` — the only placeholder shape the backend renderer substitutes. */
const PLACEHOLDER = /\{(\w+)\}/g;

/**
 * Placeholders used in `body` that the event does not offer. The server rejects these
 * with a 400; the panel mirrors the check so the admin sees it while typing.
 */
export const findUnknownVariables = (
  body: string,
  allowed: string[],
): string[] => {
  const unknown = new Set<string>();

  for (const [, name] of body.matchAll(PLACEHOLDER)) {
    if (!allowed.includes(name)) unknown.add(name);
  }

  return [...unknown];
};

/** Preview render. An unknown placeholder is left as-is so the admin can spot it. */
export const renderSmsTemplate = (
  body: string,
  values: Record<string, string>,
): string =>
  body.replace(PLACEHOLDER, (match, name: string) => values[name] ?? match);
