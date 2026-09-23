"use client";

/* eslint-disable @next/next/no-img-element */
import {
  useAdminCategoryList,
  useAdminCategoryReorder,
  useAdminCategoryRetrieve,
  useAdminCategoryUpdate,
  useAdminUploadBannerImage,
} from "@/lib/services/admin/hook";
import withNoSSR from "@/lib/utils/withNoSSR";
import { toStoragePath } from "@/lib/utils/toStoragePath";
import { sortByPriority } from "@/lib/utils/sortByPriority";
import { toPriority } from "@/lib/utils/toEnglishDigits";
import { moved } from "@/components/admin/page-builder/CategoryOrderList";
import { Badge, Button, Card, Divider, Select, Switch } from "@dgshahr/ui-kit";
import Input from "@/components/common/Input";
import FileUploader, { FileType } from "@dgshahr/ui-kit/Form/FileUploader";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  GripVertical,
  Plus,
  Trash2,
} from "lucide-react";
import DeleteCategoryDrawer from "@/components/admin/category/DeleteCategoryDrawer";
import { ICategoryItem } from "@/lib/services/admin/type";
import { useParams, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

function CategoryDetail() {
  const params = useParams();
  const id = Number(params.id);
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: retriveDate } = useAdminCategoryRetrieve(id);
  const data = retriveDate?.result;

  const { data: listData } = useAdminCategoryList();
  const categories = listData?.result ?? [];
  const siblings = sortByPriority(categories.filter((c) => c.parent === id));

  /** Ids in the order just dragged into; `null` = trust the server. */
  const [subOrder, setSubOrder] = useState<number[] | null>(null);
  const [savingOrder, setSavingOrder] = useState(false);
  const [dragging, setDragging] = useState<number | null>(null);
  const [dropIndex, setDropIndex] = useState<number | null>(null);

  const subcategories = subOrder
    ? [
        ...subOrder
          .map((subId) => siblings.find((c) => c.id === subId))
          .filter((c) => c !== undefined),
        // A subcategory added elsewhere mid-drag isn't in `subOrder` — keep it, at the end.
        ...siblings.filter((c) => !subOrder.includes(c.id)),
      ]
    : siblings;
  const parentOptions = categories
    .filter((c) => c.parent === null && c.id !== id)
    .map((c) => ({ label: c.faName, value: c.id }));
  const nameOf = (categoryId: number | null | undefined) =>
    categories.find((c) => c.id === categoryId)?.faName;

  const { mutate, isPending } = useAdminCategoryUpdate();

  const [deleteTarget, setDeleteTarget] = useState<ICategoryItem | null>(null);
  const [parentId, setParentId] = useState<number | null>(null);
  const [enName, setEnName] = useState("");
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
    setEnName(data.enName ?? "");
    setParentId(data.parent);
    setDescription(data.description ?? "");
    setIsActive(data.isActive);
    setPriority(data.priority);
    setImagePath(toStoragePath(data.image ?? ""));
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

  // A subcategory borrows its parent's form and price fallbacks, so the parent is
  // named wherever we explain that inheritance. `parentName` follows the unsaved
  // selection; the form card still points at the saved parent.
  const parentName = nameOf(parentId);
  const savedParentName = nameOf(data?.parent);
  const parentChanged = data !== undefined && parentId !== data.parent;
  const hasSubcategories = subcategories.length > 0;

  const amountFallbackHint = parentId
    ? `استفاده از مبلغ دسته‌بندی اصلی${parentName ? ` «${parentName}»` : ""} و در نبودِ آن، مبلغ پیش‌فرض.`
    : "استفاده از مبلغ پیش‌فرض.";

  const { mutateAsync: reorderCategories } = useAdminCategoryReorder();

  /** Sends the whole subcategory list in one call — the server sets `priority` to each
   *  id's 1-based position. One request per drag, never one per row: the single-category PATCH
   *  shifts the siblings around the moved row, which only lands right for one move. */
  const reorderSubcategories = async (nextIds: number[]) => {
    setSubOrder(nextIds);
    setSavingOrder(true);

    try {
      await reorderCategories({ parentId: id, ids: nextIds });
      await queryClient.invalidateQueries({ queryKey: ["categoryList"] });
      queryClient.invalidateQueries({ queryKey: ["applicationCategories"] });
      setSubOrder(null);
      toast.success("ترتیب زیردسته‌ها ذخیره شد");
    } catch {
      // The admin axios interceptor already toasted — fall back to the server order.
      setSubOrder(null);
    } finally {
      setSavingOrder(false);
    }
  };

  const moveSub = (fromId: number, to: number) => {
    const from = subcategories.findIndex((c) => c.id === fromId);
    if (from === -1 || from === to || from + 1 === to) return;
    reorderSubcategories(moved(subcategories, from, to).map((c) => c.id));
  };

  // Arrow buttons are the keyboard path to the same action; `to` follows the drop-index
  // convention in `moved`, hence the +2 when moving down.
  const nudgeSub = (index: number, direction: "up" | "down") =>
    reorderSubcategories(
      moved(
        subcategories,
        index,
        direction === "up" ? index - 1 : index + 2,
      ).map((c) => c.id),
    );

  const handleSubmit = () => {
    mutate(
      {
        id,
        payload: {
          faName,
          enName,
          isActive,
          description,
          ...(parentChanged && { parentId }),
          // Only a changed priority moves the row; saving other fields leaves the order alone.
          ...(priority !== data?.priority && { priority }),
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
          queryClient.invalidateQueries({ queryKey: ["categoryList"] });
          queryClient.invalidateQueries({ queryKey: ["categoryRetrive"] });
          router.push("/admin/categories");
        },
        onError: (error) => {
          const message = (error as { response?: { data?: { message?: string } } })
            .response?.data?.message;
          toast.error(message ?? "خطا در ذخیره‌سازی");
        },
      },
    );
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <Button
          onClick={() => router.push("/admin/categories")}
          variant="text"
          rightIcon={<ChevronRight />}
          color="gray"
        >
          {`دسته‌بندی ${data?.faName}`}
        </Button>
        {data && (
          <Button
            onClick={() => setDeleteTarget(data)}
            variant="text"
            leftIcon={<Trash2 />}
            color="error"
          >
            {data.parent === null ? "حذف دسته‌بندی" : "حذف زیردسته"}
          </Button>
        )}
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
            {parentId ? (
              <p className="font-p2-regular text-gray-500">
                {`زیر‌دسته${parentName ? ` «${parentName}»` : " یک دسته‌بندی اصلی"} است؛ «اولویت» آن فقط ترتیبش میان زیردسته‌های همان دسته‌بندی اصلی را تعیین می‌کند.`}
              </p>
            ) : null}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
              <Input
                labelContent="نام دسته ‌بندی (فارسی)"
                placeholder="نام دسته ‌بندی"
                wrapperClassName="w-full"
                value={faName}
                onChange={(e) => setFaName(e.target.value)}
              />
              <Input
                labelContent="نام دسته ‌بندی (انگلیسی)"
                placeholder="Category name"
                wrapperClassName="w-full"
                value={enName}
                onChange={(e) => setEnName(e.target.value)}
              />
              <Select
                mode="single"
                value={parentId}
                // Clicking the selected option again clears it → main category.
                onChange={(value) => setParentId(value === parentId ? null : value)}
                options={parentOptions}
                disabled={hasSubcategories}
                inputProps={{
                  labelContent: "دسته‌بندی والد",
                  placeholder: "بدون والد (دسته اصلی)",
                  hintMessage: hasSubcategories
                    ? "این دسته‌بندی زیردسته دارد و نمی‌تواند زیردسته دسته‌ای دیگر شود."
                    : undefined,
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
                // Category positions are 1-based; 0 / invalid input clears the field.
                onChange={(e) => setPriority(toPriority(e.target.value) || null)}
              />
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
            {parentChanged && (
              <p className="p-3 rounded-xl font-p2-regular text-warning-700 bg-warning-50">
                {parentId === null
                  ? "با ذخیره، این زیردسته به دسته‌بندی اصلی تبدیل می‌شود و تا تعریف فرم ثبت‌نام اختصاصی، فرمی نخواهد داشت. مبالغ خالی از مبلغ پیش‌فرض استفاده می‌کنند."
                  : `با ذخیره، این دسته‌بندی زیردسته «${parentName ?? ""}» می‌شود و از فرم ثبت‌نام و مبالغ پیش‌فرض آن استفاده می‌کند.`}
              </p>
            )}
          </div>
        </Card>
        {data && data.parent === null && (
          <Card>
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <div className="flex flex-col gap-1">
                  <p className="font-h3-bold text-error-500">
                    {`زیردسته‌ها (${subcategories.length})`}
                  </p>
                  {subcategories.length > 1 && (
                    <p className="font-p3-regular text-gray-500">
                      ترتیب نمایش زیردسته‌ها در فرم ثبت‌نام. با جابه‌جایی، خودکار
                      ذخیره می‌شود.
                    </p>
                  )}
                </div>
                <Button
                  color="error"
                  variant="outline"
                  leftIcon={<Plus />}
                  onClick={() => router.push(`/admin/categories/new?parentId=${id}`)}
                >
                  افزودن زیردسته
                </Button>
              </div>
              <Divider color="gray" size="thin" type="horizontal" />
              {hasSubcategories ? (
                <ul className="flex flex-col divide-y divide-gray-200">
                  {subcategories.map((sub, index) => (
                    <li
                      key={sub.id}
                      draggable={dragging === sub.id}
                      onDragOver={(e) => {
                        if (dragging === null) return;
                        e.preventDefault();
                        const box = e.currentTarget.getBoundingClientRect();
                        setDropIndex(
                          e.clientY < box.top + box.height / 2 ? index : index + 1,
                        );
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        if (dragging !== null && dropIndex !== null)
                          moveSub(dragging, dropIndex);
                        setDragging(null);
                        setDropIndex(null);
                      }}
                      onDragEnd={() => {
                        setDragging(null);
                        setDropIndex(null);
                      }}
                      className={`flex gap-2 items-center ${
                        dropIndex === index ? "border-t-2 border-t-error-500" : ""
                      } ${savingOrder ? "opacity-60" : ""}`}
                    >
                      <button
                        type="button"
                        aria-label={`جابه‌جایی ${sub.faName}`}
                        className="text-gray-400 cursor-grab shrink-0"
                        onMouseDown={() => setDragging(sub.id)}
                        onMouseUp={() => setDragging(null)}
                      >
                        <GripVertical className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => router.push(`/admin/categories/${sub.id}`)}
                        className="flex gap-3 items-center py-3 w-full text-right rounded-md hover:bg-gray-50"
                      >
                        {sub.image ? (
                          <img
                            src={sub.image}
                            alt={sub.faName}
                            className="object-cover w-10 h-10 rounded-md shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gray-100 rounded-md shrink-0" />
                        )}
                        <p className="flex-1 font-p1-medium">{sub.faName}</p>
                        <p className="text-gray-500 font-p2-regular">
                          {`${sub.artistRequestsCount} درخواست`}
                        </p>
                        <Badge
                          type="twoTone"
                          color={sub.isActive ? "success" : "error"}
                          value={sub.isActive ? "فعال" : "غیرفعال"}
                        />
                        <ChevronLeft className="w-4 h-4 text-gray-400" />
                      </button>
                      <button
                        type="button"
                        aria-label={`جابه‌جایی ${sub.faName} به بالا`}
                        disabled={index === 0 || savingOrder}
                        onClick={() => nudgeSub(index, "up")}
                        className="flex justify-center items-center w-9 h-9 text-gray-500 rounded-md shrink-0 hover:bg-gray-50 disabled:opacity-30"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        aria-label={`جابه‌جایی ${sub.faName} به پایین`}
                        disabled={index === subcategories.length - 1 || savingOrder}
                        onClick={() => nudgeSub(index, "down")}
                        className="flex justify-center items-center w-9 h-9 text-gray-500 rounded-md shrink-0 hover:bg-gray-50 disabled:opacity-30"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(sub)}
                        aria-label={`حذف زیردسته ${sub.faName}`}
                        className="flex justify-center items-center w-9 h-9 rounded-md text-error-500 shrink-0 hover:bg-error-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="font-p2-regular text-gray-500">
                  این دسته‌بندی هنوز زیردسته‌ای ندارد.
                </p>
              )}
            </div>
          </Card>
        )}
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
                    savedParentName ? ` «${savedParentName}»` : ""
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
                type="text"
                inputMode="numeric"
                value={contactAmount}
                onChange={(e) => setContactAmount(e.target.value)}
                hintMessage={`مبلغی که کاربر برای مشاهده اطلاعات تماس هنرمندان این دسته‌بندی پرداخت می‌کند. عدد ۰ یعنی رایگان؛ خالی گذاشتن یعنی ${amountFallbackHint}`}
                wrapperClassName="w-1/3"
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
      <DeleteCategoryDrawer
        category={deleteTarget}
        subcategories={categories.filter((c) => c.parent === deleteTarget?.id)}
        onClose={() => setDeleteTarget(null)}
        onDeleted={() => {
          // Deleting the page's own category leaves nothing to edit here.
          if (deleteTarget?.id === id) router.push("/admin/categories");
        }}
      />
    </>
  );
}

export default withNoSSR(CategoryDetail);
