"use client";

import {
  CONTACT_BUILTIN_LABELS,
  CONTACT_FIELD_TYPES,
  CONTACT_FORM_DEFAULT,
  contactFormOf,
  isBuiltinContactKey,
} from "@/lib/constants/contactForm";
import { EFormFieldType } from "@/lib/services/admin/type";
import type {
  IContactFormField,
  ISiteContentContactForm,
} from "@/lib/services/admin/type";
import { FIELD_VALIDATION_PRESETS } from "@/lib/utils/fieldValidationPresets";
import type { FieldValidationPreset } from "@/lib/utils/fieldValidationPresets";
import { Button, Card, Checkbox, Divider, Input, Select } from "@dgshahr/ui-kit";
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
}

export default function ContactFormCard({ ready, stored, isPending, onSave }: Props) {
  const [form, setForm] = useState<ISiteContentContactForm | null>(null);

  useEffect(() => {
    if (ready && !form) setForm(contactFormOf(stored));
  }, [ready, stored, form]);

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
        <p className="font-h3-bold text-error-500">فرم تماس با پشتیبانی</p>

        <Divider color="gray" size="thin" type="horizontal" />

        <div className="grid md:grid-cols-2 gap-2">
          <Input
            labelContent="عنوان فرم"
            placeholder={CONTACT_FORM_DEFAULT.title}
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <Input
            labelContent="متن دکمه ارسال"
            placeholder={CONTACT_FORM_DEFAULT.submitLabel}
            value={form.submitLabel}
            onChange={(e) => setForm({ ...form, submitLabel: e.target.value })}
          />
        </div>

        <p className="text-xs text-gray-500">
          فیلدهای پایه (نام، ایمیل، موضوع و…) در ستون‌های مخصوص خودشان در پنل ذخیره
          می‌شوند. پاسخ فیلدهایی که خودتان اضافه می‌کنید، در انتهای متن پیام همان
          درخواست نوشته می‌شود.
        </p>

        {form.fields.map((field, index) => (
          <div key={field.key} className="flex flex-col gap-2 border border-gray-200 rounded-lg p-3">
            <div className="flex items-center justify-between gap-2">
              <p className="font-p2-medium">
                {isBuiltinContactKey(field.key)
                  ? CONTACT_BUILTIN_LABELS[field.key]
                  : `فیلد افزوده‌شده (${field.key})`}
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
              {isBuiltinContactKey(field.key) ? null : (
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
                    validation: value
                      ? { ...field.validation, preset: value as FieldValidationPreset }
                      : null,
                  })
                }
                options={PRESET_OPTIONS}
              />
            </div>

            {HAS_OPTIONS.has(field.type) && !isBuiltinContactKey(field.key) && (
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
          </div>
        ))}

        <div className="flex justify-between gap-3">
          <Button variant="outline" onClick={addField}>
            افزودن فیلد
          </Button>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setForm(contactFormOf(null))}
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
