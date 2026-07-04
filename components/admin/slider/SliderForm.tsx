"use client";

import {
  useAdminBannerCreate,
  useAdminBannerUpdate,
  useAdminUploadBannerImage,
} from "@/lib/services/admin/hook";
import { IBannerItem } from "@/lib/services/admin/type";
import { Button, Card, Divider, Input, Switch } from "@dgshahr/ui-kit";
import FileUploader, { FileType } from "@dgshahr/ui-kit/Form/FileUploader";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface Props {
  mode: "create" | "edit";
  id?: number;
  initialData?: IBannerItem;
}

function SliderForm({ mode, id, initialData }: Props) {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [ctaLabel, setCtaLabel] = useState("");
  const [ctaLink, setCtaLink] = useState("");
  const [priority, setPriority] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [imagePath, setImagePath] = useState("");
  const [imageFile, setImageFile] = useState<FileType | null>(null);

  const uploadImage = useAdminUploadBannerImage();
  const { mutate: createBanner, isPending: isCreating } = useAdminBannerCreate();
  const { mutate: updateBanner, isPending: isUpdating } = useAdminBannerUpdate();
  const isPending = isCreating || isUpdating;

  useEffect(() => {
    if (!initialData) return;

    setTitle(initialData.title);
    setSubtitle(initialData.subtitle);
    setCtaLabel(initialData.ctaLabel);
    setCtaLink(initialData.ctaLink);
    setPriority(initialData.priority);
    setIsActive(initialData.isActive);
    setImagePath(initialData.image);
    setImageFile(initialData.image ? { src: initialData.image } : null);
  }, [initialData]);

  const handleImageChange = (file: File | undefined) => {
    if (!file) return;

    const localFile: FileType = {
      file,
      src: URL.createObjectURL(file),
      loading: true,
      status: "default",
    };
    setImageFile(localFile);

    uploadImage.mutate(file, {
      onSuccess: (res) => {
        setImagePath(res.path);
        setImageFile((prev) => (prev ? { ...prev, loading: false } : prev));
      },
      onError: () => {
        setImageFile((prev) => (prev ? { ...prev, loading: false, status: "error" } : prev));
      },
    });
  };

  const handleSubmit = () => {
    const payload = {
      title,
      subtitle,
      ctaLabel,
      ctaLink,
      priority,
      isActive,
      image: imagePath,
    };

    const onSuccess = () => {
      toast.success("با موفقیت انجام شد");
      router.push("/admin/sliders");
    };
    const onError = () => toast.error("خطا در ذخیره‌سازی");

    if (mode === "create") {
      createBanner(payload, { onSuccess, onError });
    } else if (id) {
      updateBanner({ id, payload }, { onSuccess, onError });
    }
  };

  return (
    <>
      <div className="flex justify-start">
        <Button
          onClick={() => router.push("/admin/sliders")}
          variant="text"
          color="gray"
        >
          {mode === "create" ? "افزودن اسلایدر" : `ویرایش اسلایدر ${initialData?.title ?? ""}`}
        </Button>
      </div>
      <Divider className="mb-5" color="gray" size="thin" type="horizontal" />
      <div className="flex flex-col gap-5 pt-6 px-4 h-full bg-gray-100">
        <Card>
          <div className="flex flex-col gap-4">
            <p className="font-h3-bold text-error-500">اطلاعات اسلایدر</p>
            <Divider className="mb-5" color="gray" size="thin" type="horizontal" />

            <FileUploader
              fileInputProps={{
                className: "w-full md:w-1/3",
                title: "بارگذاری تصویر اسلایدر",
                accept: "image/*",
              }}
              mode="single"
              files={imageFile ?? undefined}
              onChange={handleImageChange}
              previewProps={{
                leftButton: {
                  onClick: () => {
                    setImageFile(null);
                    setImagePath("");
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
                labelContent="زیرعنوان"
                placeholder="زیرعنوان"
                wrapperClassName="w-full"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
              />
              <Input
                labelContent="عنوان دکمه"
                placeholder="عنوان دکمه"
                wrapperClassName="w-full"
                value={ctaLabel}
                onChange={(e) => setCtaLabel(e.target.value)}
              />
              <Input
                labelContent="لینک دکمه"
                placeholder="/artists"
                wrapperClassName="w-full"
                value={ctaLink}
                onChange={(e) => setCtaLink(e.target.value)}
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
            </div>

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

export default SliderForm;
