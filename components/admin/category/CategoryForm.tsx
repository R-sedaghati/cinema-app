"use client";

import {
  useAdminCategoryCreate,
  useAdminCategoryList,
  useAdminUploadBannerImage,
} from "@/lib/services/admin/hook";
import { Button, Card, Divider, Input, Select, Switch } from "@dgshahr/ui-kit";
import FileUploader, { FileType } from "@dgshahr/ui-kit/Form/FileUploader";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

function CategoryForm() {
  const router = useRouter();

  const [faName, setFaName] = useState("");
  const [enName, setEnName] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<number | null>(null);
  const [isActive, setIsActive] = useState(true);
  const [parentId, setParentId] = useState<number | null>(null);
  const [imagePath, setImagePath] = useState("");
  const [imageFile, setImageFile] = useState<FileType | null>(null);

  const { data: parentOptionsData } = useAdminCategoryList({ count: 100 });
  const parentOptions = (parentOptionsData?.result ?? [])
    .filter((category) => category.parent === null)
    .map((category) => ({ label: category.faName, value: category.id }));

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
        priority: parentId === null ? priority : null,
        isActive,
        image: imagePath || null,
      },
      {
        onSuccess: () => {
          toast.success("با موفقیت انجام شد");
          router.push("/admin/categories");
        },
        onError: () => toast.error("خطا در ذخیره‌سازی"),
      },
    );
  };

  return (
    <>
      <div className="flex justify-start">
        <Button
          onClick={() => router.push("/admin/categories")}
          variant="text"
          color="gray"
        >
          افزودن دسته‌بندی
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
              {parentId === null && (
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
