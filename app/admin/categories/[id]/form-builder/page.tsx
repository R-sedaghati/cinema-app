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
  IFormStep,
  SyncToUserField,
} from "@/lib/services/admin/type";
import withNoSSR from "@/lib/utils/withNoSSR";
import { Button, Card, Checkbox, Divider, Input, Select } from "@dgshahr/ui-kit";
import {
  ChevronDown,
  ChevronRight,
  ChevronUp,
  CreditCard,
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
  [EFormFieldType.RADIO]: "تک انتخابی",
  [EFormFieldType.CHECKBOX]: "چند انتخابی",
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

function FieldRow({
  field,
  onChanged,
}: {
  field: IFormField;
  onChanged: () => void;
}) {
  const { mutate: update } = useAdminUpdateFormField();
  const { mutate: remove } = useAdminDeleteFormField();
  const [optionsText, setOptionsText] = useState(
    (field.options ?? []).map((o) => `${o.label}:${o.value}`).join(", "),
  );

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

  return (
    <div className="flex flex-col gap-2 border border-solid border-gray-200 rounded-lg p-3">
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

      <div className="flex justify-between items-center">
        <Checkbox
          label="اجباری"
          checked={field.required}
          onChange={(e) => patch({ required: e.target.checked })}
        />
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
  onChanged,
  onMove,
}: {
  step: IFormStep;
  isFirst: boolean;
  isLast: boolean;
  onChanged: () => void;
  onMove: (direction: "up" | "down") => void;
}) {
  const { mutate: updateStep } = useAdminUpdateFormStep();
  const { mutate: deleteStep } = useAdminDeleteFormStep();
  const { mutate: createField } = useAdminCreateFormField();
  const [newKey, setNewKey] = useState("");
  const [newLabel, setNewLabel] = useState("");

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
          type: EFormFieldType.TEXT,
          order: step.fields.length,
        },
      },
      {
        onSuccess: () => {
          setNewKey("");
          setNewLabel("");
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
              const Icon = ICON_COMPONENTS[option.value];
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

        <div className="flex flex-col gap-3">
          {[...step.fields]
            .sort((a, b) => a.order - b.order)
            .map((field) => (
              <FieldRow key={field.id} field={field} onChanged={onChanged} />
            ))}
        </div>

        <div className="flex gap-2 items-end">
          <Input labelContent="کلید فیلد جدید" value={newKey} onChange={(e) => setNewKey(e.target.value)} />
          <Input labelContent="برچسب فیلد جدید" value={newLabel} onChange={(e) => setNewLabel(e.target.value)} />
          <Button leftIcon={<Plus size={16} />} onClick={handleAddField}>
            افزودن فیلد
          </Button>
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

  const { data: schemaData, refetch } = useAdminFormSchema(id);
  const { mutate: createStep } = useAdminCreateFormStep();
  const { mutate: updateStep } = useAdminUpdateFormStep();

  const [newStepTitle, setNewStepTitle] = useState("");

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
            onChanged={() => refetch()}
            onMove={(direction) => handleMove(step, direction)}
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
