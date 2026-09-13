import { test } from "node:test";
import assert from "node:assert/strict";
import { toStoragePath } from "./toStoragePath.ts";

const path = "banners/9e95dadb-e688-4604-8aa0-2174eb0a1250.jpg";
const origin = "https://storage.archivehonar.ir/";

test("keeps a bare path", () => {
  assert.equal(toStoragePath(path), path);
});

test("strips a single origin", () => {
  assert.equal(toStoragePath(origin + path), path);
});

test("strips stacked origins", () => {
  assert.equal(toStoragePath(origin.repeat(4) + path), path);
});

test("empty stays empty", () => {
  assert.equal(toStoragePath(""), "");
});
