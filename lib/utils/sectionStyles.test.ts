import { test } from "node:test";
import assert from "node:assert/strict";
import { cleanStyles, sectionCss, type IStyleField } from "./sectionStyles.ts";

const fields: IStyleField[] = [
  { key: "title-size", label: "", group: "", type: "px", responsive: true, css: { "[data-el=title]": "font-size:$" } },
  { key: "title-color", label: "", group: "", type: "color", css: { "[data-el=title]": "color:$" } },
  { key: "align", label: "", group: "", type: "align", css: { "[data-el=search]": "margin-inline:$m" } },
  { key: "cols", label: "", group: "", type: "count", css: { "[data-el=items]": "grid-template-columns:$" } },
];

test("sectionCss emits only set, type-valid values, media-split when responsive", () => {
  const css = sectionCss("[s]", fields, {
    "title-size": "20",
    "title-size-md": "40",
    "title-color": "1234", // not a color → skipped
    align: "end",
    cols: "13", // out of range → skipped
  });
  assert.equal(
    css,
    [
      "@media (max-width: 767.98px){[s] [data-el=title]{font-size:20px}}",
      "@media (min-width: 768px){[s] [data-el=title]{font-size:40px}}",
      "[s] [data-el=search]{margin-inline:auto 0}",
    ].join("\n"),
  );
  assert.equal(sectionCss("[s]", fields, undefined), "");
});

test("cleanStyles drops keys/values that could break out of a rule", () => {
  assert.deepEqual(
    cleanStyles({ "item-bg": "#aabbcc", x: "red}body{", Bad: "#000000", n: 4, ok: "center" }),
    { "item-bg": "#aabbcc", ok: "center" },
  );
  assert.equal(cleanStyles(["#000000"]), undefined);
});

test("style catalogs: keys unique per area/section, every selector scoped", async () => {
  const { SITE_STYLE_AREAS } = await import("../constants/siteStyles.ts");
  const { HOME_SECTIONS } = await import("../constants/homeSections.ts");
  const { SUPPORT_SECTIONS } = await import("../constants/supportSections.ts");
  const catalogs: [string, IStyleField[] | undefined][] = [
    ...Object.entries(SITE_STYLE_AREAS).map(([k, a]) => [k, a.fields] as [string, IStyleField[]]),
    ...Object.entries(HOME_SECTIONS).map(([k, s]) => [k, s.styles] as [string, IStyleField[] | undefined]),
    ...Object.entries(SUPPORT_SECTIONS).map(([k, s]) => [k, s.styles] as [string, IStyleField[] | undefined]),
  ];
  for (const [name, fields = []] of catalogs) {
    const keys = fields.flatMap((f) => (f.responsive ? [f.key, `${f.key}-md`] : [f.key]));
    assert.equal(new Set(keys).size, keys.length, `duplicate style key in ${name}`);
    for (const f of fields) {
      for (const sel of Object.keys(f.css)) assert.ok(!sel.includes(","), `${name}.${f.key}: comma selector escapes scope`);
    }
  }
});
