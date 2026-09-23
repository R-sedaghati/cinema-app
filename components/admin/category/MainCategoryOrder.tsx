"use client";

import { Card } from "@dgshahr/ui-kit";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "react-toastify";
import {
  useAdminCategoryList,
  useAdminCategoryReorder,
} from "@/lib/services/admin/hook";
import { sortByPriority } from "@/lib/utils/sortByPriority";
import { CategoryOrderList } from "@/components/admin/page-builder/CategoryOrderList";

/** Drag-and-drop order of the main categories. Uses the admin list, so inactive
 *  categories are ordered too; saves the whole list on each drop. */
function MainCategoryOrder() {
  const queryClient = useQueryClient();
  const { data } = useAdminCategoryList();
  const { mutateAsync: reorderCategories } = useAdminCategoryReorder();

  // The just-dragged order, shown until the refetch lands; null means "trust the server".
  const [order, setOrder] = useState<number[] | null>(null);
  const [saving, setSaving] = useState(false);

  const mains = sortByPriority(
    (data?.result ?? []).filter((c) => c.parent === null),
  );
  const byId = new Map(mains.map((c) => [c.id, c]));
  const ordered = order
    ? order.map((id) => byId.get(id)).filter((c) => c !== undefined)
    : mains;

  const handleReorder = async (nextIds: number[]) => {
    setOrder(nextIds);
    setSaving(true);

    try {
      await reorderCategories({ parentId: null, ids: nextIds });
      await queryClient.invalidateQueries({ queryKey: ["categoryList"] });
      queryClient.invalidateQueries({ queryKey: ["applicationCategories"] });
      toast.success("ترتیب دسته‌بندی‌های اصلی ذخیره شد");
    } catch {
      // The admin axios interceptor already toasted — fall back to the server order.
    } finally {
      setOrder(null);
      setSaving(false);
    }
  };

  return (
    <Card className="mb-5 p-3">
      <details>
        <summary className="cursor-pointer text-sm font-medium text-gray-700">
          ترتیب دسته‌بندی‌های اصلی
        </summary>
        <p className="mb-2 mt-2 text-xs text-gray-500">
          برای تغییر ترتیب، ردیف‌ها را بکشید و رها کنید. با جابه‌جایی، خودکار ذخیره می‌شود.
        </p>
        <CategoryOrderList
          items={ordered.map((c) => ({
            id: c.id,
            faName: c.isActive ? c.faName : `${c.faName} (غیرفعال)`,
            image: c.image,
          }))}
          onReorder={handleReorder}
          isSaving={saving}
        />
      </details>
    </Card>
  );
}

export default MainCategoryOrder;
