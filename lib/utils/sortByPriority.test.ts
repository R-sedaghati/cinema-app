import test from "node:test";
import assert from "node:assert/strict";
import { sortByPriority } from "./sortByPriority.ts";

test("sorts ascending and treats a missing priority as 0", () => {
  const sorted = sortByPriority([
    { id: "b", priority: 2 },
    { id: "a", priority: null },
    { id: "c", priority: 5 },
  ]);

  assert.deepEqual(
    sorted.map((it) => it.id),
    ["a", "b", "c"],
  );
});

test("reads a Persian-digit priority rather than sorting on NaN", () => {
  const sorted = sortByPriority([
    { id: "third", priority: "۳" },
    { id: "first", priority: "۱" },
    { id: "second", priority: 2 },
  ] as unknown as { id: string; priority?: number | null }[]);

  assert.deepEqual(
    sorted.map((it) => it.id),
    ["first", "second", "third"],
  );
});

test("does not mutate the input array", () => {
  const input = [{ priority: 2 }, { priority: 1 }];
  sortByPriority(input);
  assert.deepEqual(input, [{ priority: 2 }, { priority: 1 }]);
});
