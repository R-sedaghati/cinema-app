import assert from "node:assert/strict";
import test from "node:test";
import { findUnknownVariables, renderSmsTemplate } from "./smsTemplate.ts";

test("no placeholders means nothing unknown", () => {
  assert.deepEqual(findUnknownVariables("فرم شما ثبت شد", ["firstName"]), []);
});

test("flags only the placeholders the event does not offer", () => {
  assert.deepEqual(
    findUnknownVariables("{firstName} عزیز، {foo} و {bar}", ["firstName"]),
    ["foo", "bar"],
  );
});

test("reports a repeated unknown placeholder once", () => {
  assert.deepEqual(findUnknownVariables("{foo} {foo}", []), ["foo"]);
});

test("substitutes known placeholders and leaves unknown ones visible", () => {
  assert.equal(
    renderSmsTemplate("{firstName} عزیز، {foo}", { firstName: "علی" }),
    "علی عزیز، {foo}",
  );
});
