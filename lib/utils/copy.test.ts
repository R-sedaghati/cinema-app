import assert from "node:assert/strict";
import test from "node:test";
import { makeResolver } from "./copy.ts";
import { LANDING_COPY } from "../constants/landingCopy.ts";
import {
  appendCustomAnswers,
  contactFormOf,
  CONTACT_FORM_DEFAULT,
} from "../constants/contactForm.ts";
import { EFormFieldType } from "../services/admin/type.ts";

test("landing copy falls back to the default and takes an override", () => {
  const fallback = makeResolver(LANDING_COPY, null);
  assert.equal(fallback("reasonsTitle"), "چرا سینما آرشیو؟");
  assert.equal(makeResolver(LANDING_COPY, { reasonsTitle: "  " })("reasonsTitle"), "چرا سینما آرشیو؟");
  assert.equal(makeResolver(LANDING_COPY, { reasonsTitle: "چرا ما؟" })("reasonsTitle"), "چرا ما؟");
});

test("an empty contact form falls back to the default fields", () => {
  assert.deepEqual(contactFormOf(null).fields, CONTACT_FORM_DEFAULT.fields);
  assert.deepEqual(
    contactFormOf({ title: "", submitLabel: "", fields: [] }).fields,
    CONTACT_FORM_DEFAULT.fields,
  );
  assert.equal(contactFormOf({ title: "تماس", submitLabel: "", fields: [] }).title, "تماس");
});

test("custom answers are appended to the message, built-in ones are not", () => {
  const fields = [
    { key: "message", label: "پیام", type: EFormFieldType.TEXTAREA, required: true },
    { key: "custom_1", label: "شهر", type: EFormFieldType.TEXT, required: false },
    { key: "custom_2", label: "علاقه", type: EFormFieldType.CHECKBOX, required: false },
    { key: "custom_3", label: "خالی", type: EFormFieldType.TEXT, required: false },
  ];

  const message = appendCustomAnswers("سلام", fields, {
    message: "سلام",
    custom_1: "تهران",
    custom_2: ["فیلم", "تئاتر"],
    custom_3: "   ",
  });

  assert.equal(message, "سلام\n\nشهر: تهران\nعلاقه: فیلم، تئاتر");
  assert.equal(appendCustomAnswers("سلام", fields, { custom_1: "" }), "سلام");
});
