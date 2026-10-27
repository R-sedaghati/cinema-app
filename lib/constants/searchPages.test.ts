import { test } from "node:test";
import assert from "node:assert/strict";
import { matchPages } from "./searchPages.ts";

test("matches titles and keywords across ی/ي and ZWNJ", () => {
  assert.deepEqual(matchPages("آموزشها").map((p) => p.href), ["/tutorials"]);
  assert.ok(matchPages("ثبت نام").some((p) => p.href === "/artist-registration"));
  assert.ok(matchPages("دانلود").some((p) => p.href === "/download"));
  assert.ok(matchPages("سوالات").some((p) => p.href === "/faq"));
});

test("short or unmatched queries return nothing", () => {
  assert.deepEqual(matchPages("ا"), []);
  assert.deepEqual(matchPages("zzzz"), []);
});
