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

test("Persian and Arabic-Indic digits pass every digit preset", () => {
  assert.equal(failsPreset("NATIONAL_CODE", "۱۲۳۴۵۶۷۸۹۱"), false);
  assert.equal(failsPreset("POSTAL_CODE", "۱۲۳۴۵۶۷۸۹۰"), false);
  assert.equal(failsPreset("IBAN", "IR۰۶۰۱۲۰۰۰۰۰۰۰۰۰۰۰۸۵۶۹۰۱۲۳"), false);
  assert.equal(failsPreset("LANDLINE", "۰۲۱۱۲۳۴۵۶۷۸"), false);
  assert.equal(failsPreset("MOBILE", "٠٩١٢١٢٣٤٥٦٧"), false);
});

test("a Persian-digit value that is genuinely invalid still fails", () => {
  assert.equal(failsPreset("MOBILE", "۰۸۱۲۱۲۳۴۵۶۷"), true);
  assert.equal(failsPreset("NATIONAL_CODE", "۱۲۳۴۵۶۷۸۹۰"), true);
});

test("a national code keeps its leading zeros", () => {
  assert.equal(failsPreset("NATIONAL_CODE", "0012345679"), false);
  assert.equal(failsPreset("NATIONAL_CODE", "۰۰۱۲۳۴۵۶۷۹"), false);
  // the old NUMBER coercion produced this — 10-digit test must reject it
  assert.equal(failsPreset("NATIONAL_CODE", 12345679), true);
});
