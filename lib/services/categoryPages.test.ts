import test from "node:test";
import assert from "node:assert/strict";
import { fetchAllCategoryPages } from "./categoryPages.ts";

const pages = [
  [
    { id: 1, children: [{ id: 11 }] },
    { id: 2, children: [{ id: 21 }] },
  ],
  [
    { id: 2, children: [{ id: 22 }] },
    { id: 3, children: [] },
  ],
  [],
];

test("reads every page and merges a category split across two of them", async () => {
  const got = await fetchAllCategoryPages(async (page) => pages[page - 1] ?? []);

  assert.deepEqual(got, [
    { id: 1, children: [{ id: 11 }] },
    { id: 2, children: [{ id: 21 }, { id: 22 }] },
    { id: 3, children: [] },
  ]);
});

test("stops instead of looping when the server ignores `page`", async () => {
  let calls = 0;
  const got = await fetchAllCategoryPages(async () => {
    calls++;
    return [{ id: 1, children: [] }];
  });

  assert.equal(calls, 2);
  assert.deepEqual(got, [{ id: 1, children: [] }]);
});
