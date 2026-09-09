import test from "node:test";
import assert from "node:assert/strict";
import { groupPortfolios } from "./portfolioAnswers.ts";

test("groups repeated fieldKeys into an array and keeps single values scalar", () => {
  const { answers } = groupPortfolios([
    { filePath: "a.jpg", fieldKey: "gallery", url: "https://x/a" },
    { filePath: "b.jpg", fieldKey: "gallery", url: "https://x/b" },
    { filePath: "c.mp4", fieldKey: "reel", url: null },
  ]);

  assert.deepEqual(answers, { gallery: ["a.jpg", "b.jpg"], reel: "c.mp4" });
});

test("maps paths to presigned urls and drops rows without a fieldKey", () => {
  const { answers, urlByPath } = groupPortfolios([
    { filePath: "legacy.jpg", fieldKey: null, url: "https://x/legacy" },
  ]);

  assert.deepEqual(answers, {});
  assert.deepEqual(urlByPath, { "legacy.jpg": "https://x/legacy" });
});

test("handles no portfolios", () => {
  assert.deepEqual(groupPortfolios(undefined), { answers: {}, urlByPath: {} });
});

test("orders a multiple field by row id, not by response order", () => {
  const { answers } = groupPortfolios([
    { id: 3, filePath: "c.jpg", fieldKey: "gallery", url: null },
    { id: 1, filePath: "a.jpg", fieldKey: "gallery", url: null },
    { id: 2, filePath: "b.jpg", fieldKey: "gallery", url: null },
  ]);

  assert.deepEqual(answers, { gallery: ["a.jpg", "b.jpg", "c.jpg"] });
});

test("drops rows with an empty filePath", () => {
  const { answers, urlByPath } = groupPortfolios([
    { filePath: "", fieldKey: "gallery", url: "https://x/nothing" },
    { filePath: "a.jpg", fieldKey: "gallery", url: null },
  ]);

  assert.deepEqual(answers, { gallery: "a.jpg" });
  assert.deepEqual(urlByPath, {});
});

test("handles a null portfolios list", () => {
  assert.deepEqual(groupPortfolios(null), { answers: {}, urlByPath: {} });
});
