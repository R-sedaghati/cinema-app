"use client";

import FileUploader, { FileType } from "@dgshahr/ui-kit/Form/FileUploader";
import { useUserUploadImage } from "@/lib/services/landing/hook";
import { useLandingCopy } from "@/lib/hooks/useLandingCopy";
import { FieldProps } from "./types";
import { useUploadField } from "./useUploadField";

const ImageUploadField: React.FC<FieldProps> = ({ field, value, onChange }) => {
  const uploadImage = useUserUploadImage();
  const copy = useLandingCopy();

  const { items, handleAdd, handleRemove } = useUploadField({
    field,
    value,
    onChange,
    upload: (file, callbacks) => uploadImage.mutate(file, callbacks),
    errorMessage: copy("imageUploadFailed"),
  });

  // `Item` is a `FileType` with the storage path carried alongside; the uploader ignores
  // the extra key.
  const files: FileType[] = items;

  return (
    <FileUploader
      fileInputProps={{
        className: "dgsuikit:ss02 w-full md:w-1/3",
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

export default ImageUploadField;
