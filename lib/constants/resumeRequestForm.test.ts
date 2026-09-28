import { test } from "node:test";
import assert from "node:assert/strict";
import { guestRequestFields, loadSavedAnswers, saveAnswers, resumeRequestFormOf } from "./resumeRequestForm.ts";

const form = (fields: Parameters<typeof guestRequestFields>[0]["fields"]) => ({ title: "", submitLabel: "", fields });

test("guest fields add the phone field when the form lacks it", () => {
  const fields = guestRequestFields(form([{ key: "a", label: "a", type: "TEXT" as never, required: false }]));
  assert.equal(fields[fields.length - 1].key, "phoneNumber");
});

test("guest fields force the admin's phone field required and mobile", () => {
  const [phone] = guestRequestFields(form([{ key: "phoneNumber", label: "t", type: "TEXT" as never, required: false }]));
  assert.equal(phone.required, true);
  assert.equal(phone.validation?.preset, "MOBILE");
});

test("guest mode defaults off", () => {
  assert.equal(resumeRequestFormOf(null).guestMode, false);
});

test("only persisted fields are saved, and storage failures are swallowed", () => {
  const store = new Map<string, string>();
  (globalThis as { localStorage?: unknown }).localStorage = {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => void store.set(k, v),
  };
  saveAnswers(
    [
      { key: "name", label: "n", type: "TEXT" as never, required: true, persist: true },
      { key: "reason", label: "r", type: "TEXT" as never, required: true },
    ],
    { name: "علی", reason: "secret" },
  );
  assert.deepEqual(loadSavedAnswers(), { name: "علی" });

  (globalThis as { localStorage?: unknown }).localStorage = {
    getItem: () => {
      throw new Error("blocked");
    },
    setItem: () => {
      throw new Error("blocked");
    },
  };
  assert.deepEqual(loadSavedAnswers(), {});
  saveAnswers([], {});
});
