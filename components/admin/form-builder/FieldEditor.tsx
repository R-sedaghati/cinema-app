"use client";

import {
  EFormFieldType,
  IFormField,
  IFormFieldOption,
  IFormFieldValidation,
} from "@/lib/services/admin/type";
import {
  FIELD_VALIDATION_PRESETS,
  FieldValidationPreset,
} from "@/lib/utils/fieldValidationPresets";
import { Button, Checkbox, Select } from "@dgshahr/ui-kit";
import Input from "@/components/common/Input";
import { GripVertical, Trash2 } from "lucide-react";
import { ReactNode, useState } from "react";

const FIELD_TYPE_LABELS: Record<EFormFieldType, string> = {
  [EFormFieldType.TEXT]: "متن کوتاه",
  [EFormFieldType.TEXTAREA]: "متن بلند",
  [EFormFieldType.NUMBER]: "عدد",
  [EFormFieldType.SELECT]: "لیست کشویی",
  [EFormFieldType.SELECT_PROVINCE]: "استان (ایران)",
  [EFormFieldType.SELECT_CITY]: "شهر (ایران)",
  [EFormFieldType.RADIO]: "تک انتخابی",
  [EFormFieldType.CHECKBOX]: "چند انتخابی",
  [EFormFieldType.BOOLEAN]: "بله/خیر (تیک)",
  [EFormFieldType.DATE]: "تاریخ",
  [EFormFieldType.IMAGE]: "تصویر",
  [EFormFieldType.VIDEO]: "ویدئو",
};

export const FIELD_TYPE_OPTIONS = Object.values(EFormFieldType).map((type) => ({
  label: FIELD_TYPE_LABELS[type],
  value: type,
}));

export const HAS_OPTIONS = new Set([
  EFormFieldType.SELECT,
  EFormFieldType.RADIO,
  EFormFieldType.CHECKBOX,
]);

export const IMAGE_TYPES = new Set([EFormFieldType.IMAGE, EFormFieldType.VIDEO]);

const TEXT_TYPES = new Set([EFormFieldType.TEXT, EFormFieldType.TEXTAREA]);

/** Types with no text to test — a preset would have nothing to run against. */
const NO_PRESET_TYPES = new Set([
  EFormFieldType.BOOLEAN,
  EFormFieldType.IMAGE,
  EFormFieldType.VIDEO,
]);

const PRESET_OPTIONS = [
  { label: "بدون اعتبارسنجی", value: "" },
  ...Object.entries(FIELD_VALIDATION_PRESETS).map(([value, { label }]) => ({
    label,
    value,
  })),
];

const toNumberOrUndefined = (raw: string) =>
  raw.trim() === "" ? undefined : Number(raw);

/** "label:value, label2" → options; a bare chunk is its own value. */
export const parseOptions = (text: string): IFormFieldOption[] =>
  text
    .split(",")
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .map((chunk) => {
      const [label, value] = chunk.split(":");
      return { label: (label ?? "").trim(), value: (value ?? label ?? "").trim() };
    });

export const fieldErrorMessage = (err: unknown) =>
  (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
  "خطا در ایجاد فیلد";

type EditableField = Pick<
  IFormField,
  "key" | "label" | "type" | "placeholder" | "helpText" | "required" | "options" | "validation" | "multiple"
>;

export type FieldPatch = Partial<
  Omit<EditableField, "placeholder" | "options" | "validation"> & {
    placeholder: string;
    options: IFormFieldOption[];
    validation: IFormFieldValidation;
  }
>;

/**
 * One draggable field card shared by the registration form-builder and the profile-field
 * builder. Each builder wires its own save/delete and adds its extra controls via slots.
 */
export function FieldEditor({
  field,
  index,
  isDragging,
  showDropLine,
  onPatch,
  onDelete,
  keyLocked,
  typeLocked,
  extraSelect,
  extraFlags,
  onDragStart,
  onDragEnd,
  onDragOverIndex,
}: {
  field: EditableField;
  index: number;
  isDragging: boolean;
  showDropLine: boolean;
  onPatch: (payload: FieldPatch) => void;
  /** Omit to hide the delete button. */
  onDelete?: () => void;
  keyLocked?: boolean;
  typeLocked?: boolean;
  /** Fourth cell of the key/label/type row. */
  extraSelect?: ReactNode;
  /** Checkboxes next to "اجباری". */
  extraFlags?: ReactNode;
  onDragStart: () => void;
  onDragEnd: () => void;
  onDragOverIndex: (index: number) => void;
}) {
  const [optionsText, setOptionsText] = useState(
    (field.options ?? []).map((o) => `${o.label}:${o.value}`).join(", "),
  );
  const [grabbed, setGrabbed] = useState(false);
  // ponytail: free-text copy is saved on blur, not on every keystroke like the rest
  const [placeholder, setPlaceholder] = useState(field.placeholder ?? "");
  const [helpText, setHelpText] = useState(field.helpText ?? "");

  const validation = field.validation ?? {};
  const patchValidation = (change: Partial<IFormFieldValidation>) =>
    onPatch({ validation: { ...validation, ...change } });

  return (
    <div
      // ponytail: draggable only while the grip is held, so the row's inputs stay selectable
      draggable={grabbed}
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = "move";
        onDragStart();
      }}
      onDragEnd={() => {
        setGrabbed(false);
        onDragEnd();
      }}
      onDragOver={(e) => {
        e.preventDefault();
        const rect = e.currentTarget.getBoundingClientRect();
        onDragOverIndex(e.clientY < rect.top + rect.height / 2 ? index : index + 1);
      }}
      className={`flex flex-col gap-2 border border-solid rounded-lg p-3 ${
        showDropLine ? "border-t-2 border-t-primary-500" : ""
      } ${isDragging ? "opacity-50 border-gray-200" : "border-gray-200"}`}
    >
      <div className="flex items-center gap-2">
        <span
          className="cursor-grab text-gray-400 shrink-0"
          onMouseDown={() => setGrabbed(true)}
          onMouseUp={() => setGrabbed(false)}
        >
          <GripVertical size={18} />
        </span>
        <span className="text-xs text-gray-500">جابه‌جایی با کشیدن</span>
      </div>

      <div className="grid md:grid-cols-4 gap-2">
        <Input
          labelContent="کلید (key)"
          value={field.key}
          disabled={keyLocked}
          onChange={(e) => onPatch({ key: e.target.value })}
        />
        <Input
          labelContent="برچسب"
          value={field.label}
          onChange={(e) => onPatch({ label: e.target.value })}
        />
        <Select
          inputProps={{ labelContent: "نوع فیلد", disabled: typeLocked }}
          value={field.type}
          options={FIELD_TYPE_OPTIONS}
          onChange={(v) => v && !typeLocked && onPatch({ type: v as EFormFieldType })}
          mode="single"
        />
        {extraSelect}
      </div>

      <div className="grid md:grid-cols-2 gap-2">
        <Input
          labelContent="متن راهنمای داخل فیلد (placeholder)"
          value={placeholder}
          onChange={(e) => setPlaceholder(e.target.value)}
          onBlur={() => onPatch({ placeholder })}
        />
        <Input
          labelContent="توضیح زیر فیلد"
          value={helpText}
          onChange={(e) => setHelpText(e.target.value)}
          onBlur={() => onPatch({ helpText })}
        />
      </div>

      {HAS_OPTIONS.has(field.type) && (
        <Input
          labelContent="گزینه‌ها (برچسب:مقدار، جدا با کاما)"
          value={optionsText}
          onChange={(e) => setOptionsText(e.target.value)}
          onBlur={() => onPatch({ options: parseOptions(optionsText) })}
        />
      )}

      {!NO_PRESET_TYPES.has(field.type) && (
        <Select
          inputProps={{ labelContent: "اعتبارسنجی آماده" }}
          value={validation.preset ?? ""}
          options={PRESET_OPTIONS}
          onChange={(v) =>
            patchValidation({ preset: (v as FieldValidationPreset) || undefined })
          }
          mode="single"
        />
      )}

      {TEXT_TYPES.has(field.type) && (
        <div className="grid md:grid-cols-3 gap-2">
          <Input
            labelContent="حداقل طول"
            type="text"
            inputMode="numeric"
            value={validation.minLength ?? ""}
            onChange={(e) => patchValidation({ minLength: toNumberOrUndefined(e.target.value) })}
          />
          <Input
            labelContent="حداکثر طول"
            type="text"
            inputMode="numeric"
            value={validation.maxLength ?? ""}
            onChange={(e) => patchValidation({ maxLength: toNumberOrUndefined(e.target.value) })}
          />
          <Input
            labelContent="الگو (regex)"
            value={validation.pattern ?? ""}
            onChange={(e) => patchValidation({ pattern: e.target.value || undefined })}
          />
        </div>
      )}

      {field.type === EFormFieldType.NUMBER && (
        <div className="grid md:grid-cols-2 gap-2">
          <Input
            labelContent="حداقل مقدار"
            type="text"
            inputMode="numeric"
            value={validation.min ?? ""}
            onChange={(e) => patchValidation({ min: toNumberOrUndefined(e.target.value) })}
          />
          <Input
            labelContent="حداکثر مقدار"
            type="text"
            inputMode="numeric"
            value={validation.max ?? ""}
            onChange={(e) => patchValidation({ max: toNumberOrUndefined(e.target.value) })}
          />
        </div>
      )}

      <div className="flex justify-between items-center">
        <div className="flex gap-4 items-center">
          <Checkbox
            label="اجباری"
            checked={field.required}
            onChange={(e) => onPatch({ required: e.target.checked })}
          />
          {extraFlags}
          {IMAGE_TYPES.has(field.type) && !typeLocked && (
            <Checkbox
              label="چند فایلی"
              checked={Boolean(field.multiple)}
              onChange={(e) => onPatch({ multiple: e.target.checked })}
            />
          )}
        </div>
        {onDelete && (
          <Button
            color="error"
            variant="text"
            leftIcon={<Trash2 size={16} />}
            onClick={onDelete}
          >
            حذف فیلد
          </Button>
        )}
      </div>
    </div>
  );
}
