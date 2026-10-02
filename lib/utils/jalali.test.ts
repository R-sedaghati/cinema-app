import test from "node:test";
import assert from "node:assert/strict";
import { fromJalali, jalaliMonthLength, toJalali } from "./jalali.ts";

test("known dates convert both ways", () => {
  const d = fromJalali(1403, 1, 1)!;
  assert.deepEqual([d.getFullYear(), d.getMonth() + 1, d.getDate()], [2024, 3, 20]);
  const e = fromJalali(1370, 6, 31)!;
  assert.deepEqual([e.getFullYear(), e.getMonth() + 1, e.getDate()], [1991, 9, 22]);
});

test("every day of 1300–1420 round-trips", () => {
  for (let jy = 1300; jy <= 1420; jy++)
    for (let jm = 1; jm <= 12; jm++)
      for (let jd = 1; jd <= jalaliMonthLength(jy, jm); jd++) {
        const d = fromJalali(jy, jm, jd);
        assert.ok(d, `${jy}/${jm}/${jd}`);
        assert.deepEqual(toJalali(d), { jy, jm, jd });
      }
});

test("Esfand length follows leap years", () => {
  assert.equal(jalaliMonthLength(1403, 12), 30);
  assert.equal(jalaliMonthLength(1404, 12), 29);
  assert.equal(fromJalali(1404, 12, 30), null);
});
