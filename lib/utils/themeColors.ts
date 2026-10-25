/**
 * Site palette, `SiteContent.themeColors` (key → `#rrggbb`). Every color class on the
 * public site resolves to a CSS var — Tailwind's `--color-zinc-*`, the ui-kit's
 * `--dgs-color-*` (space-separated rgb) — so overriding those vars on `:root`
 * recolors every component using that shade, no per-component wiring.
 * Admin edits it in `/admin/page-backgrounds`; `ThemeColors` renders it.
 */
export interface IThemeColor {
  key: string;
  label: string;
  group: string;
  /** Shipped value, shown as the swatch while unset. */
  value: string;
  /** CSS vars it sets; `rgb:` prefix = ui-kit's `r g b` triple format. */
  vars: string[];
}

const BRAND = "رنگ اصلی سایت (طلایی)";
const TEXT = "متن‌ها";
const SURFACE = "پس‌زمینه کادرها، کارت‌ها و حاشیه‌ها";
const STATUS = "وضعیت‌ها";
const KIT = "فرم‌ها و پنجره‌ها";

const zinc = (shade: string, group: string, label: string, value: string): IThemeColor =>
  ({ key: `zinc-${shade}`, group, label, value, vars: [`--color-zinc-${shade}`] });

/** Brand shades: the app paints its gold through ui-kit `primary-*` and `error-*` (see globals.css). */
const brand = (shade: string, label: string, value: string): IThemeColor => ({
  key: `brand-${shade}`,
  group: BRAND,
  label,
  value,
  vars: [`rgb:--dgs-color-primary-${shade}`, `rgb:--dgs-color-error-${shade}`,
    ...(shade === "500" ? ["--accent"] : [])],
});

export const THEME_COLORS: IThemeColor[] = [
  brand("500", "رنگ اصلی (دکمه‌ها، لینک‌ها، آیکون‌ها)", "#d89a2b"),
  brand("600", "رنگ اصلی روشن (هاور)", "#e7b450"),
  brand("400", "رنگ اصلی تیره", "#aa7624"),
  brand("700", "رنگ اصلی خیلی روشن", "#f1c878"),
  { key: "foreground", group: TEXT, label: "متن پیش‌فرض صفحه", value: "#f8f3ea", vars: ["--foreground"] },
  zinc("50", TEXT, "متن داخل فیلدها", "#fafafa"),
  zinc("100", TEXT, "متن اصلی و عنوان‌ها", "#f4f4f5"),
  zinc("200", TEXT, "متن روشن", "#e4e4e7"),
  zinc("300", TEXT, "متن ثانویه", "#d4d4d8"),
  zinc("400", TEXT, "متن کم‌رنگ / متن راهنما", "#9f9fa9"),
  zinc("500", TEXT, "متن توضیحات", "#71717b"),
  zinc("600", TEXT, "متن غیرفعال", "#52525c"),
  zinc("700", SURFACE, "حاشیه کادرها", "#3f3f46"),
  zinc("800", SURFACE, "پس‌زمینه و حاشیه کارت‌ها", "#27272a"),
  zinc("900", SURFACE, "پس‌زمینه کادرها و فیلدها", "#18181b"),
  zinc("950", SURFACE, "پس‌زمینه تیره", "#09090b"),
  { key: "emerald-400", group: STATUS, label: "موفق / تایید (متن)", value: "#00d492", vars: ["--color-emerald-400"] },
  { key: "emerald-500", group: STATUS, label: "موفق / تایید (پس‌زمینه)", value: "#00bc7d", vars: ["--color-emerald-500"] },
  { key: "kit-surface", group: KIT, label: "پس‌زمینه پنجره‌ها و فیلدهای فرم", value: "#344851", vars: ["--dgsuikit-color-white"] },
  { key: "gray-50", group: KIT, label: "پس‌زمینه تیره فرم‌ها", value: "#182228", vars: ["rgb:--dgs-color-gray-50"] },
  { key: "gray-100", group: KIT, label: "پس‌زمینه فیلدها", value: "#253138", vars: ["rgb:--dgs-color-gray-100"] },
  { key: "gray-200", group: KIT, label: "حاشیه فیلدها", value: "#36454e", vars: ["rgb:--dgs-color-gray-200"] },
  { key: "gray-500", group: KIT, label: "متن راهنمای فرم‌ها", value: "#91a0aa", vars: ["rgb:--dgs-color-gray-500"] },
  { key: "gray-700", group: KIT, label: "متن فرم‌ها", value: "#dce2e6", vars: ["rgb:--dgs-color-gray-700"] },
];

const HEX = /^#[0-9a-f]{6}$/i;

const rgbTriple = (hex: string) =>
  [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)).join(" ");

/** `:root` rule for the set colors. Non-hex values are dropped — the result goes into a `<style>` tag. */
export function themeColorsCss(colors?: Record<string, string> | null): string {
  if (!colors) return "";
  const decls = THEME_COLORS.flatMap(({ key, vars }) => {
    const hex = colors[key];
    if (typeof hex !== "string" || !HEX.test(hex)) return [];
    return vars.map((v) => (v.startsWith("rgb:") ? `${v.slice(4)}:${rgbTriple(hex)}` : `${v}:${hex}`));
  });
  return decls.length ? `:root{${decls.join(";")}}` : "";
}
