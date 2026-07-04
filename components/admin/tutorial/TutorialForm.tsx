"use client";

import {
  useAdminTutorialCreate,
  useAdminTutorialUpdate,
  useAdminUploadTutorialThumbnail,
} from "@/lib/services/admin/hook";
import { ITutorialItem } from "@/lib/services/admin/type";
import { Button, Card, Divider, Input, Switch, Textarea } from "@dgshahr/ui-kit";
import FileUploader, { FileType } from "@dgshahr/ui-kit/Form/FileUploader";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface Props {
  mode: "create" | "edit";
  id?: number;
  initialData?: ITutorialItem;
}

function TutorialForm({ mode, id, initialData }: Props) {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [priority, setPriority] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [isMain, setIsMain] = useState(false);
  const [thumbnailPath, setThumbnailPath] = useState<string | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<FileType | null>(null);

  const uploadThumbnail = useAdminUploadTutorialThumbnail();
  const { mutate: createTutorial, isPending: isCreating } = useAdminTutorialCreate();
  const { mutate: updateTutorial, isPending: isUpdating } = useAdminTutorialUpdate();
  const isPending = isCreating || isUpdating;

  useEffect(() => {
    if (!initialData) return;

    setTitle(initialData.title);
    setContent(initialData.content);
    setVideoUrl(initialData.videoUrl);
    setPriority(initialData.priority);
    setIsActive(initialData.isActive);
    setIsMain(initialData.isMain);
    setThumbnailPath(initialData.thumbnail);
    setThumbnailFile(initialData.thumbnail ? { src: initialData.thumbnail } : null);
  }, [initialData]);

  const handleThumbnailChange = (file: File | undefined) => {
    if (!file) return;

    const localFile: FileType = {
      file,
      src: URL.createObjectURL(file),
      loading: true,
      status: "default",
    };
    setThumbnailFile(localFile);

    uploadThumbnail.mutate(file, {
      onSuccess: (res) => {
        setThumbnailPath(res.path);
        setThumbnailFile((prev) => (prev ? { ...prev, loading: false } : prev));
      },
      onError: () => {
        setThumbnailFile((prev) => (prev ? { ...prev, loading: false, status: "error" } : prev));
      },
    });
  };

  const handleSubmit = () => {
    const payload = {
      title,
      content,
      videoUrl,
      priority,
      isActive,
      isMain,
      thumbnail: thumbnailPath,
    };

    const onSuccess = () => {
      toast.success("با موفقیت انجام شد");
      router.push("/admin/tutorials");
    };
    const onError = () => toast.error("خطا در ذخیره‌سازی");

    if (mode === "create") {
      createTutorial(payload, { onSuccess, onError });
    } else if (id) {
      updateTutorial({ id, payload }, { onSuccess, onError });
    }
  };

  return (
    <>
      <div className="flex justify-start">
        <Button
          onClick={() => router.push("/admin/tutorials")}
          variant="text"
          color="gray"
        >
          {mode === "create" ? "افزودن آموزش" : `ویرایش آموزش ${initialData?.title ?? ""}`}
        </Button>
      </div>
      <Divider className="mb-5" color="gray" size="thin" type="horizontal" />
      <div className="flex flex-col gap-5 pt-6 px-4 h-full bg-gray-100">
        <Card>
          <div className="flex flex-col gap-4">
            <p className="font-h3-bold text-error-500">اطلاعات آموزش</p>
            <Divider className="mb-5" color="gray" size="thin" type="horizontal" />

            <FileUploader
              fileInputProps={{
                className: "w-full md:w-1/3",
                title: "بارگذاری تصویر بندانگشتی (اختیاری)",
                accept: "image/*",
              }}
              mode="single"
              files={thumbnailFile ?? undefined}
              onChange={handleThumbnailChange}
              previewProps={{
                leftButton: {
                  onClick: () => {
                    setThumbnailFile(null);
                    setThumbnailPath(null);
                  },
                },
                rightButton: false,
                wrapperClassName: "w-fit",
              }}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              <Input
                labelContent="عنوان"
                placeholder="عنوان"
                wrapperClassName="w-full"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <Input
                labelContent="لینک امبد آپارات"
                placeholder="https://www.aparat.com/video/video/embed/videohash/xxxx/vt/frame"
                wrapperClassName="w-full"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
              />
              <Input
                labelContent="اولویت نمایش"
                placeholder="اولویت نمایش"
                type="number"
                wrapperClassName="w-full"
                value={priority}
                onChange={(e) => setPriority(Number(e.target.value))}
              />
              <Switch
                label="وضعیت"
                checked={isActive}
                onChange={(checked) => setIsActive(checked)}
              />
              <Switch
                label="آموزش اصلی (نمایش ویدیو در صفحه اصلی)"
                checked={isMain}
                onChange={(checked) => setIsMain(checked)}
              />
            </div>

            <Textarea
              labelContent="متن آموزش"
              placeholder="متن آموزش"
              wrapperClassName="w-full"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />

            <div className="flex justify-end">
              <Button
                color="error"
                disabled={isPending}
                isLoading={isPending}
                onClick={handleSubmit}
              >
                ذخیره تغییرات
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}

export default TutorialForm;
