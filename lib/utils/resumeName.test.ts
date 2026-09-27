import test from "node:test";
import assert from "node:assert/strict";
import { toResumeName } from "./resumeName.ts";
import { EArtistRequestStatus } from "../services/admin/type.ts";

test("whole word فرم becomes رزومه", () => {
  assert.equal(toResumeName("فرم بازیگری"), "رزومه بازیگری");
  assert.equal(toResumeName("بازیگری (فرم)"), "بازیگری (رزومه)");
  assert.equal(toResumeName("فرم‌ها"), "رزومه‌ها");
});

test("words containing فرم are untouched", () => {
  for (const s of ["فرمت", "کارفرما", "پیش‌فرض", "بازیگری", ""]) assert.equal(toResumeName(s), s);
  assert.equal(toResumeName(undefined), "");
});

test("only approved requests are resumes", () => {
  assert.equal(toResumeName("فرم بازیگری", EArtistRequestStatus.APPROVED), "رزومه بازیگری");
  for (const s of Object.values(EArtistRequestStatus).filter((s) => s !== EArtistRequestStatus.APPROVED))
    assert.equal(toResumeName("فرم بازیگری", s), "فرم بازیگری");
});
