"use client";

import {
  useAdminCategoryCreate,
  useAdminCategoryList,
  useAdminUploadBannerImage,
} from "@/lib/services/admin/hook";
import { Button, Card, Divider, Select, Switch } from "@dgshahr/ui-kit";
import Input from "@/components/common/Input";
import FileUploader, { FileType } from "@dgshahr/ui-kit/Form/FileUploader";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import { toPriority } from "@/lib/utils/toEnglishDigits";

function CategoryForm() {
  const router = useRouter();
  // "افزودن زیردسته" links here with ?parentId= so the parent comes preselected.
  const presetParentId = Number(useSearchParams().get("parentId")) || null;

  const [faName, setFaName] = useState("");
  const [enName, setEnName] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<number | null>(null);
  const [isActive, setIsActive] = useState(true);
  const [parentId, setParentId] = useState<number | null>(presetParentId);
  const [imagePath, setImagePath] = useState("");
  const [imageFile, setImageFile] = useState<FileType | null>(null);
  const [contactAmount, setContactAmount] = useState("");
  const [registrationAmount, setRegistrationAmount] = useState("");

  const { data: parentOptionsData } = useAdminCategoryList();
  const mainCategories = (parentOptionsData?.result ?? []).filter(
    (category) => category.parent === null,
  );
  const parentOptions = mainCategories.map((category) => ({
    label: category.faName,
    value: category.id,
  }));
  const parentName = mainCategories.find((c) => c.id === parentId)?.faName;
  const presetParentName = mainCategories.find((c) => c.id === presetParentId)?.faName;
  const amountFallbackHint = parentId
    ? `استفاده از مبلغ دسته‌بندی اصلی${parentName ? ` «${parentName}»` : ""} و در نبودِ آن، مبلغ پیش‌فرض.`
    : "استفاده از مبلغ پیش‌فرض.";

  const { mutate: createCategory, isPending } = useAdminCategoryCreate();
  const uploadImage = useAdminUploadBannerImage();

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
    createCategory(
      {
        faName,
        enName,
        parentId,
        description,
        priority,
        isActive,
        image: imagePath || null,
        // An empty field means "not set" (inherit / fall back); a typed 0 means free.
        contactAmount: contactAmount === "" ? null : Number(contactAmount),
        registrationAmount:
          registrationAmount === "" ? null : Number(registrationAmount),
      },
      {
        onSuccess: () => {
          toast.success("با موفقیت انجام شد");
          router.push(presetParentId ? `/admin/categories/${presetParentId}` : "/admin/categories");
        },
        onError: () => toast.error("خطا در ذخیره‌سازی"),
      },
    );
  };

  return (
    <>
      <div className="flex justify-start">
        <Button
          onClick={() =>
            router.push(presetParentId ? `/admin/categories/${presetParentId}` : "/admin/categories")
          }
          variant="text"
          color="gray"
        >
          {presetParentId
            ? `افزودن زیردسته${presetParentName ? ` «${presetParentName}»` : ""}`
            : "افزودن دسته‌بندی"}
        </Button>
      </div>
      <Divider className="mb-5" color="gray" size="thin" type="horizontal" />
      <div className="flex flex-col gap-5 pt-6 px-4 h-full bg-gray-100">
        <Card>
          <div className="flex flex-col gap-4">
            <p className="font-h3-bold text-error-500">اطلاعات دسته‌بندی</p>
            <Divider className="mb-5" color="gray" size="thin" type="horizontal" />

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

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
              <Input
                labelContent="نام دسته‌ بندی (فارسی)"
                placeholder="نام دسته‌ بندی"
                wrapperClassName="w-full"
                value={faName}
                onChange={(e) => setFaName(e.target.value)}
              />
              <Input
                labelContent="نام دسته‌ بندی (انگلیسی)"
                placeholder="Category name"
                wrapperClassName="w-full"
                value={enName}
                onChange={(e) => setEnName(e.target.value)}
              />
              <Select
                mode="single"
                value={parentId}
                onChange={(value) => setParentId(value)}
                options={parentOptions}
                inputProps={{
                  labelContent: "دسته‌بندی والد",
                  placeholder: "بدون والد",
                }}
                wrapperClassName="w-full"
              />
              <Input
                labelContent="اولویت"
                placeholder="اولویت"
                wrapperClassName="w-full"
                value={priority ?? ""}
                type="text"
                inputMode="numeric"
                onChange={(e) =>
                  setPriority(
                    e.target.value === "" ? null : toPriority(e.target.value),
                  )
                }
              />
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
            {parentId !== null && (
              <p className="font-p2-regular text-gray-500">
                {`زیردسته از فرم ثبت‌نام دسته‌بندی اصلی${parentName ? ` «${parentName}»` : ""} استفاده می‌کند و ترتیب نمایش آن از دسته‌بندی اصلی پیروی می‌کند.`}
              </p>
            )}
            <p className="font-h3-bold text-error-500">پرداخت</p>
            <Divider color="gray" size="thin" type="horizontal" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                labelContent="مبلغ پرداختی کاربر"
                placeholder="مبلغ پرداختی کاربر"
                postfix="تومان"
                type="text"
                inputMode="numeric"
                value={contactAmount}
                onChange={(e) => setContactAmount(e.target.value)}
                hintMessage={`مبلغی که کاربر برای مشاهده اطلاعات تماس هنرمندان این دسته‌بندی پرداخت می‌کند. عدد ۰ یعنی رایگان؛ خالی گذاشتن یعنی ${amountFallbackHint}`}
                wrapperClassName="w-full"
              />
              <Input
                labelContent="مبلغ ثبت‌نام هنرمند"
                placeholder="مبلغ ثبت‌نام هنرمند"
                postfix="تومان"
                type="text"
                inputMode="numeric"
                value={registrationAmount}
                onChange={(e) => setRegistrationAmount(e.target.value)}
                hintMessage={`مبلغی که هنرمند برای ثبت‌نام در این دسته‌بندی پرداخت می‌کند. عدد ۰ یعنی رایگان؛ خالی گذاشتن یعنی ${amountFallbackHint}`}
                wrapperClassName="w-full"
              />
            </div>
            <div className="flex justify-end">
              <Button
                color="error"
                disabled={isPending}
                isLoading={isPending}
                onClick={handleSubmit}
              >
                ذخیره
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}

export default CategoryForm;
