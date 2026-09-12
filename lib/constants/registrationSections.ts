/**
 * The sections of the artist-registration page (`/artist-registration`), in
 * their shipped order. The admin builder (`/admin/registration-builder`)
 * reorders and hides them; the stored config lives in
 * `SiteContent.registrationSections` and is resolved by
 * `lib/utils/resolveRegistrationSections.ts`.
 *
 * The page is two screens, so every entry declares which one it belongs to —
 * ordering is only meaningful within a screen, and the admin panel groups by it:
 *  - `select`: the grid of forms (categories) the user picks from, `step === 0`
 *  - `flow`:   the chrome above the form body once a form is open, `step >= 1`
 *
 * The form body itself is deliberately not in the catalog: it always renders,
 * last, on the `flow` screen — there is no page left without it.
 *
 * Unlike the home builder this one is layout-only (no `copyKeys`): the
 * registration page's copy is per-category `formCopy`, edited in the admin
 * form-builder at `/admin/categories`, not in `SiteContent.landing`.
 */
export type RegistrationScreen = "select" | "flow";

export interface RegistrationSectionMeta {
  /** Label shown in the admin panel. */
  admin: string;
  /** Which of the page's two screens this section belongs to. */
  screen: RegistrationScreen;
  /** Renders inside the screen's shared `Card`. Consecutive `inCard` sections
   *  share one card, so reordering never splits the panel oddly. */
  inCard: boolean;
  /** Layout variants; the first is the default. Empty = one fixed layout. */
  variants: { key: string; admin: string }[];
  /** Where its structured content is edited, if any. */
  manageLink?: string;
  manageLabel?: string;
}

const CATALOG = {
  backLink: {
    inCard: false,
    admin: "لینک بازگشت به خانه",
    screen: "select",
    variants: [],
  },
  prompt: {
    inCard: true,
    admin: "عنوان انتخاب فرم",
    screen: "select",
    variants: [
      { key: "centered", admin: "وسط‌چین" },
      { key: "start", admin: "راست‌چین" },
    ],
  },
  categoryCards: {
    inCard: true,
    admin: "کارت‌های فرم‌ها",
    screen: "select",
    variants: [
      { key: "staggered", admin: "ردیف نامتقارن" },
      { key: "grid", admin: "گرید" },
      { key: "list", admin: "فهرست" },
      { key: "chips", admin: "برچسب" },
      { key: "posters", admin: "ریل پوستر" },
      { key: "covers", admin: "کاشی تصویری" },
    ],
    manageLink: "/admin/categories",
    manageLabel: "مدیریت دسته‌بندی‌ها و ترتیب آن‌ها",
  },
  formTitle: {
    inCard: false,
    admin: "عنوان فرم",
    screen: "flow",
    variants: [],
  },
  stepper: {
    inCard: false,
    admin: "نوار مراحل",
    screen: "flow",
    variants: [
      { key: "horizontal", admin: "مرحله‌ای افقی" },
      { key: "compact", admin: "شمارنده ساده" },
    ],
  },
} as const satisfies Record<string, RegistrationSectionMeta>;

export type RegistrationSectionKey = keyof typeof CATALOG;

/** Widened view of the catalog — `as const` above is only there to infer the keys. */
export const REGISTRATION_SECTIONS: Record<
  RegistrationSectionKey,
  RegistrationSectionMeta
> = CATALOG;

export const DEFAULT_REGISTRATION_SECTIONS = Object.keys(
  REGISTRATION_SECTIONS,
) as RegistrationSectionKey[];

