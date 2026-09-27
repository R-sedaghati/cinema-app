/** Site-wide table colors, `SiteContent.tableColors`. Absent key = theme default. */
export interface ITableColors {
  headerBg?: string;
  headerText?: string;
  rowBg?: string;
  rowText?: string;
  border?: string;
}

export const TABLE_COLOR_LABELS: Record<keyof ITableColors, string> = {
  headerBg: "پس‌زمینه سرستون",
  headerText: "متن سرستون",
  rowBg: "پس‌زمینه ردیف‌ها",
  rowText: "متن ردیف‌ها",
  border: "رنگ خطوط",
};

const HEX = /^#[0-9a-f]{6}$/i;

/** ui-kit `Table` elements each color targets. `:root` lifts specificity over its single-class utilities. */
const RULES: Record<keyof ITableColors, (c: string) => string> = {
  headerBg: (c) => `:root table thead th{background-color:${c}}`,
  headerText: (c) => `:root table thead th,:root table thead th *{color:${c}}`,
  rowBg: (c) => `:root table tbody td{background-color:${c}}`,
  rowText: (c) => `:root table tbody td{color:${c}}`,
  border: (c) => `:root table th,:root table td{border-color:${c}}`,
};

/** CSS for the set colors. Non-hex values are dropped — the result goes into a `<style>` tag. */
export function tableColorsCss(colors?: ITableColors | null): string {
  if (!colors) return "";
  return (Object.keys(RULES) as (keyof ITableColors)[])
    .filter((key) => typeof colors[key] === "string" && HEX.test(colors[key]))
    .map((key) => RULES[key](colors[key]!))
    .join("");
}
