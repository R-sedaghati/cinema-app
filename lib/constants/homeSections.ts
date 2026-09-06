import type { LandingCopyKey } from "./landingCopy";

/**
 * The sections of the public home page (`app/(main)/page.tsx`), in their
 * shipped order. The admin page-builder (`/admin/page-builder`) reorders and
 * hides them; the stored config lives in `SiteContent.homeSections` and is
 * resolved by `lib/utils/resolveHomeSections.ts`.
 *
 * The catalog is fixed on purpose: every entry maps to a real component in
 * `components/home/sections/registry.ts`. Adding a section = adding it here and
 * to the registry — no DB write needed, it appends itself in catalog order.
 */
export interface HomeSectionMeta {
  /** Label shown in the admin panel. */
  admin: string;
  /** Renders outside the page's `max-w-6xl` wrapper. */
  fullBleed: boolean;
  /** LANDING_COPY keys this section renders — drives the per-section editor. */
  copyKeys: LandingCopyKey[];
  /** Where its structured content is edited, if not plain copy. */
  manageLink?: string;
  manageLabel?: string;
  /** Layout variants; the first is the default. Empty = one fixed layout. */
  variants: { key: string; admin: string }[];
}

const CATALOG = {
  bannerSlider: {
    variants: [
      { key: "slider", admin: "اسلاید خودکار" },
      { key: "still", admin: "تک‌تصویر ثابت" },
      { key: "filmstrip", admin: "نوار فیلم" },
    ],
    admin: "اسلایدر بنر",
    fullBleed: true,
    copyKeys: [],
    manageLink: "/admin/sliders",
    manageLabel: "مدیریت اسلایدرها",
  },
  searchHeader: {
    variants: [
      { key: "stacked", admin: "عنوان و جستجو" },
      { key: "marquee", admin: "سردر سینما" },
    ],
    fullBleed: false,
    admin: "سربرگ و جستجو",
    copyKeys: [
      "homeExploreKicker",
      "homeExploreTitle",
      "homeSearchPlaceholder",
    ],
  },
  categoryChips: {
    variants: [
      { key: "chips", admin: "برچسب" },
      { key: "tiles", admin: "کاشی تصویری" },
    ],
    fullBleed: false,
    admin: "دسته‌بندی‌ها",
    copyKeys: ["homeAllLabel"],
    manageLink: "/admin/categories",
    manageLabel: "مدیریت دسته‌بندی‌ها",
  },
  mainVideo: {
    variants: [
      { key: "framed", admin: "قاب‌دار" },
      { key: "bleed", admin: "تمام‌عرض" },
    ],
    fullBleed: false,
    admin: "ویدیو اصلی",
    copyKeys: [],
    manageLink: "/admin/tutorials",
    manageLabel: "مدیریت آموزش‌ها",
  },
  registrationRow: {
    variants: [
      { key: "posters", admin: "ریل پوستر" },
      { key: "grid", admin: "گرید" },
      { key: "list", admin: "فهرست" },
    ],
    fullBleed: false,
    admin: "میانبر ثبت‌نام هنرمند",
    copyKeys: ["homeRegistrationTitle", "homeRegistrationCta"],
  },
  artistGrid: {
    variants: [
      { key: "grid", admin: "گرید" },
      { key: "rail", admin: "ریل افقی" },
      { key: "castlist", admin: "فهرست بازیگران" },
    ],
    fullBleed: false,
    admin: "لیست هنرمندان",
    copyKeys: ["homeArtistsTitle", "homeArtistsCta", "homeEmptyArtists"],
  },
  tutorials: {
    variants: [
      { key: "grid", admin: "گرید" },
      { key: "rail", admin: "ریل افقی" },
    ],
    fullBleed: false,
    admin: "بخش آموزش‌ها",
    copyKeys: ["tutorialsSectionTitle", "tutorialsSectionCta"],
    manageLink: "/admin/tutorials",
    manageLabel: "مدیریت آموزش‌ها",
  },
  ctaCards: {
    variants: [
      { key: "cards", admin: "کارت" },
      { key: "rows", admin: "سطری" },
      { key: "panel", admin: "پنل یکپارچه" },
    ],
    fullBleed: false,
    admin: "کارت‌های پشتیبانی، آموزش و سوالات",
    copyKeys: [
      "homeSupportTitle",
      "homeSupportSubtitle",
      "homeTutorialsTitle",
      "homeTutorialsSubtitle",
      "homeFaqTitle",
      "homeFaqSubtitle",
    ],
  },
} as const satisfies Record<string, HomeSectionMeta>;

export type HomeSectionKey = keyof typeof CATALOG;

/** Widened view of the catalog — `as const` above is only there to infer the keys. */
export const HOME_SECTIONS: Record<HomeSectionKey, HomeSectionMeta> = CATALOG;

export const DEFAULT_HOME_SECTIONS = Object.keys(
  HOME_SECTIONS,
) as HomeSectionKey[];
