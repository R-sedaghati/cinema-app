/** One page's background as stored in `SiteContent.pageBackgrounds`. */
export interface IPageBackground {
  /** `#rrggbb` */
  color?: string;
  /** Full URL on read, bare storage path on write (see `toStoragePath`). */
  image?: string;
  /** 0–90, % black laid over the image so light text stays readable. */
  overlay?: number;
}

const isSet = (bg?: IPageBackground | null): bg is IPageBackground =>
  Boolean(bg && (bg.color || bg.image));

/** The background for a pathname: its page's own entry, else `default`, else none. */
export function resolvePageBackground(
  map: Record<string, IPageBackground> | null | undefined,
  pathname: string,
): IPageBackground | null {
  const key = pathname.split("/")[1] || "home";
  if (isSet(map?.[key])) return map[key];
  return isSet(map?.default) ? map.default : null;
}
