"use client";

import Input from "@/components/common/Input";
import ColorInput from "@/components/admin/ColorInput";
import type { IStyleField } from "@/lib/utils/sectionStyles";

const ALIGNS = [
  { value: "start", label: "راست" },
  { value: "center", label: "وسط" },
  { value: "end", label: "چپ" },
];

const WEIGHTS = [
  { value: "300", label: "نازک" },
  { value: "400", label: "معمولی" },
  { value: "500", label: "متوسط" },
  { value: "600", label: "نیمه‌ضخیم" },
  { value: "700", label: "ضخیم" },
  { value: "800", label: "خیلی ضخیم" },
  { value: "900", label: "سیاه" },
];

interface Props {
  fields: IStyleField[];
  values?: Record<string, string>;
  onChange: (next: Record<string, string> | undefined) => void;
}

/** A section's per-element style controls, grouped; empty = shipped look. */
export function StyleFields({ fields, values = {}, onChange }: Props) {
  const set = (key: string, value: string | null | undefined) => {
    const next = { ...values };
    if (value) next[key] = value;
    else delete next[key];
    onChange(Object.keys(next).length ? next : undefined);
  };

  const number = (key: string, label: string, max: number) => (
    <Input
      key={key}
      type="number"
      min={0}
      max={max}
      labelContent={label}
      placeholder="پیش‌فرض"
      value={values[key] ?? ""}
      onChange={(e) => set(key, e.target.value)}
    />
  );

  const control = (field: IStyleField) => {
    switch (field.type) {
      case "color":
        return (
          <ColorInput key={field.key} label={field.label} value={values[field.key]} onChange={(c) => set(field.key, c)} />
        );
      case "align":
        return (
          <div key={field.key} className="col-span-2 flex flex-col gap-1">
            <span className="text-sm">{field.label}</span>
            <div className="flex gap-2">
              {ALIGNS.map((a) => (
                <button
                  key={a.value}
                  type="button"
                  onClick={() => set(field.key, values[field.key] === a.value ? null : a.value)}
                  className={`rounded-lg border px-3 py-1 text-sm ${values[field.key] === a.value
                      ? "border-primary-500 bg-primary-50 text-primary-700"
                      : "border-gray-200 text-gray-600 hover:border-gray-300"
                    }`}
                >
                  {a.label}
                </button>
              ))}
            </div>
          </div>
        );
      case "weight":
        return (
          <label key={field.key} className="flex flex-col gap-1 text-sm">
            {field.label}
            <select
              className="h-10 rounded-lg border border-gray-300 bg-white px-2"
              value={values[field.key] ?? ""}
              onChange={(e) => set(field.key, e.target.value)}
            >
              <option value="">پیش‌فرض</option>
              {WEIGHTS.map((w) => (
                <option key={w.value} value={w.value}>
                  {w.label} ({w.value})
                </option>
              ))}
            </select>
          </label>
        );
      default: {
        const max = field.type === "count" ? 12 : 2000;
        return field.responsive ? (
          <div key={field.key} className="col-span-2 grid grid-cols-2 gap-2">
            {number(field.key, `${field.label} — موبایل`, max)}
            {number(`${field.key}-md`, `${field.label} — دسکتاپ`, max)}
          </div>
        ) : (
          number(field.key, field.label, max)
        );
      }
    }
  };

  const groups = [...new Set(fields.map((f) => f.group))];

  return (
    <div className="flex flex-col gap-3">
      {groups.map((group) => (
        <fieldset key={group} className="flex flex-col gap-2 rounded-lg border border-gray-100 p-2">
          <legend className="px-1 text-sm text-gray-600">{group}</legend>
          <div className="grid grid-cols-2 gap-2">
            {fields.filter((f) => f.group === group).map(control)}
          </div>
        </fieldset>
      ))}
      <p className="text-xs text-gray-500">
        اندازه‌ها به پیکسل؛ خالی = مقدار پیش‌فرض. موبایل زیر ۷۶۸ پیکسل، دسکتاپ از ۷۶۸ به بالا.
      </p>
    </div>
  );
}
