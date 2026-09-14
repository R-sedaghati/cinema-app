import test from "node:test";
import assert from "node:assert/strict";
import { parseAnswers, parseIds } from "./formUrlState.ts";

test("round-trips answers and rejects junk", () => {
  const answers = { name: "علی", tags: ["a", "b"], ok: true, n: 3 };
  assert.deepEqual(parseAnswers(JSON.stringify(answers)), answers);

  assert.deepEqual(parseAnswers(null), {});
  assert.deepEqual(parseAnswers("{not json"), {});
  assert.deepEqual(parseAnswers("[1,2]"), {});
  assert.deepEqual(parseAnswers("null"), {});
  assert.deepEqual(parseAnswers('"str"'), {});
});

test("parses ids and drops junk", () => {
  assert.deepEqual(parseIds("3,7"), [3, 7]);
  assert.deepEqual(parseIds("3,x,-1,0,2.5,"), [3]);
  assert.deepEqual(parseIds(null), []);
});
