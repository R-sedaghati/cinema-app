"use client";

import {
  useAdminCategoryRetrieve,
  useAdminCategoryUpdate,
  useAdminUploadBannerImage,
} from "@/lib/services/admin/hook";
import withNoSSR from "@/lib/utils/withNoSSR";
import {
  Button,
  Card,
  Divider,
  Input,
  Switch,
} from "@dgshahr/ui-kit";
import FileUploader, { FileType } from "@dgshahr/ui-kit/Form/FileUploader";
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

  // A subcategory borrows its parent's form and price fallbacks, so the parent is
  // named wherever we explain that inheritance.
  const { data: parentData } = useAdminCategoryRetrieve(data?.parent ?? undefined);
  const parentName = parentData?.result?.faName;

  const { mutate, isPending } = useAdminCategoryUpdate();

  const [faName, setFaName] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<number | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [imagePath, setImagePath] = useState("");
  const [imageFile, setImageFile] = useState<FileType | null>(null);
  const [contactAmount, setContactAmount] = useState<string>("");
  const [registrationAmount, setRegistrationAmount] = useState<string>("");

  const uploadImage = useAdminUploadBannerImage();

  useEffect(() => {
    if (!data) return;

    setFaName(data.faName);
    setDescription(data.description ?? "");
    setIsActive(data.isActive);
    setPriority(data.priority);
    setImagePath(data.image ?? "");
    setImageFile(data.image ? { src: data.image } : null);
    setContactAmount(
      data.contactAmount === null || data.contactAmount === undefined
        ? ""
        : String(data.contactAmount),
    );
    setRegistrationAmount(
      data.registrationAmount === null || data.registrationAmount === undefined
        ? ""
        : String(data.registrationAmount),
    );
  }, [data]);

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

  const amountFallbackHint = data?.parent
    ? `استفاده از مبلغ دسته‌بندی اصلی${parentName ? ` «${parentName}»` : ""} و در نبودِ آن، مبلغ پیش‌فرض.`
    : "استفاده از مبلغ پیش‌فرض.";

  const handleSubmit = () => {
    mutate(
      {
        id,
        payload: {
          faName,
          isActive,
          description,
          priority,
          image: imagePath || null,
          // An empty field means "not set" (inherit / fall back); a typed 0 means free.
          contactAmount: contactAmount === "" ? null : Number(contactAmount),
          registrationAmount:
            registrationAmount === "" ? null : Number(registrationAmount),
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
              {`اطلاعات دسته‌بندی ${data?.faName ?? ""}`}
            </p>
            <Divider
              className="mb-5"
              color="gray"
              size="thin"
              type="horizontal"
            />
            <FileUploader
              fileInputProps={{
                className: "w-full md:w-1/3",
                title: "بارگذاری تصویر دسته‌بندی",
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
            {data?.parent ? (
              <p className="font-p2-regular text-gray-500">
                {`زیر‌دسته${parentName ? ` «${parentName}»` : " یک دسته‌بندی اصلی"} است؛ ترتیب نمایش آن از دسته‌بندی اصلی پیروی می‌کند و اولویت جداگانه‌ای ندارد.`}
              </p>
            ) : null}
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
              <Input
                labelContent="توضیحات"
                placeholder="توضیحات"
                wrapperClassName="w-full md:col-span-3"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <p className="font-h3-bold text-error-500">فرم ثبت‌نام دسته‌بندی</p>
              <Button
                color="error"
                variant="outline"
                onClick={() =>
                  router.push(
                    `/admin/categories/${data?.parent ?? id}/form-builder`,
                  )
                }
              >
                {data?.parent ? "مدیریت فرم دسته‌بندی اصلی" : "مدیریت فرم"}
              </Button>
            </div>
            <Divider color="gray" size="thin" type="horizontal" />
            <p className="font-p2-regular text-gray-500">
              {data?.parent
                ? `این زیر‌دسته فرم اختصاصی ندارد و از فرم دسته‌بندی اصلی${
                    parentName ? ` «${parentName}»` : ""
                  } استفاده می‌کند. تغییر مراحل و فیلدها از همان‌جا انجام می‌شود و روی همه زیر‌دسته‌ها اثر می‌گذارد.`
                : "مراحل و فیلدهای فرم ثبت‌نام این دسته‌بندی از صفحه مدیریت فرم قابل تعریف است."}
            </p>
          </div>
        </Card>
        <Card>
          <div className="flex flex-col gap-5">
            <p className="font-h3-bold text-error-500">پرداخت</p>
            <Divider color="gray" size="thin" type="horizontal" />
            <div className="flex flex-col gap-3 border border-solid border-gray-300 rounded-xl p-3">
              <Input
                labelContent="مبلغ پرداختی کاربر"
                placeholder="مبلغ پرداختی کاربر"
                postfix="تومان"
                type="number"
                value={contactAmount}
                onChange={(e) => setContactAmount(e.target.value)}
                hintMessage={`مبلغی که کاربر برای مشاهده اطلاعات تماس هنرمندان این دسته‌بندی پرداخت می‌کند. عدد ۰ یعنی رایگان؛ خالی گذاشتن یعنی ${amountFallbackHint}`}
                wrapperClassName="w-1/3"
              />
              <Input
                labelContent="مبلغ ثبت‌نام هنرمند"
                placeholder="مبلغ ثبت‌نام هنرمند"
                postfix="تومان"
                type="number"
                value={registrationAmount}
                onChange={(e) => setRegistrationAmount(e.target.value)}
                hintMessage={`مبلغی که هنرمند برای ثبت‌نام در این دسته‌بندی پرداخت می‌کند. عدد ۰ یعنی رایگان؛ خالی گذاشتن یعنی ${amountFallbackHint}`}
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
