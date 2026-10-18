/**
 * Preset looks for the download page. Keys are what the backend stores; an unknown
 * or missing key falls back to the first entry. Admin color/size fields are inline
 * styles, so they still win over a variant's classes.
 */
export interface IDownloadVariant {
  label: string;
  className: string;
  /** Replaces the element's default font-size class (inline admin size still wins). */
  size?: string;
  /** Sections only: grid classes replacing the column/row body; the admin layout setting is ignored. */
  body?: string;
}

export const SECTION_VARIANTS: Record<string, IDownloadVariant> = {
  plain: { label: "ساده", className: "" },
  card: {
    label: "کارت",
    className: "rounded-4xl border-2 border-primary-500/20 bg-zinc-900/40 shadow-card backdrop-blur-sm",
  },
  glass: { label: "شیشه‌ای", className: "rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md" },
  hero: { label: "هیرو", className: "bg-radial-primary min-h-[60vh] content-center py-16 text-center" },
  gradient: {
    label: "گرادیان",
    className: "rounded-4xl bg-linear-to-br from-primary-600/40 via-zinc-900/60 to-zinc-950",
  },
  outline: { label: "قاب‌دار", className: "rounded-3xl border-2 border-dashed border-primary-500/40" },
  dark: { label: "تیره", className: "rounded-3xl bg-zinc-950 ring-1 ring-white/5" },
  light: { label: "روشن", className: "rounded-3xl bg-white text-zinc-900" },
  spotlight: {
    label: "نورانی",
    className: "rounded-4xl border border-primary-500/40 bg-zinc-900/60 shadow-[0_0_60px_rgba(216,154,43,0.25)]",
  },
  stripe: { label: "نوار کناری", className: "rounded-e-3xl border-s-4 border-primary-500 bg-zinc-900/40" },
  banner: {
    label: "بنر تمام‌عرض",
    className: "!max-w-none border-y border-primary-500/30 bg-primary-600/15 py-12",
  },
  "banner-bottom": {
    label: "بنر با متن پایین",
    className: "min-h-[360px] content-end rounded-4xl bg-zinc-900 pb-10",
  },
  floating: {
    label: "نوار شناور",
    className: "sticky bottom-4 z-10 rounded-full bg-zinc-900/90 py-3 shadow-card backdrop-blur-md",
  },
  split: {
    label: "دو ستونه",
    className: "",
    body: "grid grid-cols-1 items-center @xl:grid-cols-2",
  },
  "split-reverse": {
    label: "دو ستونه برعکس",
    className: "",
    body: "grid grid-cols-1 items-center @xl:grid-cols-2 @xl:[&>*:first-child]:order-2",
  },
  columns: {
    label: "سه ستونه",
    className: "",
    body: "grid grid-cols-1 items-start @md:grid-cols-2 @3xl:grid-cols-3",
  },
  tiles: {
    label: "کاشی‌ها",
    className: "",
    body: "grid grid-cols-1 @md:grid-cols-2 @3xl:grid-cols-3 [&>*]:rounded-2xl [&>*]:border [&>*]:border-white/10 [&>*]:bg-white/5 [&>*]:p-5",
  },
  features: {
    label: "ویژگی‌ها (۴ تایی)",
    className: "",
    body: "grid grid-cols-2 items-start @3xl:grid-cols-4",
  },
};

export const TEXT_VARIANTS: Record<string, IDownloadVariant> = {
  plain: { label: "ساده", className: "" },
  gradient: {
    label: "گرادیان",
    className: "bg-linear-to-l from-primary-300 to-primary-600 bg-clip-text text-transparent",
  },
  accent: {
    label: "خط تأکید",
    className: "after:mx-auto after:mt-3 after:block after:h-1 after:w-16 after:rounded-full after:bg-primary-500",
  },
  eyebrow: {
    label: "برچسب",
    className: "!w-auto rounded-full border border-primary-500/40 bg-primary-500/10 px-4 py-1 text-primary-300",
    size: "text-sm",
  },
  muted: { label: "کم‌رنگ", className: "opacity-70" },
  quote: { label: "نقل‌قول", className: "border-s-4 border-primary-500 ps-4 italic" },
  highlight: { label: "هایلایت", className: "!w-auto rounded-lg bg-primary-500/15 px-3 py-1" },
  glow: { label: "درخشان", className: "drop-shadow-[0_2px_12px_rgba(216,154,43,0.55)]" },
  stroke: { label: "توخالی", className: "text-transparent [-webkit-text-stroke:1px_currentColor]" },
  display: { label: "خیلی بزرگ", className: "leading-tight", size: "text-5xl @xl:text-6xl" },
  small: { label: "ریز", className: "opacity-80", size: "text-xs" },
};

export const IMAGE_VARIANTS: Record<string, IDownloadVariant> = {
  plain: { label: "ساده", className: "" },
  rounded: { label: "گرد + سایه", className: "rounded-3xl shadow-card" },
  circle: { label: "دایره", className: "aspect-square rounded-full object-cover" },
  phone: {
    label: "قاب موبایل",
    className: "rounded-[2.5rem] border-[10px] border-zinc-800 shadow-card ring-1 ring-white/10",
  },
  glow: { label: "درخشان", className: "rounded-2xl drop-shadow-[0_0_30px_rgba(216,154,43,0.35)]" },
  banner: { label: "بنر عریض", className: "aspect-[21/9] w-full rounded-3xl object-cover" },
  "banner-full": { label: "بنر بدون گوشه", className: "aspect-[16/6] w-full object-cover" },
  cover: { label: "کاور ۱۶:۹", className: "aspect-video w-full rounded-2xl object-cover" },
  square: { label: "مربع", className: "aspect-square rounded-2xl object-cover" },
  tablet: {
    label: "قاب تبلت",
    className: "rounded-[1.75rem] border-[14px] border-zinc-800 shadow-card ring-1 ring-white/10",
  },
  framed: { label: "قاب سفید", className: "rounded-2xl border-4 border-white/90 shadow-card" },
  gold: { label: "قاب طلایی", className: "rounded-3xl border-2 border-primary-500 p-1" },
  polaroid: { label: "پولاروید", className: "rounded-sm bg-white p-2 pb-8 shadow-card" },
  tilted: { label: "کج", className: "-rotate-3 rounded-3xl shadow-card transition hover:rotate-0" },
  fade: { label: "محو پایین", className: "[mask-image:linear-gradient(to_bottom,black_60%,transparent)]" },
  grayscale: { label: "سیاه‌سفید", className: "grayscale transition hover:grayscale-0" },
};

export const BUTTON_VARIANTS: Record<string, IDownloadVariant> = {
  filled: { label: "پر", className: "bg-primary-600 text-white" },
  outline: { label: "حاشیه‌دار", className: "border-2 border-primary-500 bg-transparent text-primary-400" },
  ghost: { label: "شفاف", className: "bg-white/5 text-white hover:bg-white/10" },
  pill: { label: "کپسولی", className: "!rounded-full bg-primary-600 text-white" },
  gradient: {
    label: "گرادیان",
    className: "bg-linear-to-l from-primary-400 to-primary-700 text-white shadow-card",
  },
  store: {
    label: "نشان فروشگاه",
    className: "border border-white/20 bg-black text-white",
  },
  soft: { label: "ملایم", className: "bg-primary-500/15 text-primary-300" },
  dark: { label: "تیره", className: "border border-white/10 bg-zinc-900 text-white" },
  light: { label: "روشن", className: "bg-white text-zinc-900" },
  glow: { label: "درخشان", className: "bg-primary-600 text-white shadow-[0_0_24px_rgba(216,154,43,0.6)]" },
  square: { label: "گوشه تیز", className: "!rounded-none bg-primary-600 text-white" },
  large: { label: "بزرگ", className: "!px-8 !py-4 bg-primary-600 text-lg text-white" },
  link: { label: "لینک", className: "!bg-transparent !p-0 text-primary-400 underline underline-offset-4" },
};

export const variantOf = (catalog: Record<string, IDownloadVariant>, key?: string) =>
  catalog[key ?? ""] ?? Object.values(catalog)[0];
