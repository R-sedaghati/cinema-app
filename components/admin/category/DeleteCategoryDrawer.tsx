"use client";

import { Button, Drawer } from "@dgshahr/ui-kit";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useAdminCategoryDelete } from "@/lib/services/admin/hook";
import { ICategoryItem } from "@/lib/services/admin/type";
import getDrawerPosition from "@/lib/utils/getDrawerPosition";
import getDrawerWidth from "@/lib/utils/getDrawerWidth";

interface Props {
  category: ICategoryItem | null;
  /** Live subcategories of `category`; deleted along with it. */
  subcategories: ICategoryItem[];
  onClose: () => void;
  onDeleted?: () => void;
}

const DeleteCategoryDrawer = ({ category, subcategories, onClose, onDeleted }: Props) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutate, isPending } = useAdminCategoryDelete();

  if (!category) return null;

  const isMain = category.parent === null;
  const requestCount =
    category.artistRequestsCount +
    subcategories.reduce((sum, sub) => sum + sub.artistRequestsCount, 0);
  // Mirrors the server's 409 so the admin knows before clicking.
  const blocked = requestCount > 0;

  const handleDelete = () => {
    mutate(category.id, {
      onSuccess: () => {
        toast.success(
          subcategories.length
            ? `دسته‌بندی و ${subcategories.length} زیردسته حذف شدند`
            : "با موفقیت حذف شد",
        );
        queryClient.invalidateQueries({ queryKey: ["categoryList"] });
        queryClient.invalidateQueries({ queryKey: ["categoryRetrive"] });
        onClose();
        onDeleted?.();
      },
      onError: (error) => {
        const message = (error as { response?: { data?: { message?: string } } })
          .response?.data?.message;
        toast.error(message ?? "خطا در حذف دسته‌بندی");
      },
    });
  };

  return (
    <Drawer
      header={{
        title: isMain ? "حذف دسته‌بندی" : "حذف زیردسته",
        haveCloseIcon: true,
      }}
      width={getDrawerWidth(520)}
      position={getDrawerPosition()}
      open
      onClose={onClose}
    >
      <div className="flex flex-col gap-5 ss02">
        <p className="font-p1-medium">{`«${category.faName}»`}</p>

        {blocked ? (
          <div className="flex flex-col gap-3 p-3 rounded-xl bg-error-50">
            <p className="font-p2-regular text-error-700">
              {subcategories.length
                ? `این دسته‌بندی و زیردسته‌های آن روی هم ${requestCount} درخواست ثبت‌شده دارند. برای حفظ این درخواست‌ها حذف ممکن نیست؛ به‌جای حذف، دسته‌بندی را غیرفعال کنید تا در سایت نمایش داده نشود.`
                : `این ${isMain ? "دسته‌بندی" : "زیردسته"} ${requestCount} درخواست ثبت‌شده دارد. برای حفظ این درخواست‌ها حذف ممکن نیست؛ به‌جای حذف، آن را غیرفعال کنید تا در سایت نمایش داده نشود.`}
            </p>
            <Button
              variant="outline"
              color="error"
              onClick={() =>
                router.push(`/admin/artist-registration?categoryId=${category.id}`)
              }
            >
              مشاهده درخواست‌ها
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <p className="font-p2-regular text-gray-600">
              {isMain
                ? "با حذف، این دسته‌بندی از سایت و فرم ثبت‌نام هنرمندان حذف می‌شود و فرم ثبت‌نام آن دیگر قابل استفاده نیست."
                : "با حذف، این زیردسته از سایت و مرحله انتخاب زیردسته در ثبت‌نام حذف می‌شود. دسته‌بندی اصلی و فرم آن تغییری نمی‌کنند."}
            </p>
            {subcategories.length > 0 && (
              <div className="flex flex-col gap-2 p-3 rounded-xl bg-warning-50">
                <p className="font-p2-medium text-warning-700">
                  {`${subcategories.length} زیردسته این دسته‌بندی هم همراه آن حذف می‌شوند:`}
                </p>
                <ul className="flex flex-wrap gap-2">
                  {subcategories.map((sub) => (
                    <li
                      key={sub.id}
                      className="px-2 py-1 bg-white rounded-md font-p2-regular"
                    >
                      {sub.faName}
                    </li>
                  ))}
                </ul>
                <p className="font-p2-regular text-warning-700">
                  اگر می‌خواهید زیردسته‌ای باقی بماند، پیش از حذف آن را از صفحه ویرایشش به دسته‌بندی دیگری منتقل کنید.
                </p>
              </div>
            )}
          </div>
        )}

        <div className="flex gap-3">
          <Button className="flex-1" variant="outline" color="gray" onClick={onClose}>
            انصراف
          </Button>
          <Button
            className="flex-1"
            color="error"
            disabled={blocked || isPending}
            isLoading={isPending}
            onClick={handleDelete}
          >
            {subcategories.length ? `حذف ${subcategories.length + 1} مورد` : "حذف"}
          </Button>
        </div>
      </div>
    </Drawer>
  );
};

export default DeleteCategoryDrawer;
