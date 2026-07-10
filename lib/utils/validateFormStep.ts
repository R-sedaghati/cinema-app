import { IFormStep } from "@/lib/services/admin/type";

export function getStepErrors(
  step: IFormStep,
  answers: Record<string, unknown>,
): string[] {
  const errors: string[] = [];

  for (const field of step.fields) {
    const value = answers[field.key];
    const isEmpty =
      value === undefined ||
      value === null ||
      value === "" ||
      (Array.isArray(value) && value.length === 0);

    if (field.required && isEmpty) {
      errors.push(`${field.label} الزامی است`);
      continue;
    }

    if (isEmpty || !field.validation) continue;

    const { min, max, minLength, maxLength, pattern } = field.validation;

    if (typeof value === "number") {
      if (min !== undefined && value < min) errors.push(`${field.label} باید حداقل ${min} باشد`);
      if (max !== undefined && value > max) errors.push(`${field.label} باید حداکثر ${max} باشد`);
    }

    if (typeof value === "string") {
      if (minLength !== undefined && value.length < minLength) errors.push(`${field.label} باید حداقل ${minLength} کاراکتر باشد`);
      if (maxLength !== undefined && value.length > maxLength) errors.push(`${field.label} باید حداکثر ${maxLength} کاراکتر باشد`);
      if (pattern) {
        try {
          if (!new RegExp(pattern).test(value)) errors.push(`${field.label} نامعتبر است`);
        } catch {
          // ponytail: admin-authored regex, ignore invalid patterns rather than crash the form
        }
      }
    }
  }

  return errors;
}
