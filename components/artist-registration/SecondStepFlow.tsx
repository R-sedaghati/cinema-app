import {
  Card,
  Datepicker,
  FileUploader,
  Input,
  RadioButton,
  Select,
  Textarea,
} from "@dgshahr/ui-kit";
import Button from "../common/Button";
import { Asterisk, ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  onNext: () => void;
  onPrevious: () => void;
}

const SecondStepFlow: React.FC<Props> = ({ onNext, onPrevious }) => {
  return (
    <Card wrapperClassName="w-3/4">
      <div className="flex flex-col gap-5">
        <div className="flex gap-3 items-center">
          <Input
            labelContent="نام"
            placeholder="نام خود را وارد کنید."
            required
            wrapperClassName="w-full"
          />
          <Input
            labelContent="نام خانوادگی"
            placeholder="نام خانوادگی خود را وارد کنید."
            required
            wrapperClassName="w-full"
          />
        </div>
        <FileUploader
          fileInputProps={{
            className: "dgsuikit:ss02",
            description: "فرمت‌های قابل قبول JPG , PNG\nحداکثر حجم تا 5Mb",
            title: "بارگذاری تصویر پروفایل",
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
        <div className="flex gap-3 items-center">
          <Datepicker
            //   customInput={() => <MgcIcon
            //     name="pencil_line"
            //     className="text-primary-500 border rounded-lg p-1"
            //     size={24}
            //     isButtonIcon
            //   />
            //   }
            inputProps={{
              labelContent: "تاریخ تولد",
              placeholder: "تاریخ تولد خود را انتخاب کنید",
              required: true,
            }}
            dropdownType="drawer"
            showSubmitButton
            drawerProps={{
              width: "435px",
              position: "center",
              maskClassName: "!z-[99999999]",
              header: {
                title: "انتخاب تاریخ تولد",
                haveCloseIcon: true,
              },
            }}
            wrapperClassName="w-1/2"
            value={null}
            onChange={() => {}}
            //   onSubmit={() => handleSubmitGuarantorInfoChanges()}
            //   value={
            //     formData.shamsi_birth_date
            //       ? moment(
            //         formData.shamsi_birth_date,
            //         'jYYYY/jMM/jDD'
            //       ).toDate()
            //       : new Date()
            //   }
            //   onChange={(dt) =>
            //     setFormData((prev) => ({
            //       ...prev,
            //       shamsi_birth_date:
            //         convertFaNumericStringToEnNumericString(
            //           dt.toLocaleDateString('fa-IR', {
            //             year: 'numeric',
            //             month: '2-digit',
            //             day: '2-digit',
            //           })
            //         ),
            //     }))
            //   }
            //   disabled={isPending || isLoading}
          />
          <div className="flex flex-col gap-2">
            <div className="flex gap-1">
              <p className="font-p2-medium">جنسیت</p>
              <Asterisk size={12} className="text-error-500" />
            </div>
            <div className="flex gap-5">
              <RadioButton label="مرد" name="gender" />
              <RadioButton label="زن" name="gender" />
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <Input
            labelContent="قد"
            placeholder="قد خود را وارد کنید."
            postfix="سانتی متر"
            wrapperClassName="w-full"
            required
          />
          <Input
            labelContent="وزن"
            placeholder="وزن خود را وارد کنید."
            postfix="کیلوگرم"
            wrapperClassName="w-full"
            required
          />
        </div>
        <Input
          labelContent="زبان و گویش"
          placeholder="زبان و گویش خود را وارد کنید."
          required
          wrapperClassName="w-1/2"
        />
        <Input
          labelContent="ایمیل"
          placeholder="ایمیل خود را وارد کنید."
          required
          wrapperClassName="w-1/2"
        />
        <div className="flex gap-3">
          <Select
            inputProps={{
              labelContent: "استان",
              placeholder: "استان خود را انتخاب کنید",
              required: true,
            }}
            value={null}
            options={[]}
            wrapperClassName="w-full"
            onChange={() => {}}
            mode="single"
          />
          <Select
            inputProps={{
              labelContent: "شهر",
              placeholder: "شهر خود را انتخاب کنید",
              required: true,
            }}
            value={null}
            options={[]}
            wrapperClassName="w-full"
            onChange={() => {}}
            mode="single"
          />
        </div>
        <Textarea
          labelContent="آدرس"
          placeholder="پیام تفصیلی خود را بنویسید . . ."
        />
        <Input
          labelContent="کد پستی"
          placeholder="کد پستی خود را وارد کنید."
          required
          wrapperClassName="w-1/2"
        />
        <div className="flex gap-3">
          <Select
            inputProps={{
              labelContent: "تحصیلات",
              placeholder: "تحصیلات خود را انتخاب کنید",
              required: true,
            }}
            value={null}
            wrapperClassName="w-full"
            options={[]}
            onChange={() => {}}
            mode="single"
          />
          <Input
            labelContent="رشته تحصیلی"
            placeholder="رشته تحصیلی خود را وارد کنید."
            required
            wrapperClassName="w-full"
          />
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

export default SecondStepFlow;
