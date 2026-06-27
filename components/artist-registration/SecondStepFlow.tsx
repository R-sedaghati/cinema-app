"use client";

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
import { useArtistRegistrationStore } from "@/lib/stores/useUserArtist";
import {
  useUserCityList,
  useUserProvinceList,
  useUserUploadAvatar,
} from "@/lib/services/landing/hook";
import { useState } from "react";

interface Props {
  onNext: () => void;
  onPrevious: () => void;
}

const EDUCATION_OPTIONS = [
  { label: "زیر دیپلم", value: "زیر دیپلم" },
  { label: "دیپلم", value: "دیپلم" },
  { label: "فوق دیپلم", value: "فوق دیپلم" },
  { label: "کارشناسی", value: "کارشناسی" },
  { label: "کارشناسی ارشد", value: "کارشناسی ارشد" },
  { label: "دکترا", value: "دکترا" },
];

const SecondStepFlow: React.FC<Props> = ({ onNext, onPrevious }) => {
  const store = useArtistRegistrationStore();
  const [selectedProvinceId, setSelectedProvinceId] = useState(0);

  const { data: provincesData } = useUserProvinceList(undefined);
  const { data: citiesData } = useUserCityList(selectedProvinceId);
  const uploadAvatar = useUserUploadAvatar();

  const provinceOptions =
    provincesData?.result?.map((p) => ({ label: p.name, value: p.name })) ??
    [];
  const cityOptions =
    citiesData?.result?.map((c) => ({ label: c.name, value: c.name })) ?? [];

  const handleAvatarChange = (file: File | undefined) => {
    if (!file) return;
    uploadAvatar.mutate(file, {
      onSuccess: (res) => store.setField("avatar", res.path),
    });
  };

  return (
    <Card wrapperClassName="w-3/4">
      <div className="flex flex-col gap-5">
        <div className="flex gap-3 items-center">
          <Input
            labelContent="نام"
            placeholder="نام خود را وارد کنید."
            required
            wrapperClassName="w-full"
            value={store.firstName}
            onChange={(e) => store.setField("firstName", e.target.value)}
          />
          <Input
            labelContent="نام خانوادگی"
            placeholder="نام خانوادگی خود را وارد کنید."
            required
            wrapperClassName="w-full"
            value={store.lastName}
            onChange={(e) => store.setField("lastName", e.target.value)}
          />
        </div>
        <FileUploader
          fileInputProps={{
            className: "dgsuikit:ss02",
            description: "فرمت‌های قابل قبول JPG , PNG\nحداکثر حجم تا 5Mb",
            title: "بارگذاری تصویر پروفایل",
          }}
          onChange={handleAvatarChange}
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
            value={store.birthDate ? new Date(store.birthDate) : null}
            onChange={(dt) =>
              store.setField("birthDate", dt ? dt.toISOString() : "")
            }
          />
          <div className="flex flex-col gap-2">
            <div className="flex gap-1">
              <p className="font-p2-medium">جنسیت</p>
              <Asterisk size={12} className="text-error-500" />
            </div>
            <div className="flex gap-5">
              <RadioButton
                label="مرد"
                name="gender"
                checked={store.gender === "MAN"}
                onChange={() => store.setField("gender", "MAN")}
              />
              <RadioButton
                label="زن"
                name="gender"
                checked={store.gender === "WOMAN"}
                onChange={() => store.setField("gender", "WOMAN")}
              />
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
            value={store.height ?? ""}
            onChange={(e) =>
              store.setField(
                "height",
                e.target.value ? Number(e.target.value) : null,
              )
            }
          />
          <Input
            labelContent="وزن"
            placeholder="وزن خود را وارد کنید."
            postfix="کیلوگرم"
            wrapperClassName="w-full"
            required
            value={store.weight ?? ""}
            onChange={(e) =>
              store.setField(
                "weight",
                e.target.value ? Number(e.target.value) : null,
              )
            }
          />
        </div>
        <Input
          labelContent="زبان و گویش"
          placeholder="زبان و گویش خود را وارد کنید."
          required
          wrapperClassName="w-1/2"
          value={store.language}
          onChange={(e) => store.setField("language", e.target.value)}
        />
        <Input
          labelContent="ایمیل"
          placeholder="ایمیل خود را وارد کنید."
          required
          wrapperClassName="w-1/2"
          value={store.email}
          onChange={(e) => store.setField("email", e.target.value)}
        />
        <div className="flex gap-3">
          <Select
            inputProps={{
              labelContent: "استان",
              placeholder: "استان خود را انتخاب کنید",
              required: true,
            }}
            value={store.province || null}
            options={provinceOptions}
            wrapperClassName="w-full"
            onChange={(selected) => {
              store.setField("province", selected ?? "");
              store.setField("city", "");
              const found = provincesData?.result?.find(
                (p) => p.name === selected,
              );
              setSelectedProvinceId(found?.id ?? 0);
            }}
            mode="single"
          />
          <Select
            inputProps={{
              labelContent: "شهر",
              placeholder: "شهر خود را انتخاب کنید",
              required: true,
            }}
            value={store.city || null}
            options={cityOptions}
            wrapperClassName="w-full"
            onChange={(selected) => {
              store.setField("city", selected ?? "");
            }}
            mode="single"
          />
        </div>
        <Textarea
          labelContent="آدرس"
          placeholder="پیام تفصیلی خود را بنویسید . . ."
          value={store.address}
          onChange={(e) => store.setField("address", e.target.value)}
        />
        <Input
          labelContent="کد پستی"
          placeholder="کد پستی خود را وارد کنید."
          required
          wrapperClassName="w-1/2"
          value={store.postalCode}
          onChange={(e) => store.setField("postalCode", e.target.value)}
        />
        <div className="flex gap-3">
          <Select
            inputProps={{
              labelContent: "تحصیلات",
              placeholder: "تحصیلات خود را انتخاب کنید",
              required: true,
            }}
            value={store.education || null}
            wrapperClassName="w-full"
            options={EDUCATION_OPTIONS}
            onChange={(selected) => {
              store.setField("education", selected ?? "");
            }}
            mode="single"
          />
          <Input
            labelContent="رشته تحصیلی"
            placeholder="رشته تحصیلی خود را وارد کنید."
            required
            wrapperClassName="w-full"
            value={store.major}
            onChange={(e) => store.setField("major", e.target.value)}
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
