import test from "node:test";
import assert from "node:assert/strict";
import { failsPreset } from "./fieldValidationPresets.ts";

test("a preset runs on a NUMBER answer, which is stored as a number", () => {
  assert.equal(failsPreset("NATIONAL_CODE", 1234567891), false);
  assert.equal(failsPreset("NATIONAL_CODE", 1234567890), true);
});

test("a preset runs on every value a CHECKBOX answer holds", () => {
  assert.equal(failsPreset("MOBILE", ["09121234567", "09351112233"]), false);
  assert.equal(failsPreset("MOBILE", ["09121234567", "12"]), true);
});

test("a preset still runs on a plain string answer", () => {
  assert.equal(failsPreset("MOBILE", "09121234567"), false);
  assert.equal(failsPreset("MOBILE", "0912"), true);
});

test("Persian digits are normalized before the test", () => {
  assert.equal(failsPreset("MOBILE", "۰۹۱۲۱۲۳۴۵۶۷"), false);
});

test("a shape with no text in it has nothing to fail", () => {
  assert.equal(failsPreset("MOBILE", true), false);
  assert.equal(failsPreset("MOBILE", []), false);
});
