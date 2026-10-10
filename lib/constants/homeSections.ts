import type { LandingCopyKey } from "./landingCopy";
import { textElements, type IStyleField } from "../utils/sectionStyles.ts";

const T = "عنوان";
const ST = "زیرعنوان";
const LAYOUT = "چیدمان و فاصله‌ها";
const BOX = "کادر جستجو";
const ICON = "آیکون جستجو";

/** `data-el` hooks live in `components/home/sections/SearchHeaderSection.tsx`. */
const SEARCH_HEADER_STYLES: IStyleField[] = [
  { group: T, key: "title-size", label: "اندازه فونت", type: "px", responsive: true, css: { "[data-el=title]": "font-size:$" } },
  { group: T, key: "title-weight", label: "ضخامت فونت", type: "weight", css: { "[data-el=title]": "font-weight:$" } },
  { group: T, key: "title-color", label: "رنگ", type: "color", css: { "[data-el=title]": "color:$" } },
  { group: ST, key: "subtitle-size", label: "اندازه فونت", type: "px", responsive: true, css: { "[data-el=subtitle]": "font-size:$" } },
  { group: ST, key: "subtitle-weight", label: "ضخامت فونت", type: "weight", css: { "[data-el=subtitle]": "font-weight:$" } },
  { group: ST, key: "subtitle-color", label: "رنگ", type: "color", css: { "[data-el=subtitle]": "color:$" } },
  {
    group: LAYOUT, key: "align", label: "تراز", type: "align",
    css: {
      "[data-el=root]": "text-align:$",
      "[data-el=title]": "margin-inline:$m",
      "[data-el=subtitle]": "margin-inline:$m",
      "[data-el=search]": "margin-inline:$m",
    },
  },
  { group: LAYOUT, key: "title-gap", label: "فاصله عنوان تا زیرعنوان", type: "px", responsive: true, css: { "[data-el=subtitle]": "margin-top:$" } },
  {
    group: LAYOUT, key: "search-gap", label: "فاصله متن تا جستجو", type: "px", responsive: true,
    css: { "[data-el=heading]": "margin-bottom:0", "[data-el=search]": "margin-top:$" },
  },
  { group: LAYOUT, key: "search-width", label: "عرض کادر جستجو", type: "px", responsive: true, css: { "[data-el=search]": "width:$;max-width:100%" } },
  { group: BOX, key: "input-height", label: "ارتفاع", type: "px", responsive: true, css: { "[data-el=input]": "height:$;padding-block:0" } },
  { group: BOX, key: "input-size", label: "اندازه فونت", type: "px", responsive: true, css: { "[data-el=input]": "font-size:$" } },
  { group: BOX, key: "input-radius", label: "گردی گوشه", type: "px", css: { "[data-el=input]": "border-radius:$" } },
  { group: BOX, key: "input-bg", label: "رنگ پس‌زمینه", type: "color", css: { "[data-el=input]": "background-color:$" } },
  { group: BOX, key: "input-border", label: "رنگ حاشیه", type: "color", css: { "[data-el=input]": "border-color:$" } },
  { group: BOX, key: "input-color", label: "رنگ متن", type: "color", css: { "[data-el=input]": "color:$" } },
  { group: BOX, key: "input-placeholder", label: "رنگ متن راهنما", type: "color", css: { "[data-el=input]::placeholder": "color:$" } },
  { group: BOX, key: "input-focus", label: "رنگ حاشیه هنگام تایپ", type: "color", css: { "[data-el=input]:focus": "--tw-ring-color:$" } },
  { group: ICON, key: "icon-size", label: "اندازه", type: "px", css: { "[data-el=icon]": "width:$;height:$" } },
  { group: ICON, key: "icon-color", label: "رنگ", type: "color", css: { "[data-el=icon]": "color:$" } },
];

const ITEM = "[data-el=item]:not([data-all])";
const COLORS = "رنگ برچسب‌ها / کاشی‌ها";
const SHAPE = "شکل و متن";
const SPACE = "فاصله‌ها";
const ALL = "دکمه «همه»";

/** `data-el` hooks live in `components/home/sections/CategoryChipsSection.tsx`. */
const CATEGORY_STYLES: IStyleField[] = [
  { group: COLORS, key: "item-bg", label: "پس‌زمینه", type: "color", css: { [ITEM]: "background-color:$" } },
  { group: COLORS, key: "item-color", label: "رنگ متن", type: "color", css: { [`${ITEM} [data-el=item-name]`]: "color:$" } },
  { group: COLORS, key: "item-border", label: "رنگ حاشیه", type: "color", css: { [ITEM]: "border:1px solid $" } },
  { group: COLORS, key: "item-hover-bg", label: "پس‌زمینه هنگام هاور", type: "color", css: { [`${ITEM}:hover`]: "background-color:$" } },
  { group: COLORS, key: "item-hover-color", label: "رنگ متن هنگام هاور", type: "color", css: { [`${ITEM}:hover [data-el=item-name]`]: "color:$" } },
  { group: SHAPE, key: "item-radius", label: "گردی گوشه", type: "px", css: { "[data-el=item]": "border-radius:$" } },
  { group: SHAPE, key: "item-pad-x", label: "فاصله داخلی افقی", type: "px", responsive: true, css: { "[data-pad]": "padding-inline:$" } },
  { group: SHAPE, key: "item-pad-y", label: "فاصله داخلی عمودی", type: "px", responsive: true, css: { "[data-pad]": "padding-block:$" } },
  { group: SHAPE, key: "item-size", label: "اندازه فونت نام", type: "px", responsive: true, css: { "[data-el=item-name]": "font-size:$" } },
  { group: SHAPE, key: "item-weight", label: "ضخامت فونت نام", type: "weight", css: { "[data-el=item-name]": "font-weight:$" } },
  { group: SHAPE, key: "desc-size", label: "اندازه فونت توضیح", type: "px", responsive: true, css: { "[data-el=item-desc]": "font-size:$" } },
  { group: SHAPE, key: "desc-color", label: "رنگ توضیح", type: "color", css: { "[data-el=item-desc]": "color:$" } },
  { group: SPACE, key: "gap", label: "فاصله بین آیتم‌ها", type: "px", responsive: true, css: { "[data-el=items]": "gap:$" } },
  { group: SPACE, key: "cols", label: "تعداد ستون (فقط کاشی)", type: "count", responsive: true, css: { "[data-el=items][data-grid]": "grid-template-columns:$" } },
  { group: ALL, key: "all-bg", label: "پس‌زمینه", type: "color", css: { "[data-all]": "background-color:$" } },
  { group: ALL, key: "all-color", label: "رنگ متن", type: "color", css: { "[data-all] [data-el=item-name]": "color:$" } },
  { group: ALL, key: "all-border", label: "رنگ حاشیه", type: "color", css: { "[data-all]": "border:1px solid $" } },
  { group: ALL, key: "all-hover-bg", label: "پس‌زمینه هنگام هاور", type: "color", css: { "[data-all]:hover": "background-color:$" } },
  { group: ALL, key: "all-hover-color", label: "رنگ متن هنگام هاور", type: "color", css: { "[data-all]:hover [data-el=item-name]": "color:$" } },
];

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
  /** Renders cards — the admin gets card width/height controls. */
  hasCards?: boolean;
  /** Per-element style controls in the page-builder (see `sectionStyles.ts`). */
  styles?: IStyleField[];
  /** Layout variants; the first is the default. Empty = one fixed layout. */
  variants: { key: string; admin: string }[];
}

const TITLE: [string, string, string, boolean?] = ["عنوان بخش", "title", "[data-el=title]"];
const LINK: [string, string, string, boolean?] = ["لینک «مشاهده همه»", "link", "[data-el=link]", true];
const CARD_TITLE: [string, string, string, boolean?] = ["عنوان کارت", "card-title", "[data-el=card-title]", true];
const CARD_TEXT: [string, string, string, boolean?] = ["متن کارت", "card-text", "[data-el=card-text]"];
const CARD_META: [string, string, string, boolean?] = ["متن فرعی کارت", "card-meta", "[data-el=card-meta]"];

const CATALOG = {
  bannerSlider: {
    hasCards: true,
    variants: [
      { key: "slider", admin: "اسلاید خودکار" },
      { key: "still", admin: "تک‌تصویر ثابت" },
      { key: "filmstrip", admin: "نوار فیلم" },
    ],
    admin: "اسلایدر بنر",
    styles: textElements([["عنوان اسلاید", "title", "[data-el=title]"], ["زیرعنوان اسلاید", "subtitle", "[data-el=subtitle]"], ["دکمه اسلاید", "button", "[data-el=button]"]]),
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
    styles: SEARCH_HEADER_STYLES,
    copyKeys: [
      "homeExploreKicker",
      "homeExploreTitle",
      "homeSearchPlaceholder",
    ],
  },
  categoryChips: {
    hasCards: true,
    variants: [
      { key: "chips", admin: "برچسب" },
      { key: "tiles", admin: "کاشی تصویری" },
    ],
    fullBleed: false,
    admin: "دسته‌بندی‌ها",
    styles: CATEGORY_STYLES,
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
    styles: textElements([TITLE]),
    copyKeys: [],
    manageLink: "/admin/tutorials",
    manageLabel: "مدیریت آموزش‌ها",
  },
  registrationRow: {
    hasCards: true,
    variants: [
      { key: "posters", admin: "ریل پوستر" },
      { key: "grid", admin: "گرید" },
      { key: "list", admin: "فهرست" },
      { key: "chips", admin: "برچسب ساده" },
      { key: "columns", admin: "ستونی متنی" },
    ],
    fullBleed: false,
    admin: "میانبر ثبت‌نام هنرمند",
    styles: textElements([TITLE, LINK, CARD_TITLE, CARD_TEXT]),
    copyKeys: ["homeRegistrationTitle", "homeRegistrationCta"],
  },
  artistGrid: {
    hasCards: true,
    variants: [
      { key: "grid", admin: "گرید" },
      { key: "rail", admin: "ریل افقی" },
      { key: "castlist", admin: "فهرست بازیگران" },
      { key: "tiles", admin: "کاشی ساده" },
      { key: "text", admin: "فهرست متنی" },
    ],
    fullBleed: false,
    admin: "لیست هنرمندان",
    styles: textElements([TITLE, LINK, CARD_TITLE, CARD_TEXT, CARD_META]),
    copyKeys: ["homeArtistsTitle", "homeArtistsCta", "homeEmptyArtists"],
  },
  tutorials: {
    hasCards: true,
    variants: [
      { key: "grid", admin: "گرید" },
      { key: "rail", admin: "ریل افقی" },
      { key: "list", admin: "سطری فشرده" },
      { key: "text", admin: "فهرست متنی" },
    ],
    fullBleed: false,
    admin: "بخش آموزش‌ها",
    styles: textElements([TITLE, LINK, CARD_TITLE]),
    copyKeys: ["tutorialsSectionTitle", "tutorialsSectionCta"],
    manageLink: "/admin/tutorials",
    manageLabel: "مدیریت آموزش‌ها",
  },
  ctaCards: {
    hasCards: true,
    variants: [
      { key: "cards", admin: "کارت" },
      { key: "rows", admin: "سطری" },
      { key: "panel", admin: "پنل یکپارچه" },
    ],
    fullBleed: false,
    admin: "کارت‌های پشتیبانی، آموزش و سوالات",
    styles: textElements([CARD_TITLE, CARD_TEXT]),
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
