import { EFormFieldType } from "../services/admin/type.ts";
import type { IContactFormField, ISiteContentContactForm } from "../services/admin/type.ts";

/**
 * Form a viewer fills to request an artist's resume. Answers are stored whole on the
 * request, so every field is custom. Mirrors the backend's
 * `services/resumeRequest.ts` defaults — the server validates against those while the
 * admin has not customised the form, so keep the keys in sync.
 */
export const RESUME_REQUEST_FORM_DEFAULT: ISiteContentContactForm = {
  title: "درخواست مشاهده رزومه",
  submitLabel: "ثبت درخواست",
  fields: [
    {
      key: "firstName",
      label: "نام",
      type: EFormFieldType.TEXT,
      placeholder: "نام خود را وارد کنید.",
      required: true,
    },
    {
      key: "lastName",
      label: "نام خانوادگی",
      type: EFormFieldType.TEXT,
      placeholder: "نام خانوادگی خود را وارد کنید.",
      required: true,
    },
    {
      key: "organization",
      label: "نام سازمان / شرکت",
      type: EFormFieldType.TEXT,
      placeholder: "در صورت وجود وارد کنید.",
      required: false,
    },
    {
      key: "reason",
      label: "دلیل درخواست",
      type: EFormFieldType.TEXTAREA,
      placeholder: "برای چه پروژه‌ای به این هنرمند نیاز دارید؟",
      required: true,
    },
  ],
};

export const resumeRequestFormOf = (
  stored?: ISiteContentContactForm | null,
): ISiteContentContactForm => ({
  title: stored?.title?.trim() || RESUME_REQUEST_FORM_DEFAULT.title,
  submitLabel: stored?.submitLabel?.trim() || RESUME_REQUEST_FORM_DEFAULT.submitLabel,
  fields: stored?.fields?.length ? stored.fields : RESUME_REQUEST_FORM_DEFAULT.fields,
  guestMode: Boolean(stored?.guestMode),
});

/** Guests are reached only by SMS, so the phone is always asked. Mirrors backend `GUEST_PHONE_FIELD`. */
export const GUEST_PHONE_FIELD: IContactFormField = {
  key: "phoneNumber",
  label: "شماره موبایل",
  type: EFormFieldType.TEXT,
  placeholder: "۰۹۱۲۱۲۳۴۵۶۷",
  required: true,
  validation: { preset: "MOBILE" },
  persist: true,
};

/** The admin's form plus the phone field, forced required and mobile-checked. */
export const guestRequestFields = (form: ISiteContentContactForm): IContactFormField[] => {
  const hasPhone = form.fields.some((f) => f.key === GUEST_PHONE_FIELD.key);

  return hasPhone
    ? form.fields.map((f) =>
        f.key === GUEST_PHONE_FIELD.key
          ? { ...f, required: true, validation: { ...f.validation, preset: "MOBILE" } }
          : f,
      )
    : [...form.fields, GUEST_PHONE_FIELD];
};

/*
 * Guest browser storage. Every access is wrapped: private windows and blocked storage
 * throw, and the form must still work without it.
 */
const SAVED_ANSWERS_KEY = "resume-request-answers";
const ACCESS_TOKENS_KEY = "resume-request-tokens";

const read = <T>(key: string, fallback: T): T => {
  try {
    const raw = globalThis.localStorage?.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

const write = (key: string, value: unknown) => {
  try {
    globalThis.localStorage?.setItem(key, JSON.stringify(value));
  } catch {
    // storage unavailable: the guest simply retypes next time
  }
};

/** Answers the guest gave to fields the admin marked "persist". */
export const loadSavedAnswers = (): Record<string, unknown> =>
  read<Record<string, unknown>>(SAVED_ANSWERS_KEY, {});

/** Keeps only the persisted fields; everything else stays out of the browser. */
export const saveAnswers = (fields: IContactFormField[], answers: Record<string, unknown>) => {
  const kept = Object.fromEntries(
    fields.filter((f) => f.persist && answers[f.key] !== undefined).map((f) => [f.key, answers[f.key]]),
  );
  write(SAVED_ANSWERS_KEY, { ...loadSavedAnswers(), ...kept });
};

/** Secret tokens of this browser's guest requests — the only proof of access a guest has. */
export const loadAccessTokens = (): string[] => read<string[]>(ACCESS_TOKENS_KEY, []);

export const saveAccessToken = (token: string) =>
  write(ACCESS_TOKENS_KEY, [...new Set([...loadAccessTokens(), token])].slice(-50));
