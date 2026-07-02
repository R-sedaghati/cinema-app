"use client";

import {
  useAdminCategoryRetrieve,
  useAdminCategoryUpdate,
} from "@/lib/services/admin/hook";
import { ICategoryConfig } from "@/lib/services/admin/type";
import withNoSSR from "@/lib/utils/withNoSSR";
import {
  Button,
  Card,
  Checkbox,
  Divider,
  Input,
  Switch,
} from "@dgshahr/ui-kit";
import { ChevronRight } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

function CategoryDetail() {
  const params = useParams();
  const id = Number(params.id);
  const router = useRouter();

  const { data: retriveDate } = useAdminCategoryRetrieve(id);
  const data = retriveDate?.result;

  const { mutate, isPending } = useAdminCategoryUpdate();

  const [faName, setFaName] = useState("");
  const [priority, setPriority] = useState<number | null>(null);
  const [isActive, setIsActive] = useState(false);

  const [formFields, setFormFields] = useState<ICategoryConfig>({
    fullName: false,
    profileImage: false,
    email: false,
    province: false,
    city: false,
    address: false,
    postalCode: false,
    education: false,
    educationField: false,
    aboutMe: false,
    portfolioImage: false,
    portfolioVideo: false,
  });

  useEffect(() => {
    if (!data) return;

    setFaName(data.faName);
    setIsActive(data.isActive);
    setPriority(data.priority);

    if (data.config) {
      setFormFields({
        fullName: data.config.fullName,
        profileImage: data.config.profileImage,
        email: data.config.email,
        province: data.config.province,
        city: data.config.city,
        address: data.config.address,
        postalCode: data.config.postalCode,
        education: data.config.education,
        educationField: data.config.educationField,
        aboutMe: data.config.aboutMe,
        portfolioImage: data.config.portfolioImage,
        portfolioVideo: data.config.portfolioVideo,
      });
    }
  }, [data]);

  const handleCheckboxChange =
    (key: keyof typeof formFields) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormFields((prev) => ({
        ...prev,
        [key]: event.target.checked,
      }));
    };

  const identityFields = [
    { key: "fullName", label: "نام و نام خانوادگی" },
    { key: "profileImage", label: "بارگذاری تصویر پروفایل" },
    { key: "email", label: "ایمیل" },
    { key: "province", label: "استان" },
    { key: "city", label: "شهر" },
    { key: "address", label: "آدرس" },
    { key: "postalCode", label: "کد پستی" },
    { key: "education", label: "تحصیلات" },
    { key: "educationField", label: "رشته تحصیلی" },
  ] as const;

  const workFields = [
    { key: "aboutMe", label: "درباره من" },
    { key: "portfolioImage", label: "بارگذاری نمونه کار (عکس)" },
    { key: "portfolioVideo", label: "بارگذاری نمونه کار (ویدئو)" },
  ] as const;

  const handleSubmit = () => {
    mutate(
      {
        id,
        payload: {
          faName,
          isActive,
          config: formFields,
        },
      },
      {
        onSuccess: () => {
          toast.success("با موفقیت انجام شد");
          router.push("/admin/categories");
        },
      },
    );
  };

  return (
    <>
      <div className="flex justify-start">
        <Button
          onClick={() => router.push("/admin/categories")}
          variant="text"
          rightIcon={<ChevronRight />}
          color="gray"
        >
          {`دسته‌بندی ${data?.faName}`}
        </Button>
      </div>
      <Divider className="mb-5" color="gray" size="thin" type="horizontal" />
      <div className="flex flex-col gap-5 pt-6 px-4 h-full bg-gray-100">
        <Card>
          <div className="flex flex-col gap-4">
            <p className="font-h3-bold text-error-500">
              اطلاعات دسته‌بندی صحنه و لباس
            </p>
            <Divider
              className="mb-5"
              color="gray"
              size="thin"
              type="horizontal"
            />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
              <Input
                labelContent="نام دسته ‌بندی"
                placeholder="نام دسته ‌بندی"
                wrapperClassName="w-full"
                value={faName}
                onChange={(e) => setFaName(e.target.value)}
              />
              {!data?.parent && (
                <Input
                  labelContent="اولویت"
                  placeholder="اولویت"
                  wrapperClassName="w-full"
                  value={priority ?? ""}
                  type="number"
                  onChange={(e) =>
                    setPriority(
                      e.target.value === "" ? null : Number(e.target.value),
                    )
                  }
                />
              )}
              <div className="flex flex-col gap-3">
                <p className="font-p1-regular text-gray-500">
                  تعداد درخواست‌‌ها
                </p>
                <p className="font-p1-regular text-gray-800">
                  {data?.artistRequestsCount}
                </p>
              </div>
              <Switch
                label="وضعیت"
                checked={isActive}
                onChange={(checked) => setIsActive(checked)}
              />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex flex-col gap-5">
            <p className="font-h3-bold text-error-500">
              اطلاعات فرم دسته‌بندی صحنه و لباس
            </p>
            <Divider color="gray" size="thin" type="horizontal" />
            <p className="font-h4-bold">اطلاعات هویتی</p>
            <div className="flex flex-col gap-3 border border-solid border-gray-300 rounded-xl p-3">
              {identityFields.map((field) => (
                <Checkbox
                  key={field.key}
                  label={field.label}
                  checked={formFields[field.key]}
                  onChange={handleCheckboxChange(field.key)}
                />
              ))}
            </div>
            <p className="font-h4-bold">اطلاعات کاری</p>
            <div className="flex flex-col gap-3 border border-solid border-gray-300 rounded-xl p-3">
              {workFields.map((field) => (
                <Checkbox
                  key={field.key}
                  label={field.label}
                  checked={formFields[field.key]}
                  onChange={handleCheckboxChange(field.key)}
                />
              ))}
            </div>
            <p className="font-h4-bold">پرداخت</p>
            <div className="flex flex-col gap-3 border border-solid border-gray-300 rounded-xl p-3">
              <Input
                labelContent="مبلغ پرداختی کاربر"
                placeholder="مبلغ پرداختی کاربر"
                postfix="تومان"
                wrapperClassName="w-1/3"
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

export default withNoSSR(CategoryDetail);
