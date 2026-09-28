"use client";

import {
  CONTACT_BUILTIN_LABELS,
  CONTACT_FIELD_TYPES,
  contactFormOf,
  isBuiltinContactKey,
} from "@/lib/constants/contactForm";
import { EFormFieldType } from "@/lib/services/admin/type";
import type {
  IContactFormField,
  ISiteContentContactForm,
} from "@/lib/services/admin/type";
import { FIELD_VALIDATION_PRESETS, toEnglishDigits } from "@/lib/utils/fieldValidationPresets";
import type { FieldValidationPreset } from "@/lib/utils/fieldValidationPresets";
import { Button, Card, Checkbox, Divider, Select } from "@dgshahr/ui-kit";
import Input from "@/components/common/Input";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const HAS_OPTIONS = new Set([
  EFormFieldType.SELECT,
  EFormFieldType.RADIO,
  EFormFieldType.CHECKBOX,
]);

const PRESET_OPTIONS = [
  { label: "بدون بررسی", value: "" },
  ...(Object.keys(FIELD_VALIDATION_PRESETS) as FieldValidationPreset[]).map((preset) => ({
    label: FIELD_VALIDATION_PRESETS[preset].label,
    value: preset,
  })),
];

interface Props {
  /** The site-content request has resolved — `stored` may still be absent. */
  ready: boolean;
  stored?: ISiteContentContactForm | null;
  isPending: boolean;
  onSave: (value: ISiteContentContactForm) => void;
  /** Defaults are the support contact form; the resume-request form passes its own. */
  title?: string;
  note?: string;
  formOf?: (stored?: ISiteContentContactForm | null) => ISiteContentContactForm;
  /** Label for a key stored in its own column (type locked), or null for a free field. */
  builtinLabel?: (key: string) => string | null;
  /** Resume-request form: shows the no-OTP switch and the per-field "save in browser" box. */
  resumeOptions?: boolean;
}

const contactBuiltinLabel = (key: string) =>
  isBuiltinContactKey(key) ? CONTACT_BUILTIN_LABELS[key] : null;

export default function ContactFormCard({
  ready,
  stored,
  isPending,
  onSave,
  title = "فرم تماس با پشتیبانی",
  note = "فیلدهای پایه (نام، ایمیل، موضوع و…) در ستون‌های مخصوص خودشان در پنل ذخیره می‌شوند. پاسخ فیلدهایی که خودتان اضافه می‌کنید، در انتهای متن پیام همان درخواست نوشته می‌شود.",
  formOf = contactFormOf,
  builtinLabel = contactBuiltinLabel,
  resumeOptions = false,
}: Props) {
  const [form, setForm] = useState<ISiteContentContactForm | null>(null);
  const defaults = formOf(null);

  useEffect(() => {
    if (ready && !form) setForm(formOf(stored));
  }, [ready, stored, form, formOf]);

  if (!form) return null;

  const patchField = (index: number, patch: Partial<IContactFormField>) =>
    setForm({
      ...form,
      fields: form.fields.map((field, i) => (i === index ? { ...field, ...patch } : field)),
    });

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= form.fields.length) return;

    const fields = [...form.fields];
    [fields[index], fields[target]] = [fields[target], fields[index]];
    setForm({ ...form, fields });
  };

  const remove = (index: number) =>
    setForm({ ...form, fields: form.fields.filter((_, i) => i !== index) });

  const addField = () => {
    const key = `custom_${Date.now()}`;
    setForm({
      ...form,
      fields: [
        ...form.fields,
        { key, label: "سوال جدید", type: EFormFieldType.TEXT, required: false },
      ],
    });
  };

  const submit = () => {
    if (form.fields.some((field) => !field.label.trim())) {
      toast.error("عنوان همه فیلدها باید پر باشد.");
      return;
    }

    const keys = form.fields.map((field) => field.key);
    if (new Set(keys).size !== keys.length) {
      toast.error("هر فیلد باید کلید یکتا داشته باشد.");
      return;
    }

    onSave(form);
  };

  return (
    <Card>
      <div className="flex flex-col gap-4">
        <p className="font-h3-bold text-error-500">{title}</p>

        <Divider color="gray" size="thin" type="horizontal" />

        <div className="grid md:grid-cols-2 gap-2">
          <Input
            labelContent="عنوان فرم"
            placeholder={defaults.title}
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <Input
            labelContent="متن دکمه ارسال"
            placeholder={defaults.submitLabel}
            value={form.submitLabel}
            onChange={(e) => setForm({ ...form, submitLabel: e.target.value })}
          />
        </div>

        <p className="text-xs text-gray-500">{note}</p>

        {resumeOptions && (
          <div className="flex flex-col gap-1 border border-warning-300 bg-warning-50 rounded-lg p-3">
            <Checkbox
              label="درخواست بدون ورود (بدون کد تأیید پیامکی)"
              containerClassName="w-full"
              checked={Boolean(form.guestMode)}
              onChange={(e) => setForm({ ...form, guestMode: e.target.checked })}
            />
            <p className="text-xs text-gray-600">
              بازدیدکننده بدون ورود به حساب، فقط با پر کردن همین فرم درخواست می‌دهد. فیلد
              «شماره موبایل» (کلید phoneNumber) در این حالت همیشه الزامی است و اگر در فرم نباشد
              خودکار اضافه می‌شود. شماره تأیید نمی‌شود؛ پیامک تایید به همین شماره می‌رود و
              اطلاعات تماس فقط در همان مرورگری که درخواست داده نمایش داده می‌شود. کاربرانی که
              وارد حساب شده‌اند مثل قبل درخواست می‌دهند.
            </p>
          </div>
        )}

        {form.fields.map((field, index) => (
          <div key={field.key} className="flex flex-col gap-2 border border-gray-200 rounded-lg p-3">
            <div className="flex items-center justify-between gap-2">
              <p className="font-p2-medium">
                {builtinLabel(field.key) ?? `فیلد (${field.key})`}
              </p>

              <div className="flex items-center gap-1">
                <Button
                  variant="text"
                  size="small"
                  disabled={index === 0}
                  onClick={() => move(index, -1)}
                >
                  <ChevronUp size={18} />
                </Button>
                <Button
                  variant="text"
                  size="small"
                  disabled={index === form.fields.length - 1}
                  onClick={() => move(index, 1)}
                >
                  <ChevronDown size={18} />
                </Button>
                <Button variant="text" size="small" color="error" onClick={() => remove(index)}>
                  <Trash2 size={18} />
                </Button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-2">
              <Input
                labelContent="عنوان فیلد"
                value={field.label}
                onChange={(e) => patchField(index, { label: e.target.value })}
              />
              <Input
                labelContent="متن راهنمای داخل کادر"
                value={field.placeholder ?? ""}
                onChange={(e) => patchField(index, { placeholder: e.target.value })}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-2">
              {/* The two category selects and the built-in columns keep their type. */}
              {builtinLabel(field.key) ? null : (
                <Select
                  inputProps={{ labelContent: "نوع فیلد" }}
                  mode="single"
                  value={field.type}
                  onChange={(value) => patchField(index, { type: value as EFormFieldType })}
                  options={CONTACT_FIELD_TYPES.map((item) => ({
                    label: item.label,
                    value: item.value,
                  }))}
                />
              )}

              <Select
                inputProps={{ labelContent: "بررسی مقدار" }}
                mode="single"
                value={field.validation?.preset ?? ""}
                onChange={(value) =>
                  patchField(index, {
                    validation: {
                      ...field.validation,
                      preset: (value as FieldValidationPreset) || undefined,
                    },
                  })
                }
                options={PRESET_OPTIONS}
              />

              {(field.type === EFormFieldType.TEXT || field.type === EFormFieldType.TEXTAREA) && (
                <Input
                  labelContent="حداقل طول"
                  type="text"
                  inputMode="numeric"
                  value={field.validation?.minLength ?? ""}
                  onChange={(e) => {
                    const raw = toEnglishDigits(e.target.value).trim();
                    const n = Number(raw);
                    patchField(index, {
                      validation: {
                        ...field.validation,
                        minLength: raw && Number.isFinite(n) ? n : undefined,
                      },
                    });
                  }}
                />
              )}
            </div>

            {HAS_OPTIONS.has(field.type) && !builtinLabel(field.key) && (
              <Input
                labelContent="گزینه‌ها (برچسب:مقدار، جدا با کاما)"
                value={(field.options ?? []).map((o) => `${o.label}:${o.value}`).join(", ")}
                onChange={(e) =>
                  patchField(index, {
                    options: e.target.value
                      .split(",")
                      .map((part) => part.trim())
                      .filter(Boolean)
                      .map((part) => {
                        const [label, value] = part.split(":");
                        return { label: label?.trim() ?? "", value: (value ?? label)?.trim() ?? "" };
                      }),
                  })
                }
              />
            )}

            <Checkbox
              label="پر کردن این فیلد الزامی است"
              containerClassName="w-full"
              checked={field.required}
              onChange={(e) => patchField(index, { required: e.target.checked })}
            />

            {resumeOptions && (
              <Checkbox
                label="ذخیره پاسخ در مرورگر کاربر برای درخواست بعدی (فقط اطلاعات شخصی، حالت بدون ورود)"
                containerClassName="w-full"
                checked={Boolean(field.persist)}
                onChange={(e) => patchField(index, { persist: e.target.checked })}
              />
            )}
          </div>
        ))}

        <div className="flex justify-between gap-3">
          <Button variant="outline" onClick={addField}>
            افزودن فیلد
          </Button>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setForm(formOf(null))}
            >
              بازگرداندن فرم پیش‌فرض
            </Button>
            <Button color="error" isLoading={isPending} disabled={isPending} onClick={submit}>
              ثبت تغییرات
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
