"use client";

import {
  useAdminBannerCreate,
  useAdminBannerUpdate,
  useAdminUploadBannerImage,
} from "@/lib/services/admin/hook";
import { IBannerItem } from "@/lib/services/admin/type";
import FontSizeInput from "@/components/admin/FontSizeInput";
import GuideBlocks from "@/components/admin/guide/GuideBlocks";
import { SLIDER_FORM_GUIDE } from "@/lib/constants/guide/content";
import { fontSizeStyle } from "@/lib/utils/fontSize";
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

type FieldErrors = Partial<
  Record<
    | "image"
    | "ctaLabel"
    | "ctaLink"
    | "priority"
    | "titleFontSize"
    | "subtitleFontSize"
    | "ctaLabelFontSize",
    string
  >
>;

const fontSizeError = (value: number | null) => {
  if (value === null) return undefined;
  if (!Number.isFinite(value)) return "اندازه فونت باید عدد باشد.";

  return value < 8 || value > 120
    ? "اندازه فونت باید بین ۸ تا ۱۲۰ پیکسل باشد."
    : undefined;
};

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
  const [titleFontSize, setTitleFontSize] = useState<number | null>(null);
  const [subtitleFontSize, setSubtitleFontSize] = useState<number | null>(null);
  const [ctaLabelFontSize, setCtaLabelFontSize] = useState<number | null>(null);
  const [errors, setErrors] = useState<FieldErrors>({});

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
    setTitleFontSize(initialData.titleFontSize ?? null);
    setSubtitleFontSize(initialData.subtitleFontSize ?? null);
    setCtaLabelFontSize(initialData.ctaLabelFontSize ?? null);
  }, [initialData]);

  const clearError = (field: keyof FieldErrors) =>
    setErrors((prev) => {
      if (!prev[field]) return prev;

      const next = { ...prev };
      delete next[field];

      return next;
    });

  const handleImageChange = (file: File | undefined) => {
    if (!file) return;

    const localFile: FileType = {
      file,
      src: URL.createObjectURL(file),
      loading: true,
      status: "default",
    };
    setImageFile(localFile);
    clearError("image");

    uploadImage.mutate(file, {
      onSuccess: (res) => {
        setImagePath(res.path);
        setImageFile((prev) => (prev ? { ...prev, loading: false } : prev));
      },
      onError: () => {
        setImageFile((prev) => (prev ? { ...prev, loading: false, status: "error" } : prev));
        setErrors((prev) => ({
          ...prev,
          image: "بارگذاری تصویر ناموفق بود. دوباره تلاش کنید.",
        }));
      },
    });
  };

  const validate = (): FieldErrors => {
    const next: FieldErrors = {};

    if (uploadImage.isPending) {
      next.image = "تا پایان بارگذاری تصویر صبر کنید.";
    } else if (!imagePath) {
      next.image = "انتخاب تصویر اسلایدر الزامی است.";
    }

    const label = ctaLabel.trim();
    const link = ctaLink.trim();

    if (link && !label) next.ctaLabel = "با وارد کردن لینک، عنوان دکمه هم الزامی است.";

    if (label && !link) {
      next.ctaLink = "با وارد کردن عنوان دکمه، لینک دکمه هم الزامی است.";
    } else if (link && !/^(\/|https?:\/\/)/.test(link)) {
      next.ctaLink = "لینک باید با «/» یا «http» شروع شود.";
    }

    if (!Number.isInteger(priority) || priority < 0) {
      next.priority = "اولویت نمایش باید عدد صحیح و بزرگ‌تر یا مساوی صفر باشد.";
    }

    const sizes = {
      titleFontSize,
      subtitleFontSize,
      ctaLabelFontSize,
    } as const;

    for (const [field, value] of Object.entries(sizes)) {
      const error = fontSizeError(value);
      if (error) next[field as keyof FieldErrors] = error;
    }

    return next;
  };

  const handleSubmit = () => {
    const nextErrors = validate();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      toast.error("لطفاً خطاهای فرم را برطرف کنید.");

      return;
    }

    const payload = {
      title: title.trim(),
      subtitle: subtitle.trim(),
      ctaLabel: ctaLabel.trim(),
      ctaLink: ctaLink.trim(),
      priority,
      isActive,
      image: imagePath,
      titleFontSize,
      subtitleFontSize,
      ctaLabelFontSize,
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
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 pt-6 px-4 h-full bg-gray-100">
        <div className="xl:col-span-2">
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
              {errors.image && (
                <p className="text-sm text-error-500">{errors.image}</p>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                <Input
                  labelContent="عنوان (اختیاری)"
                  placeholder="عنوان"
                  wrapperClassName="w-full"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <Input
                  labelContent="زیرعنوان (اختیاری)"
                  placeholder="زیرعنوان"
                  wrapperClassName="w-full"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                />
                <FontSizeInput
                  label="اندازه فونت عنوان"
                  value={titleFontSize}
                  onChange={(value) => {
                    setTitleFontSize(value);
                    clearError("titleFontSize");
                  }}
                  isError={Boolean(errors.titleFontSize)}
                  errorMessage={errors.titleFontSize}
                />
                <FontSizeInput
                  label="اندازه فونت زیرعنوان"
                  value={subtitleFontSize}
                  onChange={(value) => {
                    setSubtitleFontSize(value);
                    clearError("subtitleFontSize");
                  }}
                  isError={Boolean(errors.subtitleFontSize)}
                  errorMessage={errors.subtitleFontSize}
                />
                <Input
                  labelContent="عنوان دکمه (اختیاری)"
                  placeholder="عنوان دکمه"
                  wrapperClassName="w-full"
                  value={ctaLabel}
                  onChange={(e) => {
                    setCtaLabel(e.target.value);
                    clearError("ctaLabel");
                  }}
                  isError={Boolean(errors.ctaLabel)}
                  errorMessage={errors.ctaLabel}
                />
                <Input
                  labelContent="لینک دکمه (اختیاری)"
                  placeholder="/artists"
                  wrapperClassName="w-full"
                  value={ctaLink}
                  onChange={(e) => {
                    setCtaLink(e.target.value);
                    clearError("ctaLink");
                  }}
                  isError={Boolean(errors.ctaLink)}
                  errorMessage={errors.ctaLink}
                />
                <FontSizeInput
                  label="اندازه فونت دکمه"
                  value={ctaLabelFontSize}
                  onChange={(value) => {
                    setCtaLabelFontSize(value);
                    clearError("ctaLabelFontSize");
                  }}
                  isError={Boolean(errors.ctaLabelFontSize)}
                  errorMessage={errors.ctaLabelFontSize}
                />
                <Input
                  labelContent="اولویت نمایش"
                  placeholder="اولویت نمایش"
                  type="number"
                  wrapperClassName="w-full"
                  value={priority}
                  onChange={(e) => {
                    setPriority(Number(e.target.value));
                    clearError("priority");
                  }}
                  isError={Boolean(errors.priority)}
                  errorMessage={errors.priority}
                />
                <Switch
                  label="وضعیت"
                  checked={isActive}
                  onChange={(checked) => setIsActive(checked)}
                />
              </div>

              <div className="flex flex-col gap-2">
                <p className="font-h4-bold">پیش‌نمایش</p>
                <div className="rounded-xl bg-linear-to-bl from-zinc-900 to-zinc-700 p-6">
                  <p
                    className="text-error-400 text-sm md:text-base font-medium mb-1 md:mb-2"
                    style={fontSizeStyle(subtitleFontSize)}
                  >
                    {subtitle || "زیرعنوان اسلایدر"}
                  </p>
                  <h2
                    className="text-white text-2xl md:text-5xl font-bold mb-4 md:mb-6"
                    style={fontSizeStyle(titleFontSize)}
                  >
                    {title || "عنوان اسلایدر"}
                  </h2>
                  <span
                    className="inline-flex items-center gap-1.5 rounded-full bg-error-500 px-4 py-2 md:px-6 md:py-3 text-sm md:text-base font-semibold text-zinc-950"
                    style={fontSizeStyle(ctaLabelFontSize)}
                  >
                    {ctaLabel || "عنوان دکمه"}
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  color="gray"
                  disabled={isPending}
                  onClick={() => router.push("/admin/sliders")}
                >
                  انصراف
                </Button>
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

        <div className="xl:col-span-1">
          <Card>
            <div className="flex flex-col gap-4">
              <p className="font-h3-bold text-error-500">راهنمای این صفحه</p>
              <Divider color="gray" size="thin" type="horizontal" />
              <GuideBlocks blocks={SLIDER_FORM_GUIDE} />
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}

export default SliderForm;
