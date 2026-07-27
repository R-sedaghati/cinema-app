"use client";

import { useState } from "react";
import FileUploader, { FileType } from "@dgshahr/ui-kit/Form/FileUploader";
import { useUserUploadVideo } from "@/lib/services/landing/hook";
import { FieldProps } from "./types";

const VideoUploadField: React.FC<FieldProps> = ({ field, value, onChange }) => {
  const uploadVideo = useUserUploadVideo();

  const [file, setFile] = useState<FileType | null>(
    !field.multiple && value ? { src: value as string } : null,
  );
  const [files, setFiles] = useState<FileType[]>(
    field.multiple && Array.isArray(value)
      ? (value as string[]).map((src) => ({ src }))
      : [],
  );

  if (field.multiple) {
    const handleAdd = (selected: File | undefined) => {
      if (!selected) return;

      const localFile: FileType = {
        file: selected,
        src: URL.createObjectURL(selected),
        loading: true,
        status: "default",
      };

      setFiles((prev) => [...prev, localFile]);

      uploadVideo.mutate(selected, {
        onSuccess: (res) => {
          setFiles((prev) => {
            const next = prev.map((item) =>
              item.file === selected ? { ...item, src: res.path, loading: false } : item,
            );
            onChange(next.map((item) => item.src).filter(Boolean));
            return next;
          });
        },
        onError: () => {
          setFiles((prev) =>
            prev.map((item) =>
              item.file === selected ? { ...item, loading: false, status: "error" } : item,
            ),
          );
        },
      });
    };

    return (
      <FileUploader
        fileInputProps={{
          className: "dgsuikit:ss02 w-full md:w-1/3",
          title: field.label,
        }}
        mode="multiple"
        files={files}
        onChange={handleAdd}
        previewProps={{
          leftButton: {
            onClick: (selectedItem) => {
              setFiles((prev) => {
                const next = prev.filter((item) => item.src !== selectedItem.src);
                onChange(next.map((item) => item.src).filter(Boolean));
                return next;
              });
            },
          },
          rightButton: false,
        }}
      />
    );
  }

  const handleChange = (selected: File | undefined) => {
    if (!selected) return;

    const localFile: FileType = {
      file: selected,
      src: URL.createObjectURL(selected),
      loading: true,
      status: "default",
    };

    setFile(localFile);

    uploadVideo.mutate(selected, {
      onSuccess: (res) => {
        setFile((prev) => (prev ? { ...prev, src: res.path, loading: false } : null));
        onChange(res.path);
      },
      onError: () => {
        setFile((prev) => (prev ? { ...prev, loading: false, status: "error" } : null));
      },
    });
  };

  return (
    <FileUploader
      fileInputProps={{
        className: "dgsuikit:ss02 w-full md:w-1/3",
        title: field.label,
      }}
      mode="single"
      files={file ?? undefined}
      onChange={handleChange}
      previewProps={{
        leftButton: {
          onClick: () => {
            setFile(null);
            onChange("");
          },
        },
        rightButton: false,
        wrapperClassName: "w-fit",
      }}
    />
  );
};

export default VideoUploadField;
