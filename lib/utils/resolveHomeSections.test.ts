import test from "node:test";
import assert from "node:assert/strict";
import { orderedHomeSections, resolveHomeSections } from "./resolveHomeSections.ts";
import { DEFAULT_HOME_SECTIONS } from "../constants/homeSections.ts";

const keysOf = (config?: Parameters<typeof resolveHomeSections>[0]) =>
  resolveHomeSections(config).map((s) => s.key);

test("empty config falls back to the shipped order", () => {
  assert.deepEqual(keysOf([]), DEFAULT_HOME_SECTIONS);
  assert.deepEqual(keysOf(undefined), DEFAULT_HOME_SECTIONS);
});

test("stored order wins and missing keys append in catalog order", () => {
  const resolved = keysOf([
    { key: "ctaCards", hidden: false },
    { key: "searchHeader", hidden: false },
  ]);
  assert.deepEqual(resolved.slice(0, 2), ["ctaCards", "searchHeader"]);
  assert.deepEqual(
    resolved.slice(2),
    DEFAULT_HOME_SECTIONS.filter((k) => k !== "ctaCards" && k !== "searchHeader"),
  );
});

test("hidden sections are excluded from the public list but kept for the panel", () => {
  const config = [{ key: "artistGrid", hidden: true }];
  assert.ok(!keysOf(config).includes("artistGrid"));
  assert.deepEqual(orderedHomeSections(config)[0], {
    key: "artistGrid",
    hidden: true,
    variant: "grid",
  });
});

test("unknown keys and duplicates are dropped", () => {
  const resolved = keysOf([
    { key: "nope", hidden: false },
    { key: "ctaCards", hidden: false },
    { key: "ctaCards", hidden: true },
  ]);
  assert.equal(resolved.length, DEFAULT_HOME_SECTIONS.length);
  assert.equal(resolved[0], "ctaCards");
  assert.equal(resolved.filter((k) => k === "ctaCards").length, 1);
});

test("an unknown or missing variant falls back to the catalog default", () => {
  const [first] = orderedHomeSections([{ key: "artistGrid", hidden: false, variant: "gone" }]);
  assert.equal(first.variant, "grid");

  const [stored] = orderedHomeSections([
    { key: "artistGrid", hidden: false, variant: "castlist" },
  ]);
  assert.equal(stored.variant, "castlist");
});
