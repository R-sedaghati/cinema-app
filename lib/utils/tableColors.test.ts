import { test } from "node:test";
import assert from "node:assert/strict";
import { tableColorsCss } from "./tableColors.ts";

test("only hex colors become CSS", () => {
  assert.equal(tableColorsCss(null), "");
  assert.equal(
    tableColorsCss({ headerBg: "#112233", rowBg: "red}body{display:none" }),
    ":root table thead th{background-color:#112233}",
  );
});
