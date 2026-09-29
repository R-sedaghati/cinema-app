"use client";

import { Button, Card, Divider } from "@dgshahr/ui-kit";
import Input from "@/components/common/Input";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import {
  useAdminSiteContent,
  useAdminSiteContentUpdate,
} from "@/lib/services/admin/hook";
import { toEnglishDigits } from "@/lib/utils/fieldValidationPresets";

/** Server rejects anything above multer's cap (`backend/middleware/upload.ts`). */
const MAX_MB = 200;

/** Per-file upload caps for artist images and videos, stored on site content. */
const UploadLimitsForm = () => {
  const queryClient = useQueryClient();
  const { data, isPending: isLoading } = useAdminSiteContent();
  const { mutate, isPending } = useAdminSiteContentUpdate();

  const [imageMb, setImageMb] = useState("");
  const [videoMb, setVideoMb] = useState("");

  const saved = data?.result?.uploadLimits;
  useEffect(() => {
    if (!saved) return;
    setImageMb(String(saved.imageMb));
    setVideoMb(String(saved.videoMb));
  }, [saved]);

  const parse = (value: string) => {
    const n = Number(toEnglishDigits(value).trim());
    return Number.isInteger(n) && n >= 1 && n <= MAX_MB ? n : null;
  };

  const handleSubmit = () => {
    const image = parse(imageMb);
    const video = parse(videoMb);
    if (image === null || video === null) {
      toast.error(`حجم باید عددی صحیح بین ۱ تا ${MAX_MB} مگابایت باشد`);
      return;
    }

    mutate(
      { uploadLimits: { imageMb: image, videoMb: video } },
      {
        onSuccess: (response) => {
          queryClient.setQueryData(["adminSiteContent"], response);
          queryClient.invalidateQueries({ queryKey: ["userSiteContent"] });
          toast.success("با موفقیت تغییر کرد");
        },
        onError: () => toast.error("خطا در ذخیره‌سازی"),
      },
    );
  };

  return (
    <Card>
      <div className="flex flex-col gap-5">
        <p className="font-h3-bold text-error-500">محدودیت حجم آپلود</p>
        <Divider color="gray" size="thin" type="horizontal" />

        <div className="flex flex-col md:flex-row gap-3">
          <Input
            labelContent="حداکثر حجم تصویر (مگابایت)"
            inputMode="numeric"
            value={imageMb}
            disabled={isLoading}
            onChange={(e) => setImageMb(e.target.value)}
            wrapperClassName="w-full md:w-1/3"
          />
          <Input
            labelContent="حداکثر حجم ویدیو (مگابایت)"
            inputMode="numeric"
            value={videoMb}
            disabled={isLoading}
            onChange={(e) => setVideoMb(e.target.value)}
            wrapperClassName="w-full md:w-1/3"
          />
        </div>

        <div className="flex justify-end">
          <Button
            color="error"
            disabled={isPending || isLoading}
            isLoading={isPending}
            onClick={handleSubmit}
          >
            ذخیره
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default UploadLimitsForm;
