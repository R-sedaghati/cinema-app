import assert from "node:assert/strict";
import test from "node:test";
import { landingCopy, setLandingCopy } from "./landingCopy.ts";
import { makeResolver } from "./copy.ts";
import { LANDING_COPY } from "../constants/landingCopy.ts";

test("non-React callers get the defaults before any overrides land", () => {
  assert.equal(landingCopy("errorGeneric"), LANDING_COPY.errorGeneric.value);
});

test("non-React callers follow the admin overrides once published", () => {
  setLandingCopy(makeResolver(LANDING_COPY, { errorGeneric: "خطای سفارشی" }));
  assert.equal(landingCopy("errorGeneric"), "خطای سفارشی");

  setLandingCopy(makeResolver(LANDING_COPY));
  assert.equal(landingCopy("errorGeneric"), LANDING_COPY.errorGeneric.value);
});
