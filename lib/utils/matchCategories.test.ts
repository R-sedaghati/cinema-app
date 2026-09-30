import test from "node:test";
import assert from "node:assert/strict";
import { matchCategories, type SearchableCategory } from "./matchCategories.ts";

const items: SearchableCategory[] = [
  { id: 1, title: "بازیگری", children: [{ id: 11, title: "بازیگر کودک" }] },
  {
    id: 2,
    title: "گویندگی",
    children: [
      { id: 21, title: "دوبله" },
      { id: 22, title: "گوینده رادیو" },
    ],
  },
];

test("empty query keeps every form", () => {
  assert.equal(matchCategories(items, "  "), items);
});

test("form name hit carries no subcategory hint", () => {
  const [hit] = matchCategories(items, "گویندگی");
  assert.equal(hit.id, 2);
  assert.equal(hit.matchedChildren, undefined);
});

test("subcategory hit returns its parent form with the matched subcategories", () => {
  const result = matchCategories(items, "دوبله");
  assert.deepEqual(result.map((r) => r.id), [2]);
  assert.deepEqual(result[0].matchedChildren, [{ id: 21, title: "دوبله" }]);
});

test("Arabic yeh/kaf and ZWNJ spellings still match", () => {
  assert.deepEqual(matchCategories(items, "كودك").map((r) => r.id), [1]);
  assert.deepEqual(matchCategories(items, "بازيگري").map((r) => r.id), [1]);
  assert.deepEqual(matchCategories(items, "گوین‌ده").map((r) => r.id), [2]);
});

test("no hit returns nothing", () => {
  assert.deepEqual(matchCategories(items, "فیلمبرداری"), []);
});
