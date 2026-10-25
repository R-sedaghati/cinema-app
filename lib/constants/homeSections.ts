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
  { group: LAYOUT, key: "pad-top", label: "فاصله بالای بخش", type: "px", responsive: true, css: { "[data-el=root]": "padding-top:$" } },
  { group: LAYOUT, key: "pad-bottom", label: "فاصله پایین بخش", type: "px", responsive: true, css: { "[data-el=root]": "padding-bottom:$" } },
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
  { group: ICON, key: "icon-inset", label: "فاصله از لبه کادر", type: "px", css: { "[data-el=icon]": "right:$" } },
  { group: BOX, key: "input-pad", label: "فاصله متن از لبه (سمت آیکون)", type: "px", responsive: true, css: { "[data-el=input]": "padding-right:$" } },
];

const SLIDE = "اسلاید";
const SLIDE_SPACE = "فاصله‌های متن اسلاید";
const BTN = "دکمه اسلاید";
const DOTS = "نقطه‌های اسلایدر";

/** `data-el` hooks live in `components/home/sections/BannerSliderSection.tsx`. Per-slide
 *  font size/color set in /admin/sliders are inline and win over these. */
const BANNER_STYLES: IStyleField[] = [
  ...textElements([["عنوان اسلاید", "title", "[data-el=title]"], ["زیرعنوان اسلاید", "subtitle", "[data-el=subtitle]"], ["متن دکمه اسلاید", "button", "[data-el=button]"]]),
  { group: SLIDE, key: "banner-height", label: "ارتفاع بنر", type: "px", responsive: true, css: { "[data-el=banner]": "height:$" } },
  { group: SLIDE, key: "frame-pad-x", label: "فاصله متن از لبه‌ها", type: "px", responsive: true, css: { "[data-el=frame]": "padding-inline:$" } },
  { group: SLIDE, key: "frame-bg", label: "رنگ پس‌زمینه اسلاید", type: "color", css: { "[data-el=frame]": "background-image:none;background-color:$" } },
  { group: SLIDE, key: "content-width", label: "عرض بیشینه متن", type: "px", responsive: true, css: { "[data-el=content]": "max-width:$" } },
  { group: SLIDE, key: "strip-gap", label: "فاصله بین فریم‌ها (نوار فیلم)", type: "px", responsive: true, css: { "[data-el=strip]": "gap:$" } },
  { group: SLIDE_SPACE, key: "subtitle-gap", label: "فاصله زیرعنوان تا عنوان", type: "px", responsive: true, css: { "[data-el=subtitle]": "margin-bottom:$" } },
  { group: SLIDE_SPACE, key: "title-gap", label: "فاصله عنوان تا دکمه", type: "px", responsive: true, css: { "[data-el=title]": "margin-bottom:$" } },
  { group: BTN, key: "button-bg", label: "رنگ پس‌زمینه", type: "color", css: { "[data-el=button]": "background-color:$" } },
  { group: BTN, key: "button-radius", label: "گردی گوشه", type: "px", css: { "[data-el=button]": "border-radius:$" } },
  { group: BTN, key: "button-pad-x", label: "فاصله داخلی افقی", type: "px", responsive: true, css: { "[data-el=button]": "padding-inline:$" } },
  { group: BTN, key: "button-pad-y", label: "فاصله داخلی عمودی", type: "px", responsive: true, css: { "[data-el=button]": "padding-block:$" } },
  { group: DOTS, key: "dot-color", label: "رنگ نقطه فعال", type: "color", css: { ".swiper-pagination-bullet.swiper-pagination-bullet-active": "background:$" } },
  { group: DOTS, key: "dot-idle", label: "رنگ نقطه‌های دیگر", type: "color", css: { ".swiper-pagination-bullet:not(.swiper-pagination-bullet-active)": "background:$" } },
  { group: DOTS, key: "dot-size", label: "اندازه نقطه", type: "px", css: { "[data-el=banner]": "--swiper-pagination-bullet-size:$" } },
  { group: DOTS, key: "dot-gap", label: "فاصله بین نقطه‌ها", type: "px", css: { "[data-el=banner]": "--swiper-pagination-bullet-horizontal-gap:$" } },
  { group: DOTS, key: "dot-bottom", label: "فاصله از پایین", type: "px", responsive: true, css: { "[data-el=banner]": "--swiper-pagination-bottom:$" } },
];

const VIDEO_TITLE = "عنوان ویدیو";
const VIDEO = "قاب ویدیو";

/** `data-el` hooks live in `components/home/sections/MainVideoSection.tsx`. */
const VIDEO_STYLES: IStyleField[] = [
  ...textElements([[VIDEO_TITLE, "title", "[data-el=title]"]]),
  { group: VIDEO_TITLE, key: "title-weight", label: "ضخامت فونت", type: "weight", css: { "[data-el=title]": "font-weight:$" } },
  { group: VIDEO_TITLE, key: "title-gap", label: "فاصله عنوان و ویدیو", type: "px", responsive: true, css: { "[data-el=frame]": "gap:$", "p[data-el=title]": "padding-top:$" } },
  { group: VIDEO_TITLE, key: "title-pad-x", label: "فاصله افقی عنوان (تمام‌عرض)", type: "px", responsive: true, css: { "p[data-el=title]": "padding-inline:$" } },
  { group: VIDEO, key: "player-radius", label: "گردی گوشه ویدیو", type: "px", css: { "[data-el=player]": "border-radius:$" } },
  { group: VIDEO, key: "frame-bg", label: "رنگ پس‌زمینه قاب (قاب‌دار)", type: "color", css: { "[data-el=frame]": "background-color:$" } },
  { group: VIDEO, key: "frame-border", label: "رنگ حاشیه قاب", type: "color", css: { "[data-el=frame]": "border:1px solid $" } },
  { group: VIDEO, key: "frame-pad", label: "فاصله داخلی قاب", type: "px", responsive: true, css: { "[data-el=frame]": "padding:$" } },
  { group: VIDEO, key: "frame-radius", label: "گردی گوشه قاب", type: "px", css: { "[data-el=frame]": "border-radius:$" } },
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
  { group: SPACE, key: "pad-bottom", label: "فاصله پایین ردیف", type: "px", responsive: true, css: { "[data-el=root]": "padding-bottom:$" } },
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
    styles: BANNER_STYLES,
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
    styles: VIDEO_STYLES,
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
