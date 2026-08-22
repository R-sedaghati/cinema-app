import assert from "node:assert/strict";
import test from "node:test";
import { makeCopy } from "./formCopy.ts";

test("falls back to the default when there is no override", () => {
  assert.equal(makeCopy()("nextLabel"), "مرحله بعد");
  assert.equal(makeCopy({})("nextLabel"), "مرحله بعد");
});

test("a blank override falls back to the default", () => {
  assert.equal(makeCopy({ nextLabel: "   " })("nextLabel"), "مرحله بعد");
  assert.equal(makeCopy({ nextLabel: null })("nextLabel"), "مرحله بعد");
});

test("an override wins", () => {
  assert.equal(makeCopy({ nextLabel: "ادامه" })("nextLabel"), "ادامه");
});

test("substitutes {vars} in both defaults and overrides", () => {
  assert.equal(makeCopy()("stepCounter", { n: 2, total: 4 }), "مرحله 2 از 4");
  assert.equal(
    makeCopy({ stepCounter: "گام {n}/{total}" })("stepCounter", { n: 2, total: 4 }),
    "گام 2/4",
  );
});

test("leaves unknown placeholders untouched", () => {
  assert.equal(makeCopy({ formTitle: "{category} - {missing}" })("formTitle", { category: "تئاتر" }), "تئاتر - {missing}");
});
