import { EFormFieldType, IFormStep } from "@/lib/services/admin/type";
import { FIELD_VALIDATION_PRESETS, failsPreset } from "./fieldValidationPresets.ts";
import { CopyFn, defaultCopy } from "./formCopy.ts";
import { toEnglishDigits } from "./toEnglishDigits.ts";

export function getStepErrors(
  step: IFormStep,
  answers: Record<string, unknown>,
  copy: CopyFn = defaultCopy,
): string[] {
  const errors: string[] = [];

  for (const field of step.fields) {
    const value = answers[field.key];
    const isEmpty =
      (field.type === EFormFieldType.BOOLEAN && value !== true) ||
      value === undefined ||
      value === null ||
      value === "" ||
      (Array.isArray(value) && value.length === 0);

    if (field.required && isEmpty) {
      errors.push(copy("requiredMessage", { label: field.label }));
      continue;
    }

    if (isEmpty || !field.validation) continue;

    const { preset, min, max, minLength, maxLength, pattern } = field.validation;

    // A preset is a string test, so it applies to any field whose answer reads as text —
    // a NUMBER-typed national code and every picked value of a CHECKBOX included.
    if (preset && FIELD_VALIDATION_PRESETS[preset] && failsPreset(preset, value)) {
      errors.push(`${field.label}: ${FIELD_VALIDATION_PRESETS[preset].message}`);
    }

    // A NUMBER field can hold a string (restored draft, API payload), so read the
    // number out of either shape rather than skipping min/max for strings.
    const numeric =
      typeof value === "number"
        ? value
        : typeof value === "string" && toEnglishDigits(value).trim() !== ""
          ? Number(toEnglishDigits(value).trim())
          : NaN;

    if (Number.isFinite(numeric)) {
      if (min !== undefined && numeric < min) errors.push(copy("minMessage", { label: field.label, min }));
      if (max !== undefined && numeric > max) errors.push(copy("maxMessage", { label: field.label, max }));
    }

    if (typeof value === "string") {
      if (minLength !== undefined && value.length < minLength) errors.push(copy("minLengthMessage", { label: field.label, n: minLength }));
      if (maxLength !== undefined && value.length > maxLength) errors.push(copy("maxLengthMessage", { label: field.label, n: maxLength }));
      if (pattern) {
        try {
          if (!new RegExp(pattern).test(toEnglishDigits(value))) errors.push(copy("invalidMessage", { label: field.label }));
        } catch {
          // ponytail: admin-authored regex, ignore invalid patterns rather than crash the form
        }
      }
    }
  }

  return errors;
}
