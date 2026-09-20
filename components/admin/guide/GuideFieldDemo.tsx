"use client";

import FieldRenderer from "@/components/artist-registration/fields/FieldRenderer";
import { useFormCopy } from "@/lib/hooks/useFormCopy";
import { EFormFieldType, IFormField } from "@/lib/services/admin/type";
import { useArtistRegistrationStore } from "@/lib/stores/useUserArtist";
import { getStepErrors } from "@/lib/utils/validateFormStep";
import { Button } from "@dgshahr/ui-kit";
import FileUploader, { FileType } from "@dgshahr/ui-kit/Form/FileUploader";
import { useEffect, useRef, useState } from "react";

/**
 * A guide demo writes its answers into the registration store rather than local state:
 * a SELECT_CITY field reads its province out of that store, so local state would leave
 * the province/city pair dead. Demo keys are all prefixed `demo_` (see content.tsx) and
 * the store is memory-only, so nothing here can collide with a real answer.
 */
const useDemoAnswers = () => {
  const answers = useArtistRegistrationStore((s) => s.answers);
  const setAnswer = useArtistRegistrationStore((s) => s.setAnswer);
  return { answers, setAnswer };
};

/**
 * Upload demo. The real IMAGE/VIDEO fields push the file to storage and keep the
 * returned path as the answer; here the file never leaves the browser.
 */
// ponytail: demo-only uploader, no upload call — a guide must not litter storage
const DemoUploader: React.FC<{
  field: IFormField;
  onChange: (value: unknown) => void;
}> = ({ field, onChange }) => {
  const [files, setFiles] = useState<FileType[]>([]);
  const blobsRef = useRef<string[]>([]);

  useEffect(
    () => () => blobsRef.current.forEach((url) => URL.revokeObjectURL(url)),
    [],
  );

  const commit = (next: FileType[]) => {
    setFiles(next);
    const names = next.map((item) => item.title ?? "");
    onChange(field.multiple ? names : (names[0] ?? ""));
  };

  const handleAdd = (file?: File) => {
    if (!file) return;
    const src = URL.createObjectURL(file);
    blobsRef.current.push(src);
    const item: FileType = { src, title: file.name };
    commit(field.multiple ? [...files, item] : [item]);
  };

  const handleRemove = (src?: string) =>
    commit(files.filter((item) => item.src !== src));

  return (
    <FileUploader
      fileInputProps={{
        className: "dgsuikit:ss02 w-full md:w-1/2",
        title: field.label,
      }}
      {...(field.multiple
        ? { mode: "multiple" as const, files }
        : { mode: "single" as const, files: files[0] })}
      onChange={handleAdd}
      previewProps={{
        leftButton: {
          onClick: (selectedItem?: FileType) => handleRemove(selectedItem?.src),
        },
        rightButton: false,
        ...(field.multiple ? {} : { wrapperClassName: "w-fit" }),
      }}
    />
  );
};

const describeValue = (value: unknown): string => {
  if (value === undefined || value === null || value === "") return "—";
  if (Array.isArray(value)) return value.length ? value.join("، ") : "—";
  if (typeof value === "boolean") return value ? "بله" : "خیر";
  return String(value);
};

const GuideFieldDemo: React.FC<{ fields: IFormField[] }> = ({ fields }) => {
  const { answers, setAnswer } = useDemoAnswers();
  const copy = useFormCopy();
  const [errors, setErrors] = useState<string[] | null>(null);

  const provinceKey = fields.find(
    (field) => field.type === EFormFieldType.SELECT_PROVINCE,
  )?.key;

  const check = () =>
    setErrors(
      getStepErrors(
        { id: 0, title: "", order: 0, icon: null, fields },
        answers,
        copy,
      ),
    );

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4">
      {fields.map((field) => {
        const isUpload =
          field.type === EFormFieldType.IMAGE ||
          field.type === EFormFieldType.VIDEO;

        return (
          <div key={field.key} className="flex flex-col gap-1">
            {isUpload ? (
              <DemoUploader
                field={field}
                onChange={(value) => setAnswer(field.key, value)}
              />
            ) : (
              <FieldRenderer
                field={field}
                value={answers[field.key]}
                provinceKey={provinceKey}
                onChange={(value) => setAnswer(field.key, value)}
              />
            )}
            <p className="font-p3-regular text-gray-500">
              چیزی که ذخیره می‌شود: {describeValue(answers[field.key])}
            </p>
          </div>
        );
      })}

      <div className="flex flex-wrap items-center gap-3">
        <Button variant="outline" color="error" size="small" onClick={check}>
          بررسی مقدار
        </Button>
        {errors !== null &&
          (errors.length ? (
            <span className="font-p3-regular text-error-500">{errors[0]}</span>
          ) : (
            <span className="font-p3-regular text-gray-600">
              مقدار این فیلد درست است.
            </span>
          ))}
      </div>
    </div>
  );
};

export default GuideFieldDemo;
