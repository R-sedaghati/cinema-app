import test from "node:test";
import assert from "node:assert/strict";
import { pageLayoutProps, resolvePageLayout } from "./pageLayout.ts";

const map = {
  default: { paddingX: 16, paddingTop: 40 },
  home: { paddingX: 0, maxWidth: 1440 },
};

test("a page merges over default field by field", () => {
  assert.deepEqual(resolvePageLayout(map, "/"), { paddingX: 0, paddingTop: 40, maxWidth: 1440 });
});

test("pages without an entry get default; no map gets nothing", () => {
  assert.deepEqual(resolvePageLayout(map, "/faq"), map.default);
  assert.deepEqual(resolvePageLayout(null, "/faq"), {});
});

test("out-of-range and non-numeric values are dropped", () => {
  const bad = { faq: { paddingX: 201, maxWidth: 100, gap: "8", paddingTop: -1, paddingBottom: 12.4 } };
  assert.deepEqual(resolvePageLayout(bad as never, "/faq"), { paddingBottom: 12 });
});

test("only set fields become vars and gates", () => {
  assert.deepEqual(pageLayoutProps({ paddingX: 0, gapDesktop: 24 }), {
    style: { "--pl-x": "0px", "--pl-gap-d": "24px" },
    "data-pl-x": "",
    "data-pl-gap-d": "",
  });
});
