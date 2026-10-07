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

test("a picked form or profile field is never reported as unknown, and renders from its own name", () => {
  assert.deepEqual(findUnknownVariables("{firstName} {form.city} {profile.email} {nope}", ["firstName"]), ["nope"]);
  assert.equal(
    renderSmsTemplate("{form.city} / {profile.email}", { "form.city": "تهران", "profile.email": "a@b.ir" }),
    "تهران / a@b.ir",
  );
});

test("fields of every record a stage is about count as picked, not unknown", () => {
  const names = ["user.code", "request.trackingCode", "ticket.subject", "contact.status", "contactForm.company", "payment.amount", "artist.code"];
  assert.deepEqual(findUnknownVariables(names.map((n) => `{${n}}`).join(" "), []), []);
  assert.deepEqual(findUnknownVariables("{foo.bar} {userx.code}", []), ["foo.bar", "userx.code"]);
});
