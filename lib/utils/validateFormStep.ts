import { EFormFieldType, IFormStep } from "@/lib/services/admin/type";
import { FIELD_VALIDATION_PRESETS, isValidPreset } from "./fieldValidationPresets";
import { CopyFn, defaultCopy } from "./formCopy";

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

    if (typeof value === "number") {
      if (min !== undefined && value < min) errors.push(copy("minMessage", { label: field.label, min }));
      if (max !== undefined && value > max) errors.push(copy("maxMessage", { label: field.label, max }));
    }

    if (typeof value === "string") {
      if (preset && FIELD_VALIDATION_PRESETS[preset] && !isValidPreset(preset, value)) {
        errors.push(`${field.label}: ${FIELD_VALIDATION_PRESETS[preset].message}`);
      }
      if (minLength !== undefined && value.length < minLength) errors.push(copy("minLengthMessage", { label: field.label, n: minLength }));
      if (maxLength !== undefined && value.length > maxLength) errors.push(copy("maxLengthMessage", { label: field.label, n: maxLength }));
      if (pattern) {
        try {
          if (!new RegExp(pattern).test(value)) errors.push(copy("invalidMessage", { label: field.label }));
        } catch {
          // ponytail: admin-authored regex, ignore invalid patterns rather than crash the form
        }
      }
    }
  }

  return errors;
}
