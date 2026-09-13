import { test } from "node:test";
import assert from "node:assert/strict";
import type { ICategoryItem } from "../services/admin/type.ts";
import { buildCategoryGroups, flattenCategoryGroups } from "./categoryTree.ts";

const cat = (id: number, faName: string, parent: number | null, isActive = true) =>
  ({ id, faName, enName: "", description: null, parent, isActive }) as ICategoryItem;

const items = [
  cat(1, "بازیگر", null),
  cat(2, "کارگردان", null, false),
  cat(3, "کودک", 1),
  cat(4, "بزرگسال", 1, false),
  cat(5, "یتیم", 99),
];

test("groups children under parents and surfaces orphans", () => {
  const groups = buildCategoryGroups(items, {});
  assert.deepEqual(
    groups.map((g) => [g.parent.id, g.children.map((c) => c.id), g.childCount]),
    [
      [1, [3, 4], 2],
      [2, [], 0],
      [5, [], 0],
    ],
  );
});

test("child match pulls in its parent", () => {
  const groups = buildCategoryGroups(items, { query: "کودک" });
  assert.deepEqual(
    groups.map((g) => [g.parent.id, g.children.map((c) => c.id)]),
    [[1, [3]]],
  );
});

test("isActive filter applies to parents and children", () => {
  const groups = buildCategoryGroups(items, { isActive: false });
  assert.deepEqual(
    groups.map((g) => [g.parent.id, g.children.map((c) => c.id)]),
    [
      [1, [4]],
      [2, []],
    ],
  );
});

test("collapsed groups hide children", () => {
  const groups = buildCategoryGroups(items, {});
  assert.deepEqual(
    flattenCategoryGroups(groups, () => false).map((r) => r.id),
    [1, 2, 5],
  );
  assert.deepEqual(
    flattenCategoryGroups(groups, (id) => id === 1).map((r) => [r.id, r.depth]),
    [
      [1, 0],
      [3, 1],
      [4, 1],
      [2, 0],
      [5, 0],
    ],
  );
});
