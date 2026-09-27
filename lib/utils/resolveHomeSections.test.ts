import test from "node:test";
import assert from "node:assert/strict";
import { orderedHomeSections, resolveHomeSections } from "./resolveHomeSections.ts";
import { DEFAULT_HOME_SECTIONS } from "../constants/homeSections.ts";
import { orderedSections, sectionBoxProps, withStoragePaths } from "./resolveSections.ts";

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

test("valid size overrides pass through, junk is dropped", () => {
  const [first] = orderedHomeSections([
    // Stored JSON is untrusted — the casts stand in for whatever the DB holds.
    {
      key: "artistGrid",
      hidden: false,
      maxWidth: 700.4,
      minHeight: -5,
      cardWidth: "abc" as unknown as number,
      cardHeight: 99999,
    },
  ]);
  assert.equal(first.maxWidth, 700);
  assert.equal(first.minHeight, undefined);
  assert.equal(first.cardWidth, undefined);
  assert.equal(first.cardHeight, undefined);

  const [bare] = orderedHomeSections([{ key: "artistGrid", hidden: false }]);
  assert.equal(bare.maxWidth, undefined);
  assert.equal(bare.cardWidth, undefined);
});

test("fixed width/height survive resolving and clamp to the screen", () => {
  const [first] = orderedHomeSections([
    { key: "artistGrid", hidden: false, width: 600, height: 30 },
  ]);
  assert.equal(first.width, 600);
  assert.equal(first.height, undefined);

  const { style } = sectionBoxProps({ width: 600, height: 300 });
  assert.equal(style.width, "min(600px, 100%)");
  assert.equal(style.height, 300);
  assert.equal(style.overflow, "hidden");
});

test("section spacing keeps 0–200 (0 included) and becomes inline padding", () => {
  const [section] = orderedHomeSections([
    { key: "artistGrid", hidden: false, paddingTop: 0, paddingBottom: 201, paddingX: 24 },
  ]);
  assert.equal(section.paddingTop, 0);
  assert.equal(section.paddingBottom, undefined);
  assert.deepEqual(sectionBoxProps(section).style, { paddingTop: 0, paddingInline: 24 });
});

test("section background keeps hex only and lands in the box style", () => {
  const [good, bad] = orderedSections({ a: { variants: [] }, b: { variants: [] } }, [
    { key: "a", hidden: false, background: "#112233" },
    { key: "b", hidden: false, background: "url(x)" },
  ]);
  assert.equal(good.background, "#112233");
  assert.equal(bad.background, undefined);
  assert.deepEqual(sectionBoxProps(good).style, { backgroundColor: "#112233" });
});

test("section background image: quote-free URLs only, overlay layered, path on save", () => {
  const [good, bad] = orderedSections({ a: { variants: [] }, b: { variants: [] } }, [
    { key: "a", hidden: false, backgroundImage: "https://s.ir/banners/x.jpg", backgroundOverlay: 30 },
    { key: "b", hidden: false, backgroundImage: 'x.jpg")', backgroundOverlay: 30 },
  ]);
  assert.equal(bad.backgroundImage, undefined);
  assert.equal(bad.backgroundOverlay, undefined);
  assert.equal(
    sectionBoxProps(good).style.backgroundImage,
    'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url("https://s.ir/banners/x.jpg")',
  );
  assert.equal(withStoragePaths([good])[0].backgroundImage, "banners/x.jpg");
});
