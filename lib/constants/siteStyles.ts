import { textElements, type IStyleField } from "../utils/sectionStyles.ts";

/**
 * Areas of the public site whose text the admin can restyle (`/admin/site-styles`),
 * stored as `SiteContent.siteStyles[areaKey]`. Each area is a `data-area` element:
 * header/footer/mobileNav carry it themselves, every page gets it on `<main>` from
 * its first path segment (`PageLayoutMain`). Fields hit `data-el` hooks inside it.
 * The home page body is styled per section in the page-builder instead.
 */
export interface ISiteStyleArea {
  admin: string;
  fields: IStyleField[];
  /** Root selector when the area can't carry `data-area` (portals, third-party roots). */
  scope?: string;
}

type Row = [string, string, string, boolean?];

const TITLE: Row = ["عنوان صفحه", "title", "[data-el=title]"];
const HEADING: Row = ["عنوان بخش‌ها", "heading", "[data-el=heading]"];
const BODY: Row = ["متن اصلی", "body", "[data-el=body]"];
const LINK: Row = ["لینک‌ها", "link", "[data-el=link]", true];
const BUTTON: Row = ["متن دکمه‌ها", "button", "[data-el=button]"];
const CARD_TITLE: Row = ["عنوان کارت‌ها", "card-title", "[data-el=card-title]", true];
const CARD_TEXT: Row = ["متن کارت‌ها", "card-text", "[data-el=card-text]"];
const CARD_META: Row = ["متن فرعی / برچسب کارت‌ها", "card-meta", "[data-el=card-meta]"];

/** ui-kit fields render native `<label>`/`<input>`, so plain tags are the hooks. */
export const FORM: IStyleField[] = [
  { group: "برچسب فیلدهای فرم", key: "label-size", label: "اندازه فونت", type: "px", responsive: true, css: { label: "font-size:$" } },
  { group: "برچسب فیلدهای فرم", key: "label-color", label: "رنگ", type: "color", css: { label: "color:$" } },
  { group: "متن داخل فیلدها", key: "input-size", label: "اندازه فونت", type: "px", responsive: true, css: { input: "font-size:$", textarea: "font-size:$" } },
  { group: "متن داخل فیلدها", key: "input-color", label: "رنگ", type: "color", css: { input: "color:$", textarea: "color:$" } },
  { group: "متن راهنمای داخل فیلدها (placeholder)", key: "placeholder-size", label: "اندازه فونت", type: "px", responsive: true, css: { "input::placeholder": "font-size:$", "textarea::placeholder": "font-size:$" } },
  { group: "متن راهنمای داخل فیلدها (placeholder)", key: "placeholder-color", label: "رنگ", type: "color", css: { "input::placeholder": "color:$", "textarea::placeholder": "color:$" } },
];

/** Tables. `TableColors` writes `:root table thead th` (and `th *`), which outranks a
 *  plain area-scoped `th`; `:not(#_)` adds id weight so the area value wins. */
const cell = (group: string, key: string, tag: "th" | "td"): IStyleField[] => [
  { group, key: `${key}-size`, label: "اندازه فونت", type: "px", responsive: true, css: { [`${tag}:not(#_)`]: "font-size:$" } },
  { group, key: `${key}-color`, label: "رنگ", type: "color", css: { [`${tag}:not(#_)`]: "color:$", ...(tag === "th" && { "th:not(#_) *": "color:$" }) } },
];
const TABLE: IStyleField[] = [...cell("سرستون جدول‌ها", "th", "th"), ...cell("خانه‌های جدول‌ها", "td", "td")];
/** Nav items: size hits every item, color/hover skip the active one, which gets
 *  its own color on `activeSel` (the active item's text). */
const navFields = (group: string, key: string, base: string, activeSel: string): IStyleField[] => {
  const idle = `${base}:not([data-active])`;
  return [
    { group, key: `${key}-size`, label: "اندازه فونت", type: "px", responsive: true, css: { [base]: "font-size:$" } },
    { group, key: `${key}-color`, label: "رنگ", type: "color", css: { [idle]: "color:$" } },
    { group, key: `${key}-hover`, label: "رنگ هنگام هاور", type: "color", css: { [`${idle}:hover`]: "color:$" } },
    { group, key: `${key}-active`, label: "رنگ آیتم فعال", type: "color", css: { [activeSel]: "color:$" } },
  ];
};

export const SITE_STYLE_AREAS: Record<string, ISiteStyleArea> = {
  header: {
    admin: "سربرگ سایت و منوی کناری",
    fields: [
      ...textElements([["نام سایت", "brand", "[data-el=brand]"]]),
      // The desktop link's shipped active color is a layered `!important`, so color its inner span.
      ...navFields("لینک‌های منو (دسکتاپ)", "nav", "[data-el=nav-link]", "[data-el=nav-link][data-active] > span"),
      ...textElements([["دکمه ورود / پروفایل", "button", "[data-el=button]"]]),
      ...navFields("لینک‌های منوی کناری (موبایل)", "menu", "[data-el=menu-link]", "[data-el=menu-link][data-active]"),
    ],
  },
  mobileNav: {
    admin: "نوار پایین موبایل",
    fields: navFields("برچسب آیتم‌ها", "label", "[data-el=label]", "[data-el=label][data-active]"),
  },
  footer: {
    admin: "فوتر",
    fields: textElements([
      ["نام سایت", "brand", "[data-el=brand]"],
      ["تلفن", "info", "[data-el=info]"],
      ["لینک‌ها", "link", "[data-el=link]", true],
      ["عنوان دانلود اپ", "title", "[data-el=title]"],
      ["متن کپی‌رایت", "copyright", "[data-el=copyright]"],
    ]),
  },
  artists: {
    admin: "هنرمندان (فهرست و صفحه هنرمند)",
    fields: [
      ...textElements([
        TITLE,
        LINK,
        ["کاشی دسته‌بندی‌ها", "tile", "[data-el=tile]"],
        ["تعداد نتایج / متن‌ها", "body", "[data-el=body]"],
        BUTTON,
        CARD_TITLE,
        CARD_TEXT,
        CARD_META,
        ["لینک کارت «مشاهده»", "card-link", "[data-el=card-link]"],
        ["فیلترها و برچسب‌های دسته‌بندی", "chip", "[data-el=chip]"],
        HEADING,
        ["برچسب مشخصات", "label-info", "[data-el=label]"],
        ["مقدار مشخصات", "value", "[data-el=value]"],
      ]),
      ...FORM,
    ],
  },
  about: {
    admin: "درباره ما",
    fields: textElements([TITLE, BODY, CARD_TITLE, CARD_TEXT]),
  },
  faq: {
    admin: "سوالات متداول",
    fields: textElements([
      TITLE,
      ["سوال", "question", "[data-el=question]"],
      ["پاسخ", "answer", "[data-el=answer]"],
    ]),
  },
  support: {
    admin: "پشتیبانی",
    fields: [...textElements([TITLE, BODY, CARD_TITLE, CARD_TEXT, CARD_META, BUTTON, ["عنوان فرم", "heading", "[data-el=heading]"]]), ...FORM],
  },
  terms: {
    admin: "قوانین",
    fields: textElements([TITLE, BODY]),
  },
  tutorials: {
    admin: "آموزش‌ها",
    fields: textElements([TITLE, LINK, BODY, CARD_TITLE, CARD_TEXT]),
  },
  "artist-registration": {
    admin: "ثبت‌نام هنرمند",
    fields: [
      ...textElements([
        LINK,
        TITLE,
        BODY,
        CARD_TITLE,
        CARD_META,
        ["راهنمای فیلدها", "help", "[data-el=help]"],
        BUTTON,
        // ui-kit stepper: subtitle shows on the current step only, the title is always last.
        ["مراحل — عنوان", "step-title", "[data-el=stepper] p:last-child"],
        ["مراحل — زیرعنوان", "step-subtitle", "[data-el=stepper] p:not(:last-child)"],
      ]),
      ...FORM,
    ],
  },
  profile: {
    admin: "پروفایل کاربر",
    fields: [
      ...textElements([
        TITLE,
        ["منوی پروفایل", "menu", "[data-el=menu-link]", true],
        BODY,
        CARD_TITLE,
        CARD_META,
        ["مبلغ کیف پول", "value", "[data-el=value]"],
      ]),
      ...TABLE,
      ...FORM,
    ],
  },
  drawer: {
    admin: "پنجره‌های کشویی (ورود، تکمیل پروفایل، درخواست تماس، تاریخ)",
    // ui-kit drawers portal to <body>; public ones carry the `site-drawer` class.
    scope: ".site-drawer",
    fields: [
      ...textElements([
        ["عنوان سربرگ پنجره", "head", ".site-drawer-head span:first-child"],
        TITLE,
        BODY,
        ["متن‌های فرعی", "meta", "[data-el=meta]"],
        LINK,
        BUTTON,
      ]),
      ...FORM,
    ],
  },
  toast: {
    admin: "پیام‌های اعلان (toast)",
    scope: ".Toastify",
    fields: textElements([
      ["همه پیام‌ها", "all", ".Toastify__toast"],
      ["پیام موفقیت", "success", ".Toastify__toast--success"],
      ["پیام خطا", "error", ".Toastify__toast--error"],
      ["پیام اطلاع", "info", ".Toastify__toast--info"],
      ["پیام هشدار", "warning", ".Toastify__toast--warning"],
    ]),
  },
};
