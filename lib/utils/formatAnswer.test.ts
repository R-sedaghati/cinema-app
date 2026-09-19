import test from "node:test";
import assert from "node:assert/strict";
import { EFormFieldType } from "../services/admin/type.ts";
import { formatAnswer } from "./formatAnswer.ts";

const t = { yes: "Y", no: "N", empty: "-", sep: ", " };
const options = [
  { value: "dir", label: "Director" },
  { value: "act", label: "Actor" },
];

test("resolves option values to labels, falling back to the raw value", () => {
  assert.equal(formatAnswer({ type: EFormFieldType.SELECT, options }, "dir", t), "Director");
  assert.equal(
    formatAnswer({ type: EFormFieldType.CHECKBOX, options }, ["act", "gone"], t),
    "Actor, gone",
  );
});

test("formats dates instead of echoing the ISO string", () => {
  const out = formatAnswer({ type: EFormFieldType.DATE, options: null }, "2024-03-20T00:00:00.000Z", t);
  assert.ok(!out.includes("T00"), out);
});

test("booleans, arrays and empty values", () => {
  const text = { type: EFormFieldType.TEXT, options: null };
  assert.equal(formatAnswer(text, true, t), "Y");
  assert.equal(formatAnswer(text, false, t), "N");
  assert.equal(formatAnswer(text, ["a", "b"], t), "a, b");
  assert.equal(formatAnswer(text, 0, t), "0");
  assert.equal(formatAnswer(text, undefined, t), "-");
  assert.equal(formatAnswer(text, "", t), "-");
  assert.equal(formatAnswer(text, [], t), "-");
});
