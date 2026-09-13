/**
 * API reads return full storage URLs, but writes expect the bare storage path
 * (`banners/{uuid}.jpg`) — the backend prepends the origin itself. Echoing a
 * read URL back stacks another origin on every save. Strips all leading
 * origins, so already-corrupted values heal on the next save.
 */
export const toStoragePath = (url: string) =>
  url.replace(/^(?:https?:\/\/[^/]+\/)+/, "");

/**
 * Rows saved before the toStoragePath fix still hold stacked origins in the DB,
 * so reads come back as `https://storage…/https://storage…/banners/x.jpg`.
 * Walks an API response and keeps only the last origin on every string.
 */
export const unstackStorageUrls = <T>(data: T): T => {
  if (typeof data === "string") {
    return data.replace(/^(?:https?:\/\/[^/]+\/)+(https?:\/\/[^/]+\/)/, "$1") as T;
  }
  if (Array.isArray(data)) return data.map(unstackStorageUrls) as T;
  // Plain objects only: Blob/ArrayBuffer download responses pass through untouched.
  if (data && Object.getPrototypeOf(data) === Object.prototype) {
    return Object.fromEntries(
      Object.entries(data).map(([k, v]) => [k, unstackStorageUrls(v)]),
    ) as T;
  }
  return data;
};
