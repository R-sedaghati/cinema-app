import { Asterisk, ChevronLeft, ChevronRight } from "lucide-react";
import Button from "../common/Button";
import { Card, FileUploader, RadioButton, Textarea } from "@dgshahr/ui-kit";

interface Props {
  onNext: () => void;
  onPrevious: () => void;
}

const ThirdStepFlow: React.FC<Props> = ({ onNext, onPrevious }) => {
  return (
    <Card wrapperClassName="w-3/4">
      <div className="flex flex-col gap-5">
        <Textarea
          labelContent="درباره من"
          placeholder="درباره خود بنویسید . . ."
          required
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
              onChange={function Xs() {}}
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
              onChange={function Xs() {}}
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
