import { textElements, type IStyleField } from "../utils/sectionStyles.ts";
import { FORM } from "./siteStyles.ts";

/**
 * The sections of the support page (`/support`), in their shipped order. The admin
 * builder (`/admin/support-builder`) reorders, hides, restyles and edits them; the
 * stored config lives in `SiteContent.supportSections`, the text in
 * `SiteContent.support` / `SiteContent.contactForm`. `data-el` hooks live in
 * `components/support/`.
 */
export interface SupportSectionMeta {
  admin: string;
  hasCards?: boolean;
  styles?: IStyleField[];
  /** Layout variants; the first is the default. Empty = one fixed layout. */
  variants: { key: string; admin: string }[];
}

/** Background, border, corner radius and padding of a box. Keys: `${key}-bg` etc. */
const box = (group: string, key: string, sel: string): IStyleField[] => [
  { group, key: `${key}-bg`, label: "پس‌زمینه", type: "color", css: { [sel]: "background-color:$" } },
  { group, key: `${key}-border`, label: "رنگ حاشیه", type: "color", css: { [sel]: "border-color:$" } },
  { group, key: `${key}-radius`, label: "گردی گوشه", type: "px", css: { [sel]: "border-radius:$" } },
  { group, key: `${key}-pad`, label: "فاصله داخلی", type: "px", responsive: true, css: { [sel]: "padding:$" } },
];

const CATALOG = {
  intro: {
    admin: "عنوان و توضیح",
    variants: [
      { key: "centered", admin: "وسط‌چین" },
      { key: "start", admin: "راست‌چین" },
    ],
    styles: [
      ...textElements([["عنوان", "title", "[data-el=title]"], ["توضیح", "body", "[data-el=body]"]]),
      { group: "فاصله‌ها", key: "gap", label: "فاصله عنوان تا توضیح", type: "px", responsive: true, css: { "[data-el=root]": "gap:$" } },
    ],
  },
  cards: {
    admin: "کارت‌های راه‌های ارتباطی",
    hasCards: true,
    variants: [
      { key: "cards", admin: "کارت" },
      { key: "rows", admin: "سطری" },
    ],
    styles: [
      ...textElements([
        ["عنوان کارت", "card-title", "[data-el=card-title]"],
        ["متن کارت", "card-text", "[data-el=card-text]"],
        ["متن پایین کارت", "card-meta", "[data-el=card-meta]"],
        ["متن دکمه", "button", "[data-el=button]"],
      ]),
      ...box("کارت‌ها", "card", "[data-el=card]"),
      { group: "فاصله‌ها", key: "gap", label: "فاصله بین کارت‌ها", type: "px", responsive: true, css: { "[data-el=items]": "gap:$" } },
      { group: "فاصله‌ها", key: "image-height", label: "ارتفاع تصویر کارت", type: "px", responsive: true, css: { "[data-el=image]": "height:$;width:auto" } },
    ],
  },
  contactForm: {
    admin: "فرم تماس با ما",
    variants: [],
    styles: [
      ...textElements([["عنوان فرم", "heading", "[data-el=heading]"], ["متن دکمه ارسال", "button", "[data-el=button]"]]),
      ...box("کادر فرم", "box", "[data-el=form]"),
      { group: "فاصله‌ها", key: "gap", label: "فاصله بین فیلدها", type: "px", responsive: true, css: { "[data-el=form]": "gap:$" } },
      ...FORM,
    ],
  },
} as const satisfies Record<string, SupportSectionMeta>;

export type SupportSectionKey = keyof typeof CATALOG;

/** Widened view of the catalog — `as const` above is only there to infer the keys. */
export const SUPPORT_SECTIONS: Record<SupportSectionKey, SupportSectionMeta> = CATALOG;
