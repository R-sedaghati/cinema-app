"use client";

import {
  useAdminCategoryRetrieve,
  useAdminCreateFormField,
  useAdminCreateFormStep,
  useAdminDeleteFormField,
  useAdminDeleteFormStep,
  useAdminFormSchema,
  useAdminUpdateFormField,
  useAdminUpdateFormStep,
} from "@/lib/services/admin/hook";
import {
  EFormFieldType,
  IFormField,
  IFormFieldOption,
  IFormFieldValidation,
  IFormSchemaRetrieveResponse,
  IFormStep,
  SyncToUserField,
} from "@/lib/services/admin/type";
import {
  FIELD_VALIDATION_PRESETS,
  FieldValidationPreset,
} from "@/lib/utils/fieldValidationPresets";
import { useQueryClient } from "@tanstack/react-query";
import withNoSSR from "@/lib/utils/withNoSSR";
import { Button, Card, Checkbox, Divider, Input, Select } from "@dgshahr/ui-kit";
import {
  ChevronDown,
  ChevronRight,
  ChevronUp,
  CreditCard,
  GripVertical,
  LayoutGrid,
  List,
  Plus,
  Trash2,
  UserRound,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

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

const FIELD_TYPE_OPTIONS = Object.values(EFormFieldType).map((type) => ({
  label: FIELD_TYPE_LABELS[type],
  value: type,
}));

const ICON_COMPONENTS: Record<string, typeof LayoutGrid> = {
  LayoutGrid,
  UserRound,
  List,
  CreditCard,
};

const ICON_OPTIONS = Object.keys(ICON_COMPONENTS).map((i) => ({
  label: i,
  value: i,
}));

const SYNC_OPTIONS: { label: string; value: SyncToUserField }[] = [
  { label: "نام", value: "firstName" },
  { label: "نام خانوادگی", value: "lastName" },
  { label: "تصویر پروفایل", value: "avatar" },
  { label: "ایمیل", value: "email" },
];

const HAS_OPTIONS = new Set([
  EFormFieldType.SELECT,
  EFormFieldType.RADIO,
  EFormFieldType.CHECKBOX,
]);

const IMAGE_TYPES = new Set([EFormFieldType.IMAGE, EFormFieldType.VIDEO]);

const TEXT_TYPES = new Set([EFormFieldType.TEXT, EFormFieldType.TEXTAREA]);

const PRESET_OPTIONS = [
  { label: "بدون اعتبارسنجی", value: "" },
  ...Object.entries(FIELD_VALIDATION_PRESETS).map(([value, { label }]) => ({
    label,
    value,
  })),
];

const toNumberOrUndefined = (raw: string) =>
  raw.trim() === "" ? undefined : Number(raw);

function FieldRow({
  field,
  index,
  isDragging,
  showDropLine,
  onChanged,
  onDragStart,
  onDragEnd,
  onDragOverIndex,
}: {
  field: IFormField;
  index: number;
  isDragging: boolean;
  showDropLine: boolean;
  onChanged: () => void;
  onDragStart: () => void;
  onDragEnd: () => void;
  onDragOverIndex: (index: number) => void;
}) {
  const { mutate: update } = useAdminUpdateFormField();
  const { mutate: remove } = useAdminDeleteFormField();
  const [optionsText, setOptionsText] = useState(
    (field.options ?? []).map((o) => `${o.label}:${o.value}`).join(", "),
  );
  const [grabbed, setGrabbed] = useState(false);

  const parseOptions = (): IFormFieldOption[] =>
    optionsText
      .split(",")
      .map((chunk) => chunk.trim())
      .filter(Boolean)
      .map((chunk) => {
        const [label, value] = chunk.split(":");
        return { label: (label ?? "").trim(), value: (value ?? label ?? "").trim() };
      });

  const patch = (payload: Parameters<typeof update>[0]["payload"]) =>
    update({ fieldId: field.id, payload }, { onSuccess: onChanged });

  const validation = field.validation ?? {};
  const patchValidation = (change: Partial<IFormFieldValidation>) =>
    patch({ validation: { ...validation, ...change } });

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
          onChange={(e) => patch({ key: e.target.value })}
        />
        <Input
          labelContent="برچسب"
          value={field.label}
          onChange={(e) => patch({ label: e.target.value })}
        />
        <Select
          inputProps={{ labelContent: "نوع فیلد" }}
          value={field.type}
          options={FIELD_TYPE_OPTIONS}
          onChange={(v) => v && patch({ type: v as EFormFieldType })}
          mode="single"
        />
        <Select
          inputProps={{ labelContent: "همگام‌سازی با پروفایل کاربر" }}
          value={field.syncToUserField ?? null}
          options={SYNC_OPTIONS}
          onChange={(v) => patch({ syncToUserField: (v as SyncToUserField) || undefined })}
          mode="single"
        />
      </div>

      {HAS_OPTIONS.has(field.type) && (
        <Input
          labelContent="گزینه‌ها (برچسب:مقدار، جدا با کاما)"
          value={optionsText}
          onChange={(e) => setOptionsText(e.target.value)}
          onBlur={() => patch({ options: parseOptions() })}
        />
      )}

      {TEXT_TYPES.has(field.type) && (
        <div className="grid md:grid-cols-4 gap-2">
          <Select
            inputProps={{ labelContent: "اعتبارسنجی آماده" }}
            value={validation.preset ?? ""}
            options={PRESET_OPTIONS}
            onChange={(v) =>
              patchValidation({ preset: (v as FieldValidationPreset) || undefined })
            }
            mode="single"
          />
          <Input
            labelContent="حداقل طول"
            type="number"
            value={validation.minLength ?? ""}
            onChange={(e) => patchValidation({ minLength: toNumberOrUndefined(e.target.value) })}
          />
          <Input
            labelContent="حداکثر طول"
            type="number"
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
            type="number"
            value={validation.min ?? ""}
            onChange={(e) => patchValidation({ min: toNumberOrUndefined(e.target.value) })}
          />
          <Input
            labelContent="حداکثر مقدار"
            type="number"
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
            onChange={(e) => patch({ required: e.target.checked })}
          />
          {IMAGE_TYPES.has(field.type) && (
            <Checkbox
              label="چند فایلی"
              checked={Boolean(field.multiple)}
              onChange={(e) => patch({ multiple: e.target.checked })}
            />
          )}
        </div>
        <Button
          color="error"
          variant="text"
          leftIcon={<Trash2 size={16} />}
          onClick={() => remove(field.id, { onSuccess: onChanged })}
        >
          حذف فیلد
        </Button>
      </div>
    </div>
  );
}

function StepCard({
  step,
  isFirst,
  isLast,
  draggingFieldId,
  dropIndex,
  onChanged,
  onMove,
  onFieldDragStart,
  onFieldDragEnd,
  onFieldDragOver,
  onFieldDrop,
}: {
  step: IFormStep;
  isFirst: boolean;
  isLast: boolean;
  draggingFieldId: number | null;
  dropIndex: number | null;
  onChanged: () => void;
  onMove: (direction: "up" | "down") => void;
  onFieldDragStart: (fieldId: number) => void;
  onFieldDragEnd: () => void;
  onFieldDragOver: (index: number) => void;
  onFieldDrop: () => void;
}) {
  const { mutate: updateStep } = useAdminUpdateFormStep();
  const { mutate: deleteStep } = useAdminDeleteFormStep();
  const { mutate: createField } = useAdminCreateFormField();
  const [newKey, setNewKey] = useState("");
  const [newLabel, setNewLabel] = useState("");
  const [newType, setNewType] = useState<EFormFieldType>(EFormFieldType.TEXT);
  const [newRequired, setNewRequired] = useState(false);
  const [newMultiple, setNewMultiple] = useState(false);
  const [newOptionsText, setNewOptionsText] = useState("");

  const sortedFields = [...step.fields].sort((a, b) => a.order - b.order);

  const parseNewOptions = (): IFormFieldOption[] =>
    newOptionsText
      .split(",")
      .map((chunk) => chunk.trim())
      .filter(Boolean)
      .map((chunk) => {
        const [label, value] = chunk.split(":");
        return { label: (label ?? "").trim(), value: (value ?? label ?? "").trim() };
      });

  const handleAddField = () => {
    if (!newKey.trim() || !newLabel.trim()) {
      toast.error("کلید و برچسب فیلد الزامی است");
      return;
    }

    createField(
      {
        stepId: step.id,
        payload: {
          key: newKey.trim(),
          label: newLabel.trim(),
          type: newType,
          required: newRequired,
          options: HAS_OPTIONS.has(newType) ? parseNewOptions() : undefined,
          multiple: IMAGE_TYPES.has(newType) ? newMultiple : undefined,
          order: step.fields.length,
        },
      },
      {
        onSuccess: () => {
          setNewKey("");
          setNewLabel("");
          setNewType(EFormFieldType.TEXT);
          setNewRequired(false);
          setNewMultiple(false);
          setNewOptionsText("");
          onChanged();
        },
        onError: (err: unknown) => {
          const message =
            (err as { response?: { data?: { message?: string } } })?.response?.data
              ?.message ?? "خطا در ایجاد فیلد";
          toast.error(message);
        },
      },
    );
  };

  return (
    <Card>
      <div className="flex flex-col gap-4">
        <div className="grid md:grid-cols-3 gap-2 items-end">
          <Input
            labelContent="عنوان مرحله"
            value={step.title}
            onChange={(e) =>
              updateStep({ stepId: step.id, payload: { title: e.target.value } }, { onSuccess: onChanged })
            }
          />
          <Select
            inputProps={{ labelContent: "آیکون" }}
            value={step.icon ?? null}
            options={ICON_OPTIONS}
            optionCell={(option, isActive) => {
              const Icon = ICON_COMPONENTS[option.value ?? ""];
              return (
                <span className={`flex items-center ${isActive ? "text-primary-500" : ""}`}>
                  <Icon size={16} />
                </span>
              );
            }}
            onChange={(v) =>
              updateStep({ stepId: step.id, payload: { icon: v ?? undefined } }, { onSuccess: onChanged })
            }
            mode="single"
          />
          <div className="flex gap-2 justify-end">
            <Button variant="outline" disabled={isFirst} onClick={() => onMove("up")}>
              <ChevronUp size={16} />
            </Button>
            <Button variant="outline" disabled={isLast} onClick={() => onMove("down")}>
              <ChevronDown size={16} />
            </Button>
            <Button
              color="error"
              variant="outline"
              leftIcon={<Trash2 size={16} />}
              onClick={() => deleteStep(step.id, { onSuccess: onChanged })}
            >
              حذف مرحله
            </Button>
          </div>
        </div>

        <Divider color="gray" size="thin" type="horizontal" />

        <div
          className="flex flex-col gap-3 min-h-12"
          onDragOver={(e) => {
            e.preventDefault();
            if (dropIndex === null) onFieldDragOver(step.fields.length);
          }}
          onDrop={(e) => {
            e.preventDefault();
            onFieldDrop();
          }}
        >
          {sortedFields.map((field, index) => (
            <FieldRow
              key={field.id}
              field={field}
              index={index}
              isDragging={draggingFieldId === field.id}
              showDropLine={dropIndex === index}
              onChanged={onChanged}
              onDragStart={() => onFieldDragStart(field.id)}
              onDragEnd={onFieldDragEnd}
              onDragOverIndex={onFieldDragOver}
            />
          ))}
          {dropIndex === sortedFields.length && sortedFields.length > 0 && (
            <div className="border-t-2 border-solid border-primary-500" />
          )}
        </div>

        <div className="flex flex-col gap-2">
          <div className="grid md:grid-cols-4 gap-2 items-end">
            <Input labelContent="کلید فیلد جدید" value={newKey} onChange={(e) => setNewKey(e.target.value)} />
            <Input labelContent="برچسب فیلد جدید" value={newLabel} onChange={(e) => setNewLabel(e.target.value)} />
            <Select
              inputProps={{ labelContent: "نوع فیلد" }}
              value={newType}
              options={FIELD_TYPE_OPTIONS}
              onChange={(v) => v && setNewType(v as EFormFieldType)}
              mode="single"
            />
            <div className="flex gap-2 items-center">
              <Checkbox
                label="اجباری"
                checked={newRequired}
                onChange={(e) => setNewRequired(e.target.checked)}
              />
              {IMAGE_TYPES.has(newType) && (
                <Checkbox
                  label="چند فایلی"
                  checked={newMultiple}
                  onChange={(e) => setNewMultiple(e.target.checked)}
                />
              )}
            </div>
          </div>

          {HAS_OPTIONS.has(newType) && (
            <Input
              labelContent="گزینه‌ها (برچسب:مقدار، جدا با کاما)"
              value={newOptionsText}
              onChange={(e) => setNewOptionsText(e.target.value)}
            />
          )}

          <div className="flex justify-end">
            <Button leftIcon={<Plus size={16} />} onClick={handleAddField}>
              افزودن فیلد
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

function FormBuilder() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const { data: categoryData } = useAdminCategoryRetrieve(id);
  const category = categoryData?.result;

  const queryClient = useQueryClient();
  const { data: schemaData, refetch } = useAdminFormSchema(id);
  const { mutate: createStep } = useAdminCreateFormStep();
  const { mutate: updateStep } = useAdminUpdateFormStep();
  const { mutateAsync: updateField } = useAdminUpdateFormField();

  const [newStepTitle, setNewStepTitle] = useState("");
  const [dragging, setDragging] = useState<{ fieldId: number; fromStepId: number } | null>(null);
  const [dropTarget, setDropTarget] = useState<{ stepId: number; index: number } | null>(null);

  useEffect(() => {
    if (category && category.parent) {
      router.replace(`/admin/categories/${id}`);
    }
  }, [category, id, router]);

  const steps = [...(schemaData?.result?.steps ?? [])].sort((a, b) => a.order - b.order);

  const handleAddStep = () => {
    if (!newStepTitle.trim()) {
      toast.error("عنوان مرحله الزامی است");
      return;
    }

    createStep(
      { categoryId: id, payload: { title: newStepTitle.trim(), order: steps.length } },
      {
        onSuccess: () => {
          setNewStepTitle("");
          refetch();
        },
      },
    );
  };

  const handleMove = (step: IFormStep, direction: "up" | "down") => {
    const index = steps.findIndex((s) => s.id === step.id);
    const swapWith = direction === "up" ? steps[index - 1] : steps[index + 1];
    if (!swapWith) return;

    updateStep({ stepId: step.id, payload: { order: swapWith.order } });
    updateStep({ stepId: swapWith.id, payload: { order: step.order } }, { onSuccess: () => refetch() });
  };

  const handleFieldDrop = async () => {
    const drag = dragging;
    const target = dropTarget;
    setDragging(null);
    setDropTarget(null);
    if (!drag || !target) return;

    const sorted = (step: IFormStep) => [...step.fields].sort((a, b) => a.order - b.order);
    const source = steps.find((s) => s.id === drag.fromStepId);
    const destination = steps.find((s) => s.id === target.stepId);
    if (!source || !destination) return;

    const field = source.fields.find((f) => f.id === drag.fieldId);
    if (!field) return;

    const remaining = sorted(source).filter((f) => f.id !== field.id);
    const destinationList = source.id === destination.id ? remaining : sorted(destination);
    // dropping below its own position: the removal above already shifted the target index
    const insertAt =
      source.id === destination.id && sorted(source).findIndex((f) => f.id === field.id) < target.index
        ? target.index - 1
        : target.index;

    destinationList.splice(Math.min(insertAt, destinationList.length), 0, field);

    const nextFieldsByStep = new Map<number, IFormField[]>([[destination.id, destinationList]]);
    if (source.id !== destination.id) nextFieldsByStep.set(source.id, remaining);

    const nextSteps = steps.map((step) => {
      const nextFields = nextFieldsByStep.get(step.id);
      if (!nextFields) return step;
      return { ...step, fields: nextFields.map((f, index) => ({ ...f, order: index })) };
    });

    queryClient.setQueryData<IFormSchemaRetrieveResponse>(["adminFormSchema", id], (previous) =>
      previous ? { ...previous, result: { ...previous.result, steps: nextSteps } } : previous,
    );

    const patches = nextSteps.flatMap((step) =>
      step.fields
        .filter((f) => {
          const before = steps.find((s) => s.id === step.id)?.fields.find((o) => o.id === f.id);
          return !before || before.order !== f.order;
        })
        .map((f) => ({
          fieldId: f.id,
          payload:
            f.id === field.id && source.id !== destination.id
              ? { order: f.order, stepId: destination.id }
              : { order: f.order },
        })),
    );

    try {
      await Promise.all(patches.map((patch) => updateField(patch)));
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "خطا در جابه‌جایی فیلد";
      toast.error(message);
    } finally {
      refetch();
    }
  };

  return (
    <>
      <div className="flex justify-start">
        <Button
          onClick={() => router.push(`/admin/categories/${id}`)}
          variant="text"
          rightIcon={<ChevronRight />}
          color="gray"
        >
          {`مدیریت فرم ${category?.faName ?? ""}`}
        </Button>
      </div>
      <Divider className="mb-5" color="gray" size="thin" type="horizontal" />

      <div className="flex flex-col gap-5 pt-6 px-4 h-full bg-gray-100">
        {steps.map((step, index) => (
          <StepCard
            key={step.id}
            step={step}
            isFirst={index === 0}
            isLast={index === steps.length - 1}
            draggingFieldId={dragging?.fieldId ?? null}
            dropIndex={dropTarget?.stepId === step.id ? dropTarget.index : null}
            onChanged={() => refetch()}
            onMove={(direction) => handleMove(step, direction)}
            onFieldDragStart={(fieldId) => setDragging({ fieldId, fromStepId: step.id })}
            onFieldDragEnd={() => {
              setDragging(null);
              setDropTarget(null);
            }}
            onFieldDragOver={(dropIndex) => setDropTarget({ stepId: step.id, index: dropIndex })}
            onFieldDrop={handleFieldDrop}
          />
        ))}

        <Card>
          <div className="flex gap-2 items-end">
            <Input
              labelContent="عنوان مرحله جدید"
              value={newStepTitle}
              onChange={(e) => setNewStepTitle(e.target.value)}
              wrapperClassName="w-full"
            />
            <Button leftIcon={<Plus size={16} />} onClick={handleAddStep}>
              افزودن مرحله
            </Button>
          </div>
        </Card>
      </div>
    </>
  );
}

export default withNoSSR(FormBuilder);
