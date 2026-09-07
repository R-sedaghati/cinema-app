import test from "node:test";
import assert from "node:assert/strict";
import { toEnglishDigits, toPriority } from "./toEnglishDigits.ts";

test("Persian digits become ASCII", () => {
  assert.equal(toEnglishDigits("۰۹۱۲۳۴۵۶۷۸۹"), "09123456789");
});

test("Arabic-Indic digits become ASCII", () => {
  assert.equal(toEnglishDigits("٠١٢٣٤٥٦٧٨٩"), "0123456789");
});

test("mixed and already-ASCII input is left consistent", () => {
  assert.equal(toEnglishDigits("۰۹12۳۴"), "091234");
  assert.equal(toEnglishDigits("09123456789"), "09123456789");
});

test("digits inside Persian prose are converted, the prose is not", () => {
  assert.equal(toEnglishDigits("متولد ۱۳۵۰"), "متولد 1350");
});

test("empty and nullish input read as an empty string", () => {
  assert.equal(toEnglishDigits(""), "");
  assert.equal(toEnglishDigits(undefined), "");
  assert.equal(toEnglishDigits(null), "");
});

test("toPriority parses Persian digits and defaults to 0", () => {
  assert.equal(toPriority("۱۲"), 12);
  assert.equal(toPriority(""), 0);
  assert.equal(toPriority("abc"), 0);
});
