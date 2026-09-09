import test from "node:test";
import assert from "node:assert/strict";
import {
  onScreen,
  orderedRegistrationSections,
  resolveRegistrationSections,
} from "./resolveRegistrationSections.ts";
import {
  DEFAULT_REGISTRATION_SECTIONS,
  REGISTRATION_SECTIONS,
} from "../constants/registrationSections.ts";

test("an empty config renders the shipped page unchanged", () => {
  const resolved = resolveRegistrationSections([]);
  assert.deepEqual(
    resolved.map((s) => s.key),
    DEFAULT_REGISTRATION_SECTIONS,
  );
  // Every default variant must be the catalog's first, or an untouched install
  // would silently render a different layout than it shipped with.
  for (const section of resolved) {
    const variants = REGISTRATION_SECTIONS[section.key].variants;
    assert.equal(section.variant, variants[0]?.key ?? "");
  }
});

test("the category grid defaults to the staggered layout", () => {
  const [cards] = resolveRegistrationSections([]).filter(
    (s) => s.key === "categoryCards",
  );
  assert.equal(cards.variant, "staggered");
});

test("stored order and variant win, hidden sections drop out", () => {
  const config = [
    { key: "categoryCards", hidden: false, variant: "grid" },
    { key: "prompt", hidden: true },
  ];

  const selected = onScreen(resolveRegistrationSections(config), "select");
  assert.deepEqual(
    selected.map((s) => s.key),
    ["categoryCards", "backLink"],
  );
  assert.equal(selected[0].variant, "grid");

  // The panel still lists the hidden one so it can be switched back on.
  assert.ok(
    orderedRegistrationSections(config).some(
      (s) => s.key === "prompt" && s.hidden,
    ),
  );
});

test("onScreen splits the two screens and keeps them independent", () => {
  const all = resolveRegistrationSections([]);
  const select = onScreen(all, "select").map((s) => s.key);
  const flow = onScreen(all, "flow").map((s) => s.key);

  assert.deepEqual(select, ["backLink", "prompt", "categoryCards"]);
  assert.deepEqual(flow, ["formTitle", "stepper"]);
  assert.equal(select.length + flow.length, all.length);
});
