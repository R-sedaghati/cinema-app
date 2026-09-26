import test from "node:test";
import assert from "node:assert/strict";
import { resolvePageBackground } from "./pageBackground.ts";

const map = {
  default: { color: "#111111" },
  home: { image: "https://s/banners/h.jpg", overlay: 40 },
  artists: { color: "#222222" },
  faq: {},
};

test("root path resolves to the home entry", () => {
  assert.deepEqual(resolvePageBackground(map, "/"), map.home);
});

test("nested paths use their first segment", () => {
  assert.deepEqual(resolvePageBackground(map, "/artists/12"), map.artists);
});

test("pages without an entry, or with an empty one, fall back to default", () => {
  assert.deepEqual(resolvePageBackground(map, "/terms"), map.default);
  assert.deepEqual(resolvePageBackground(map, "/faq"), map.default);
});

test("nothing set means no override", () => {
  assert.equal(resolvePageBackground({}, "/"), null);
  assert.equal(resolvePageBackground(null, "/artists"), null);
});
