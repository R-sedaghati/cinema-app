/**
 * Public pages whose background the admin can set (`/admin/page-backgrounds`).
 * Keys are the first path segment of the `app/(main)` routes (`/` → `home`);
 * `default` covers every page without its own entry. Stored in
 * `SiteContent.pageBackgrounds`, resolved by `lib/utils/pageBackground.ts`.
 */
export const PAGE_BACKGROUNDS = {
  default: "همه صفحات (پیش‌فرض)",
  home: "صفحه اصلی",
  artists: "هنرمندان",
  "artist-registration": "ثبت‌نام هنرمند",
  profile: "پروفایل",
  support: "پشتیبانی",
  faq: "سوالات متداول",
  about: "درباره ما",
  terms: "قوانین",
  tutorials: "آموزش‌ها",
} as const;

export type PageBackgroundKey = keyof typeof PAGE_BACKGROUNDS;
