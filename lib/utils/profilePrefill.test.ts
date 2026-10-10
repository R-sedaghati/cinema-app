import { test } from "node:test";
import assert from "node:assert/strict";
import { profilePrefillValue } from "./profilePrefill.ts";

const profile = {
  firstName: "Ali",
  lastName: "Rezaei",
  email: "",
  nationalCode: null,
  phone_number: "09120000000",
  profileData: { city: "Tehran", skills: [], fullName: "" },
};

test("columns, phone aliases and custom keys", () => {
  assert.equal(profilePrefillValue(profile, "firstName"), "Ali");
  assert.equal(profilePrefillValue(profile, "phoneNumber"), "09120000000");
  assert.equal(profilePrefillValue(profile, "phone"), "09120000000");
  assert.equal(profilePrefillValue(profile, "city"), "Tehran");
});

test("blank values and avatar prefill nothing", () => {
  assert.equal(profilePrefillValue(profile, "email"), null);
  assert.equal(profilePrefillValue(profile, "nationalCode"), null);
  assert.equal(profilePrefillValue(profile, "skills"), null);
  assert.equal(profilePrefillValue(profile, "avatar"), null);
  assert.equal(profilePrefillValue(profile, "unknown"), null);
  assert.equal(profilePrefillValue({}, "firstName"), null);
});

test("full-name keys fall back to first + last name", () => {
  assert.equal(profilePrefillValue(profile, "fullName"), "Ali Rezaei");
  assert.equal(profilePrefillValue(profile, "name"), "Ali Rezaei");
  assert.equal(profilePrefillValue({ lastName: "Rezaei" }, "fullName"), "Rezaei");
  assert.equal(profilePrefillValue({}, "fullName"), null);
  assert.equal(
    profilePrefillValue({ ...profile, profileData: { fullName: "Custom" } }, "fullName"),
    "Custom",
  );
});
