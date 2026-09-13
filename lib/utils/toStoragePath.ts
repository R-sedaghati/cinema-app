/**
 * API reads return full storage URLs, but writes expect the bare storage path
 * (`banners/{uuid}.jpg`) — the backend prepends the origin itself. Echoing a
 * read URL back stacks another origin on every save. Strips all leading
 * origins, so already-corrupted values heal on the next save.
 */
export const toStoragePath = (url: string) =>
  url.replace(/^(?:https?:\/\/[^/]+\/)+/, "");
