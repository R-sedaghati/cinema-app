"use client";

import { Asterisk, ChevronLeft, ChevronRight } from "lucide-react";
import Button from "../common/Button";
import { Card, RadioButton, Textarea } from "@dgshahr/ui-kit";
import { useArtistRegistrationStore } from "@/lib/stores/useUserArtist";
import {
  useUserUploadImage,
  useUserUploadVideo,
} from "@/lib/services/landing/hook";
import { useState } from "react";
import FileUploader, { FileType } from "@dgshahr/ui-kit/Form/FileUploader";
import clsx from "clsx";
import { isDesktop, isMobile } from "react-device-detect";

interface Props {
  onNext: () => void;
  onPrevious: () => void;
}

const ThirdStepFlow: React.FC<Props> = ({ onNext, onPrevious }) => {
  const store = useArtistRegistrationStore();
  const uploadImage = useUserUploadImage();
  const uploadVideo = useUserUploadVideo();

  const [imageFiles, setImageFiles] = useState<FileType[]>([]);
  const [videoFiles, setVideoFiles] = useState<FileType[]>([]);

  const handleUpload = (file: File | undefined, type: "IMAGE" | "VIDEO") => {
    if (!file) return;

    const localFile: FileType = {
      file,
      src: URL.createObjectURL(file),
      loading: true,
      status: "default",
    };

    if (type === "IMAGE") {
      setImageFiles((prev) => [...prev, localFile]);
    } else {
      setVideoFiles((prev) => [...prev, localFile]);
    }

    const mutation = type === "IMAGE" ? uploadImage : uploadVideo;

    mutation.mutate(file, {
      onSuccess: (res) => {
        const setter = type === "IMAGE" ? setImageFiles : setVideoFiles;

        setter((prev) =>
          prev.map((item) =>
            item.file === file
              ? {
                ...item,
                src: res.path,
                loading: false,
              }
              : item,
          ),
        );

        store.addPortfolio({
          path: res.path,
          type,
        });
      },

      onError: () => {
        const setter = type === "IMAGE" ? setImageFiles : setVideoFiles;

        setter((prev) =>
          prev.map((item) =>
            item.file === file
              ? {
                ...item,
                loading: false,
                status: "error",
              }
              : item,
          ),
        );
      },
    });
  };

  return (
    <Card wrapperClassName={isMobile ? "w-[95%]" : "w-3/4"}>
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

          <div className="flex flex-col md:flex-row gap-5">
            <RadioButton label="دارم" name="sample" />
            <RadioButton label="ندارم" name="sample" />
            <RadioButton label="تمایل به ضبط نمونه کار دارم" name="sample" />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-5 md:gap-3">
          <div className="flex flex-col gap-3 w-full md:w-1/2">
            <p className="font-h6-bold">بارگذاری نمونه کار (عکس)</p>

            <FileUploader
              mode="multiple"
              files={imageFiles}
              onChange={(file) => handleUpload(file, "IMAGE")}
              fileInputProps={{
                className: "dgsuikit:ss02 w-full",
                title: "بارگذاری نمونه کار (عکس)",
              }}
              previewProps={{
                leftButton: {
                  onClick: (selectedItem) => {
                    setImageFiles((prev) =>
                      prev.filter((item) => item.src !== selectedItem.src),
                    );

                    if (selectedItem.src) {
                      store.removePortfolio(selectedItem.src);
                    }
                  },
                },
                rightButton: false,
              }}
            />
          </div>

          <div className="flex flex-col gap-3 w-full md:w-1/2">
            <p className="font-h6-bold">بارگذاری نمونه کار (ویدیو)</p>

            <FileUploader
              mode="multiple"
              files={videoFiles}
              onChange={(file) => handleUpload(file, "VIDEO")}
              fileInputProps={{
                className: "dgsuikit:ss02 w-full",
                title: "بارگذاری نمونه کار (ویدیو)",
              }}
              previewProps={{
                leftButton: {
                  onClick: (selectedItem) => {
                    setVideoFiles((prev) =>
                      prev.filter((item) => item.src !== selectedItem.src),
                    );

                    if (selectedItem.src) {
                      store.removePortfolio(selectedItem.src);
                    }
                  },
                },
                rightButton: false,
              }}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-5">
          <Button
            variant="outline"
            rightIcon={<ChevronRight />}
            className={clsx("rounded-full!", isDesktop && "px-10")}
            onClick={onPrevious}
            isFullWidth={isMobile}
            size={isMobile ? "small" : "medium"}
          >
            مرحله قبل
          </Button>

          <Button
            leftIcon={<ChevronLeft />}
            className={clsx("rounded-full!", isDesktop && "px-10")}
            onClick={onNext}
            isFullWidth={isMobile}
            size={isMobile ? "small" : "medium"}
          >
            مرحله بعد
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ThirdStepFlow;
