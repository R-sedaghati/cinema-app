import test from "node:test";
import assert from "node:assert/strict";
import {
  ANSWER_KEYS,
  displayAnswer,
  displayGender,
  pickAnswer,
} from "./artistAnswers.ts";

test("pickAnswer prefers the English convention key then Persian aliases", () => {
  assert.equal(pickAnswer({ gender: "MAN", جنسیت: "WOMAN" }, ANSWER_KEYS.gender), "MAN");
  assert.equal(pickAnswer({ جنسیت: "MAN" }, ANSWER_KEYS.gender), "MAN");
  assert.equal(pickAnswer({ شهر: "تهران" }, ANSWER_KEYS.city), "تهران");
  assert.equal(pickAnswer({ "تاریخ تولد": "1971-10-06" }, ANSWER_KEYS.birthDate), "1971-10-06");
  assert.equal(pickAnswer({ Gender: "WOMAN" }, ANSWER_KEYS.gender), "WOMAN");
  assert.equal(pickAnswer({ aboutMe: "x" }, ANSWER_KEYS.gender), undefined);
});

test("displayAnswer unwraps option objects and skips empties", () => {
  assert.equal(displayAnswer({ label: "مرد", value: "MAN" }), "مرد");
  assert.equal(displayAnswer({ name: "تهران" }), "تهران");
  assert.equal(displayAnswer(""), undefined);
  assert.equal(displayAnswer(["a", "b"]), "a، b");
});

test("displayGender maps MAN/WOMAN and Persian labels", () => {
  const labels = { man: "مرد", woman: "زن" };
  assert.equal(displayGender("MAN", labels), "مرد");
  assert.equal(displayGender("woman", labels), "زن");
  assert.equal(displayGender("مرد", labels), "مرد");
  assert.equal(displayGender({ value: "MAN", label: "مرد" }, labels), "مرد");
  assert.equal(displayGender(undefined, labels), undefined);
});
