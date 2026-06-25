"use client";

import { Asterisk, ChevronLeft, ChevronRight } from "lucide-react";
import Button from "../common/Button";
import { Card, FileUploader, RadioButton, Textarea } from "@dgshahr/ui-kit";
import { useArtistRegistrationStore } from "@/lib/stores/useUserArtist";
import { useUserUploadAvatar, useUserUploadVideo } from "@/lib/services/landing/hook";

interface Props {
  onNext: () => void;
  onPrevious: () => void;
}

const ThirdStepFlow: React.FC<Props> = ({ onNext, onPrevious }) => {
  const store = useArtistRegistrationStore();
  const uploadImage = useUserUploadAvatar();
  const uploadVideo = useUserUploadVideo();

  const handleImageUpload = (files: File[]) => {
    if (!files[0]) return;
    uploadImage.mutate(files[0], {
      onSuccess: (res) => store.addPortfolio({ path: res.path, type: "IMAGE" }),
    });
  };

  const handleVideoUpload = (files: File[]) => {
    if (!files[0]) return;
    uploadVideo.mutate(files[0], {
      onSuccess: (res) => store.addPortfolio({ path: res.path, type: "VIDEO" }),
    });
  };

  return (
    <Card wrapperClassName="w-3/4">
      <div className="flex flex-col gap-5">
        <Textarea
          labelContent="درباره من"
          placeholder="درباره خود بنویسید . . ."
          required
          value={store.aboutMe}
          onChange={(e) => store.setField("aboutMe", e.target.value)}
        />
        <div className="flex flex-col gap-2">
          <div className="flex gap-1">
            <p className="font-p2-medium">نمونه کار</p>
            <Asterisk size={12} className="text-error-500" />
          </div>
          <div className="flex gap-5">
            <RadioButton label="دارم" name="sample" />
            <RadioButton label="ندارم" name="sample" />
            <RadioButton label="تمایل به ضبط نمونه کار دارم" name="sample" />
          </div>
        </div>
        <div className="flex gap-3">
          <div className="flex flex-col gap-3 w-1/2">
            <p className="font-h6-bold">بارگذاری نمونه کار (عکس)</p>
            <FileUploader
              fileInputProps={{
                className: "dgsuikit:ss02 w-full",
                description: "فرمت‌های قابل قبول JPG , PNG\nحداکثر حجم تا 5Mb",
                title: "بارگذاری نمونه کار (عکس)",
              }}
              onChange={handleImageUpload}
              mode="single"
              previewProps={{
                exteraButton: {
                  children: "عنوان",
                  size: "small",
                  variant: "secondary",
                },
              }}
            />
          </div>
          <div className="flex flex-col gap-3 w-1/2">
            <p className="font-h6-bold">بارگذاری نمونه کار (ویدیو)</p>
            <FileUploader
              fileInputProps={{
                className: "dgsuikit:ss02 w-full",
                description: "فرمت‌های قابل قبول JPG , PNG\nحداکثر حجم تا 5Mb",
                title: "بارگذاری نمونه کار (ویدیو)",
              }}
              onChange={handleVideoUpload}
              mode="single"
              previewProps={{
                exteraButton: {
                  children: "عنوان",
                  size: "small",
                  variant: "secondary",
                },
              }}
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-5">
          <Button
            variant="outline"
            rightIcon={<ChevronRight />}
            className="rounded-full! px-10"
            onClick={onPrevious}
          >
            مرحله قبل
          </Button>

          <Button
            leftIcon={<ChevronLeft />}
            className="rounded-full! px-10"
            onClick={onNext}
          >
            مرحله بعد
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ThirdStepFlow;
