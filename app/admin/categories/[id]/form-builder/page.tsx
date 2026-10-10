"use client";

import {
  useAdminCategoryRetrieve,
  useAdminCreateFormField,
  useAdminCreateFormStep,
  useAdminDeleteFormField,
  useAdminDeleteFormStep,
  useAdminFormSchema,
  useAdminProfileFields,
  useAdminUpdateFormField,
  useAdminUpdateFormStep,
} from "@/lib/services/admin/hook";
import {
  EArtistGender,
  EFormFieldType,
  IFormField,
  IFormSchemaRetrieveResponse,
  IFormStep,
  IUpdateFormFieldRequest,
  SyncToUserField,
} from "@/lib/services/admin/type";
import {
  FIELD_TYPE_OPTIONS,
  FieldEditor,
  HAS_OPTIONS,
  IMAGE_TYPES,
  fieldErrorMessage,
  parseOptions,
} from "@/components/admin/form-builder/FieldEditor";
import { ProfileLinkNotice, ProfileLinkSummary } from "@/components/admin/form-builder/ProfileLinkNotice";
import { profileLinkIssues } from "@/lib/utils/profileLinkIssues";
import { useQueryClient } from "@tanstack/react-query";
import withNoSSR from "@/lib/utils/withNoSSR";
import { Button, Card, Checkbox, Divider, Select } from "@dgshahr/ui-kit";
import Input from "@/components/common/Input";
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

const NO_SYNC = "";

/** The site reads `answers.gender` as MAN/WOMAN (components/artists/Card.tsx,
 *  components/artists/detail/Aside.tsx). One click beats an admin retyping the key. */
const GENDER_FIELD = {
  key: "gender",
  label: "جنسیت",
  type: EFormFieldType.RADIO,
  options: [
    { label: "مرد", value: EArtistGender.MAN },
    { label: "زن", value: EArtistGender.WOMAN },
  ],
};

function FieldRow({
  field,
  allFields,
  onChanged,
  ...drag
}: {
  field: IFormField;
  allFields: IFormField[];
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
  const { data: profileFields } = useAdminProfileFields();

  // "" is the cleared state: patching `undefined` would be dropped from the request body,
  // leaving an existing link impossible to remove.
  const syncOptions: { label: string; value: SyncToUserField }[] = [
    { label: "بدون همگام‌سازی", value: NO_SYNC },
    ...(profileFields?.result ?? []).map((f) => ({ label: f.label, value: f.key })),
    { label: "شماره موبایل", value: "phoneNumber" },
  ];

  const patch = (payload: IUpdateFormFieldRequest) =>
    update({ fieldId: field.id, payload }, { onSuccess: onChanged });

  return (
    <FieldEditor
      {...drag}
      field={field}
      onPatch={patch}
      onDelete={() => remove(field.id, { onSuccess: onChanged })}
      notice={
        <ProfileLinkNotice
          issues={profileLinkIssues(field, allFields, profileFields?.result ?? null)}
        />
      }
      extraSelect={
        <Select
          inputProps={{ labelContent: "همگام‌سازی با پروفایل کاربر" }}
          value={field.syncToUserField ?? NO_SYNC}
          options={syncOptions}
          onChange={(v) => patch({ syncToUserField: (v as SyncToUserField) || null })}
          mode="single"
        />
      }
      extraFlags={
        <Checkbox
          label="خصوصی (نمایش پس از پرداخت)"
          checked={Boolean(field.isPrivate)}
          onChange={(e) => patch({ isPrivate: e.target.checked })}
        />
      }
    />
  );
}

function StepCard({
  step,
  allFields,
  hasGender,
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
  allFields: IFormField[];
  hasGender: boolean;
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
  const [stepDescription, setStepDescription] = useState(step.description ?? "");
  const [newKey, setNewKey] = useState("");
  const [newLabel, setNewLabel] = useState("");
  const [newType, setNewType] = useState<EFormFieldType>(EFormFieldType.TEXT);
  const [newRequired, setNewRequired] = useState(false);
  const [newMultiple, setNewMultiple] = useState(false);
  const [newPrivate, setNewPrivate] = useState(false);
  const [newOptionsText, setNewOptionsText] = useState("");

  const sortedFields = [...step.fields].sort((a, b) => a.order - b.order);

  const parseNewOptions = () => parseOptions(newOptionsText);

  const handleAddGender = () =>
    createField(
      {
        stepId: step.id,
        payload: { ...GENDER_FIELD, required: false, order: step.fields.length },
      },
      { onSuccess: onChanged, onError: (err: unknown) => toast.error(fieldErrorMessage(err)) },
    );

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
          isPrivate: newPrivate,
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
          setNewPrivate(false);
          setNewOptionsText("");
          onChanged();
        },
        onError: (err: unknown) => toast.error(fieldErrorMessage(err)),
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

        <Input
          labelContent="توضیح مرحله (زیر عنوان در فرم)"
          value={stepDescription}
          onChange={(e) => setStepDescription(e.target.value)}
          onBlur={() =>
            updateStep(
              { stepId: step.id, payload: { description: stepDescription } },
              { onSuccess: onChanged },
            )
          }
        />

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
              allFields={allFields}
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
              <Checkbox
                label="خصوصی"
                checked={newPrivate}
                onChange={(e) => setNewPrivate(e.target.checked)}
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

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              leftIcon={<Plus size={16} />}
              onClick={handleAddGender}
              disabled={hasGender}
            >
              افزودن فیلد جنسیت
            </Button>
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
  // Wait for the category before asking for a schema: subcategories have none and the
  // request would only 400.
  const { data: schemaData, refetch } = useAdminFormSchema(
    category && !category.parent ? id : undefined,
  );
  const { mutate: createStep } = useAdminCreateFormStep();
  const { mutate: updateStep } = useAdminUpdateFormStep();
  const { mutateAsync: updateField } = useAdminUpdateFormField();
  const { data: profileFields } = useAdminProfileFields();

  const [newStepTitle, setNewStepTitle] = useState("");
  const [dragging, setDragging] = useState<{ fieldId: number; fromStepId: number } | null>(null);
  const [dropTarget, setDropTarget] = useState<{ stepId: number; index: number } | null>(null);

  // Subcategories have no form of their own — send the admin to the parent's builder
  // instead of dropping them on an empty page.
  useEffect(() => {
    if (category?.parent) {
      toast.info(
        "زیر‌دسته فرم اختصاصی ندارد؛ فرم دسته‌بندی اصلی باز شد.",
      );
      router.replace(`/admin/categories/${category.parent}/form-builder`);
    }
  }, [category, router]);

  if (category?.parent) return null;

  const steps = [...(schemaData?.result?.steps ?? [])].sort((a, b) => a.order - b.order);
  // `key` is form-wide, so the prebuilt gender field is offered only while no step holds one.
  const hasGender = steps.some((s) => s.fields.some((f) => f.key === GENDER_FIELD.key));
  const allFields = steps.flatMap((s) => s.fields);

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
        <ProfileLinkSummary fields={allFields} profileFields={profileFields?.result ?? null} />

        {steps.map((step, index) => (
          <StepCard
            key={step.id}
            step={step}
            allFields={allFields}
            hasGender={hasGender}
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
