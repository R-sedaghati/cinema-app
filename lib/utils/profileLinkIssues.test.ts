import { test } from "node:test";
import assert from "node:assert/strict";
import { EFormFieldType } from "../services/admin/type.ts";
import { profileLinkIssues } from "./profileLinkIssues.ts";

const profileFields = [
  { key: "firstName", label: "نام", type: EFormFieldType.TEXT },
  { key: "avatar", label: "تصویر", type: EFormFieldType.IMAGE },
  { key: "city", label: "شهر", type: EFormFieldType.SELECT_CITY },
];

const field = (id: number, key: string, extra: Record<string, unknown> = {}) => ({
  id,
  key,
  label: key,
  type: EFormFieldType.TEXT,
  multiple: false,
  syncToUserField: null as string | null,
  ...extra,
});

const levels = (f: ReturnType<typeof field>, all = [f], pf: typeof profileFields | null = profileFields) =>
  profileLinkIssues(f, all, pf).map((i) => i.level);

test("healthy link has no issues", () => {
  assert.deepEqual(levels(field(1, "fn", { syncToUserField: "firstName" })), []);
});

test("unknown target is an error, but not while profile fields load", () => {
  const f = field(1, "x", { syncToUserField: "gone" });
  assert.deepEqual(levels(f), ["error"]);
  assert.deepEqual(levels(f, [f], null), []);
});

test("type mismatch warns", () => {
  assert.deepEqual(levels(field(1, "c", { syncToUserField: "city" })), ["warning"]);
});

test("avatar rules", () => {
  assert.deepEqual(levels(field(1, "a", { syncToUserField: "avatar" })), ["error", "info"]);
  assert.deepEqual(
    levels(field(1, "a", { syncToUserField: "avatar", type: EFormFieldType.IMAGE, multiple: true })),
    ["error", "info"],
  );
  assert.deepEqual(levels(field(1, "a", { syncToUserField: "avatar", type: EFormFieldType.IMAGE })), ["info"]);
  assert.deepEqual(
    levels(field(1, "img", { syncToUserField: "firstName", type: EFormFieldType.IMAGE })),
    ["warning", "error"],
  );
});

test("phone link is informational", () => {
  assert.deepEqual(levels(field(1, "p", { syncToUserField: "phoneNumber" })), ["info"]);
});

test("duplicate links warn", () => {
  const a = field(1, "a", { syncToUserField: "firstName" });
  const b = field(2, "b", { syncToUserField: "firstName" });
  assert.deepEqual(levels(a, [a, b]), ["warning"]);
});

test("unwired fields: key match is info, profile-like label warns, others are silent", () => {
  assert.deepEqual(levels(field(1, "email")), ["info"]);
  assert.deepEqual(levels(field(1, "city")), ["info"]);
  assert.deepEqual(levels(field(1, "q1", { label: "کد ملی" })), ["warning"]);
  assert.deepEqual(levels(field(1, "reason", { label: "دلیل" })), []);
  assert.deepEqual(levels(field(1, "avatar")), []);
});
