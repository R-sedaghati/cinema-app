/**
 * Named validations an admin can attach to a form field instead of hand-writing a regex.
 * The same table exists in `backend/utils/fieldValidation.ts` — keep the ids in sync.
 */

export type FieldValidationPreset =
  | "MOBILE"
  | "LANDLINE"
  | "NATIONAL_CODE"
  | "POSTAL_CODE"
  | "EMAIL"
  | "IBAN"
  | "URL";

export const toEnglishDigits = (value: string) =>
  value
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0))
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660));

/** Iranian national code: 10 digits, last one a mod-11 checksum. */
const isValidNationalCode = (value: string) => {
  if (!/^\d{10}$/.test(value) || /^(\d)\1{9}$/.test(value)) return false;

  const digits = value.split("").map(Number);
  const sum = digits.slice(0, 9).reduce((acc, d, i) => acc + d * (10 - i), 0);
  const remainder = sum % 11;
  const check = digits[9];

  return remainder < 2 ? check === remainder : check === 11 - remainder;
};

interface PresetDefinition {
  label: string;
  message: string;
  test: (value: string) => boolean;
}

export const FIELD_VALIDATION_PRESETS: Record<FieldValidationPreset, PresetDefinition> = {
  MOBILE: {
    label: "شماره موبایل",
    message: "شماره موبایل معتبر نیست",
    test: (v) => /^09\d{9}$/.test(v),
  },
  LANDLINE: {
    label: "تلفن ثابت",
    message: "تلفن ثابت معتبر نیست",
    test: (v) => /^0\d{2,3}\d{8}$/.test(v),
  },
  NATIONAL_CODE: {
    label: "کد ملی",
    message: "کد ملی معتبر نیست",
    test: isValidNationalCode,
  },
  POSTAL_CODE: {
    label: "کد پستی",
    message: "کد پستی معتبر نیست",
    test: (v) => /^\d{10}$/.test(v),
  },
  EMAIL: {
    label: "ایمیل",
    message: "ایمیل معتبر نیست",
    test: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
  },
  IBAN: {
    label: "شماره شبا",
    message: "شماره شبا معتبر نیست",
    test: (v) => /^IR\d{24}$/.test(v.replace(/\s/g, "").toUpperCase()),
  },
  URL: {
    label: "آدرس اینترنتی",
    message: "آدرس اینترنتی معتبر نیست",
    test: (v) => /^https?:\/\/\S+\.\S+$/.test(v),
  },
};

export const isValidPreset = (preset: FieldValidationPreset, value: string) =>
  FIELD_VALIDATION_PRESETS[preset].test(toEnglishDigits(value).trim());
