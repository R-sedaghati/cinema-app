import { test } from "node:test";
import assert from "node:assert/strict";
import { themeColorsCss } from "./themeColors.ts";

test("themeColorsCss maps keys to vars, ui-kit vars as rgb triples", () => {
  assert.equal(
    themeColorsCss({ "zinc-800": "#112233", "gray-50": "#0a0b0c" }),
    ":root{--color-zinc-800:#112233;--dgs-color-gray-50:10 11 12}",
  );
});

test("themeColorsCss drops non-hex and unknown keys", () => {
  assert.equal(themeColorsCss({ "zinc-800": "red;}body{x:y", nope: "#000000" }), "");
  assert.equal(themeColorsCss(null), "");
});
