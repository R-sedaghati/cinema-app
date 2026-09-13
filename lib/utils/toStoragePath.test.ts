import { test } from "node:test";
import assert from "node:assert/strict";
import { toStoragePath, unstackStorageUrls } from "./toStoragePath.ts";

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

test("unstack keeps one origin, deep in a response", () => {
  const res = {
    result: [{ image: origin.repeat(2) + path, title: "t", n: 1, x: null }],
    link: origin + path,
  };
  assert.deepEqual(unstackStorageUrls(res), {
    result: [{ image: origin + path, title: "t", n: 1, x: null }],
    link: origin + path,
  });
});
