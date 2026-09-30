"use client";

import {
  useAdminCreateProfileField,
  useAdminDeleteProfileField,
  useAdminProfileFields,
  useAdminReorderProfileFields,
  useAdminUpdateProfileField,
} from "@/lib/services/admin/hook";
import { EFormFieldType, IProfileField } from "@/lib/services/admin/type";
import {
  FIELD_TYPE_OPTIONS,
  FieldEditor,
  HAS_OPTIONS,
  IMAGE_TYPES,
  fieldErrorMessage,
  parseOptions,
} from "@/components/admin/form-builder/FieldEditor";
import Input from "@/components/common/Input";
import withNoSSR from "@/lib/utils/withNoSSR";
import { Button, Card, Checkbox, Select } from "@dgshahr/ui-kit";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

const onError = (err: unknown) => toast.error(fieldErrorMessage(err));

function ProfileFieldRow({
  field,
  ...drag
}: {
  field: IProfileField;
  index: number;
  isDragging: boolean;
  showDropLine: boolean;
  onDragStart: () => void;
  onDragEnd: () => void;
  onDragOverIndex: (index: number) => void;
}) {
  const { mutate: update } = useAdminUpdateProfileField();
  const { mutate: remove } = useAdminDeleteProfileField();

  return (
    <FieldEditor
      {...drag}
      field={field}
      // the key names stored data, so it is fixed once created; a builtin's type is fixed
      // by the account column behind it
      keyLocked
      typeLocked={field.builtin}
      onPatch={(payload) => update({ id: field.id, payload }, { onError })}
      // builtins are backed by account columns: they can be hidden, never deleted
      onDelete={field.builtin ? undefined : () => remove(field.id, { onError })}
      extraSelect={
        <div className="flex items-end pb-2 text-xs text-gray-500">
          {field.builtin ? "فیلد پیش‌فرض حساب کاربری" : "فیلد سفارشی"}
        </div>
      }
      extraFlags={
        <Checkbox
          label="پنهان از کاربر"
          checked={field.hidden}
          onChange={(e) => update({ id: field.id, payload: { hidden: e.target.checked } }, { onError })}
        />
      }
    />
  );
}

function NewFieldCard() {
  const { mutate: create, isPending } = useAdminCreateProfileField();
  const [key, setKey] = useState("");
  const [label, setLabel] = useState("");
  const [type, setType] = useState<EFormFieldType>(EFormFieldType.TEXT);
  const [required, setRequired] = useState(false);
  const [multiple, setMultiple] = useState(false);
  const [optionsText, setOptionsText] = useState("");

  const handleAdd = () => {
    if (!key.trim() || !label.trim()) {
      toast.error("کلید و برچسب فیلد الزامی است");
      return;
    }

    create(
      {
        key: key.trim(),
        label: label.trim(),
        type,
        required,
        options: HAS_OPTIONS.has(type) ? parseOptions(optionsText) : undefined,
        multiple: IMAGE_TYPES.has(type) ? multiple : undefined,
      },
      {
        onSuccess: () => {
          setKey("");
          setLabel("");
          setType(EFormFieldType.TEXT);
          setRequired(false);
          setMultiple(false);
          setOptionsText("");
        },
        onError,
      },
    );
  };

  return (
    <Card>
      <div className="flex flex-col gap-2">
        <div className="grid md:grid-cols-4 gap-2 items-end">
          <Input
            labelContent="کلید فیلد جدید (انگلیسی)"
            dir="ltr"
            value={key}
            onChange={(e) => setKey(e.target.value)}
          />
          <Input labelContent="برچسب فیلد جدید" value={label} onChange={(e) => setLabel(e.target.value)} />
          <Select
            inputProps={{ labelContent: "نوع فیلد" }}
            value={type}
            options={FIELD_TYPE_OPTIONS}
            onChange={(v) => v && setType(v as EFormFieldType)}
            mode="single"
          />
          <div className="flex gap-2 items-center">
            <Checkbox label="اجباری" checked={required} onChange={(e) => setRequired(e.target.checked)} />
            {IMAGE_TYPES.has(type) && (
              <Checkbox label="چند فایلی" checked={multiple} onChange={(e) => setMultiple(e.target.checked)} />
            )}
          </div>
        </div>

        {HAS_OPTIONS.has(type) && (
          <Input
            labelContent="گزینه‌ها (برچسب:مقدار، جدا با کاما)"
            value={optionsText}
            onChange={(e) => setOptionsText(e.target.value)}
          />
        )}

        <div className="flex justify-end">
          <Button leftIcon={<Plus size={16} />} onClick={handleAdd} isLoading={isPending} disabled={isPending}>
            افزودن فیلد
          </Button>
        </div>
      </div>
    </Card>
  );
}

function ProfileFieldsBuilder() {
  const { data } = useAdminProfileFields();
  const { mutate: reorder } = useAdminReorderProfileFields();
  const fields = data?.result ?? [];

  const [draggingId, setDraggingId] = useState<number | null>(null);
  const [dropIndex, setDropIndex] = useState<number | null>(null);

  const handleDrop = () => {
    const id = draggingId;
    const target = dropIndex;
    setDraggingId(null);
    setDropIndex(null);
    if (id === null || target === null) return;

    const from = fields.findIndex((f) => f.id === id);
    const next = fields.filter((f) => f.id !== id);
    // dropping below its own position: the removal above already shifted the target index
    next.splice(from < target ? target - 1 : target, 0, fields[from]);
    reorder(
      next.map((f) => f.id),
      { onError },
    );
  };

  return (
    <div className="flex flex-col gap-5 pt-6 px-4 h-full bg-gray-100">
      <Card>
        <div className="flex flex-col gap-1">
          <p className="font-medium">فیلدهای پروفایل کاربر</p>
          <p className="text-sm text-gray-500">
            فیلدهایی که کاربر در صفحه پروفایل می‌بیند. فیلدهای اجباری خالی پس از ورود از کاربر
            پرسیده می‌شوند. فیلدهای پیش‌فرض حذف نمی‌شوند ولی می‌توان آن‌ها را پنهان کرد. تغییرات
            خودکار ذخیره می‌شوند.
          </p>
        </div>
      </Card>

      <Card>
        <div
          className="flex flex-col gap-3 min-h-12"
          onDragOver={(e) => {
            e.preventDefault();
            if (dropIndex === null) setDropIndex(fields.length);
          }}
          onDrop={(e) => {
            e.preventDefault();
            handleDrop();
          }}
        >
          {fields.map((field, index) => (
            <ProfileFieldRow
              key={field.id}
              field={field}
              index={index}
              isDragging={draggingId === field.id}
              showDropLine={dropIndex === index}
              onDragStart={() => setDraggingId(field.id)}
              onDragEnd={() => {
                setDraggingId(null);
                setDropIndex(null);
              }}
              onDragOverIndex={setDropIndex}
            />
          ))}
          {dropIndex === fields.length && fields.length > 0 && (
            <div className="border-t-2 border-solid border-primary-500" />
          )}
        </div>
      </Card>

      <NewFieldCard />
    </div>
  );
}

export default withNoSSR(ProfileFieldsBuilder);
