import { EFormFieldType } from "../services/admin/type.ts";
import type { IContactFormField, ISiteContentContactForm } from "../services/admin/type.ts";

/**
 * Keys the backend stores in its own columns. Every other key is a custom field
 * the admin added; its answer is appended to `message` on submit, because
 * `POST /user/supports/` has no free-form answers column.
 */
export const CONTACT_BUILTIN_KEYS = [
  "firstName",
  "lastName",
  "email",
  "phoneNumber",
  "category",
  "subCategory",
  "subject",
  "message",
] as const;

export type ContactBuiltinKey = (typeof CONTACT_BUILTIN_KEYS)[number];

export const CONTACT_BUILTIN_LABELS: Record<ContactBuiltinKey, string> = {
  firstName: "نام (ستون نام در پنل)",
  lastName: "نام خانوادگی (ستون نام خانوادگی)",
  email: "ایمیل (ستون ایمیل)",
  phoneNumber: "شماره تلفن (ستون تلفن)",
  category: "دسته‌بندی اصلی (لیست دسته‌بندی‌ها)",
  subCategory: "دسته‌بندی فرعی (به دسته‌بندی اصلی وصل است)",
  subject: "موضوع پیام (ستون موضوع)",
  message: "متن پیام (ستون پیام)",
};

export const isBuiltinContactKey = (key: string): key is ContactBuiltinKey =>
  (CONTACT_BUILTIN_KEYS as readonly string[]).includes(key);

/** Shown when the admin has not customised the contact form yet. */
export const CONTACT_FORM_DEFAULT: ISiteContentContactForm = {
  title: "فرم تماس با پشتیبانی",
  submitLabel: "ارسال پیام",
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
      key: "email",
      label: "ایمیل",
      type: EFormFieldType.TEXT,
      placeholder: "ایمیل خود را وارد کنید.",
      required: true,
      validation: { preset: "EMAIL" },
    },
    {
      key: "phoneNumber",
      label: "شماره تلفن",
      type: EFormFieldType.TEXT,
      placeholder: "شماره تلفن خود را وارد کنید.",
      required: true,
      validation: { preset: "MOBILE" },
    },
    {
      key: "category",
      label: "دسته بندی اصلی",
      type: EFormFieldType.SELECT,
      placeholder: "دسته بندی اصلی موضوع پیام را انتخاب کنید",
      required: true,
    },
    {
      key: "subCategory",
      label: "دسته بندی فرعی",
      type: EFormFieldType.SELECT,
      placeholder: "دسته بندی فرعی موضوع پیام را انتخاب کنید",
      required: true,
    },
    {
      key: "subject",
      label: "موضوع پیام",
      type: EFormFieldType.TEXT,
      placeholder: "موضوع پیام خود را وارد کنید.",
      required: true,
    },
    {
      key: "message",
      label: "پیام شما",
      type: EFormFieldType.TEXTAREA,
      placeholder: "پیام تفصیلی خود را بنویسید . . .",
      required: true,
    },
  ],
};

/** Field types an admin may pick for a custom contact-form field. */
export const CONTACT_FIELD_TYPES: { value: EFormFieldType; label: string }[] = [
  { value: EFormFieldType.TEXT, label: "متن کوتاه" },
  { value: EFormFieldType.TEXTAREA, label: "متن بلند" },
  { value: EFormFieldType.NUMBER, label: "عدد" },
  { value: EFormFieldType.SELECT, label: "انتخاب از لیست" },
  { value: EFormFieldType.RADIO, label: "تک‌انتخابی" },
  { value: EFormFieldType.CHECKBOX, label: "چندانتخابی" },
  { value: EFormFieldType.BOOLEAN, label: "بله / خیر" },
  { value: EFormFieldType.DATE, label: "تاریخ" },
];

export const contactFormOf = (
  stored?: ISiteContentContactForm | null,
): ISiteContentContactForm => {
  const fields = stored?.fields?.length ? stored.fields : CONTACT_FORM_DEFAULT.fields;

  return {
    title: stored?.title?.trim() || CONTACT_FORM_DEFAULT.title,
    submitLabel: stored?.submitLabel?.trim() || CONTACT_FORM_DEFAULT.submitLabel,
    fields,
  };
};

/** Keeps a custom field's answer out of the built-in columns and in the message body. */
export const appendCustomAnswers = (
  message: string,
  fields: IContactFormField[],
  answers: Record<string, unknown>,
) => {
  const extras = fields
    .filter((field) => !isBuiltinContactKey(field.key))
    .map((field) => {
      const value = answers[field.key];
      const text = Array.isArray(value) ? value.join("، ") : String(value ?? "");
      return text.trim() ? `${field.label}: ${text}` : "";
    })
    .filter(Boolean);

  return extras.length ? `${message}\n\n${extras.join("\n")}` : message;
};
