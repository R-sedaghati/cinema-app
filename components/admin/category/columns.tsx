/* eslint-disable @next/next/no-img-element */
import { CategoryRow } from "@/lib/utils/categoryTree";
import { Badge, Button, Switch } from "@dgshahr/ui-kit";
import { ColumnsType } from "@dgshahr/ui-kit/Table";
import { ChevronDown, ChevronLeft, CornerDownLeft, Pencil, Plus, Trash2 } from "lucide-react";

interface Handlers {
  isExpanded: (id: number) => boolean;
  onToggleExpand: (id: number) => void;
  onToggleActive: (row: CategoryRow) => void;
  togglingId: number | null;
  onEditClick: (id: number) => void;
  onAddChildClick: (id: number) => void;
  onRequestClick: (id: number) => void;
  onDeleteClick: (id: number) => void;
}

export const generateColumns = ({
  isExpanded,
  onToggleExpand,
  onToggleActive,
  togglingId,
  onEditClick,
  onAddChildClick,
  onRequestClick,
  onDeleteClick,
}: Handlers): ColumnsType<CategoryRow>[] => {
  return [
    {
      align: "start",
      key: "category",
      dataIndex: "category",
      title: "دسته‌بندی",
      className: "align-middle",
      render: (data) => (
        <div className={`flex gap-3 items-center ${data.depth ? "pr-8" : ""}`}>
          {data.depth ? (
            <CornerDownLeft className="w-4 h-4 text-gray-400 shrink-0" />
          ) : data.childCount > 0 ? (
            <button
              type="button"
              onClick={() => onToggleExpand(data.id)}
              aria-expanded={isExpanded(data.id)}
              aria-label={isExpanded(data.id) ? "بستن زیردسته‌ها" : "نمایش زیردسته‌ها"}
              className="flex justify-center items-center w-6 h-6 rounded-md shrink-0 hover:bg-gray-100"
            >
              <ChevronDown
                className={`w-4 h-4 transition-transform ${isExpanded(data.id) ? "" : "rotate-90"}`}
              />
            </button>
          ) : (
            <span className="w-6 shrink-0" />
          )}
          {data.image ? (
            <img
              src={data.image}
              alt={data.faName}
              width={40}
              height={40}
              className="object-cover w-10 h-10 rounded-md shrink-0"
            />
          ) : (
            <div className="w-10 h-10 bg-gray-100 rounded-md shrink-0" />
          )}
          <div className="flex flex-col gap-1">
            <p className={data.depth ? "font-p1-regular" : "font-p1-bold"}>
              {data.faName}
            </p>
            {data.depth === 0 && data.childCount > 0 && (
              <p className="text-gray-500 font-p3-regular">
                {`${data.childCount} زیردسته`}
              </p>
            )}
          </div>
        </div>
      ),
    },
    {
      align: "center",
      key: "description",
      dataIndex: "description",
      title: "توضیحات",
      className: "align-middle",
      render: (data) => (
        <p className="font-p1-regular truncate max-w-60">
          {data.description || "-"}
        </p>
      ),
    },
    {
      align: "center",
      key: "requestCount",
      dataIndex: "requestCount",
      title: "تعداد درخواست‌ها",
      className: "align-middle",
      render: (data) => (
        <Badge type="twoTone" color="error" value={data.artistRequestsCount} />
      ),
    },
    {
      align: "center",
      key: "status",
      dataIndex: "status",
      title: "وضعیت",
      className: "align-middle",
      render: (data) => (
        <div className="flex gap-2 justify-center items-center">
          <Switch
            checked={data.isActive}
            disabled={togglingId === data.id}
            onChange={() => onToggleActive(data)}
          />
          <p className="text-gray-500 font-p2-regular">
            {data.isActive ? "فعال" : "غیرفعال"}
          </p>
        </div>
      ),
    },
    {
      align: "center",
      key: "actions",
      dataIndex: "actions",
      title: "عملیات",
      className: "align-middle max-w-36",
      render: (data) => (
        <div className="flex flex-col gap-1 items-start">
          <Button
            onClick={() => onEditClick(data.id)}
            variant="text"
            leftIcon={<Pencil />}
            color="error"
          >
            ویرایش
          </Button>
          {data.depth === 0 && data.parent === null && (
            <Button
              onClick={() => onAddChildClick(data.id)}
              variant="text"
              leftIcon={<Plus />}
              color="error"
            >
              افزودن زیردسته
            </Button>
          )}
          <Button
            onClick={() => onRequestClick(data.id)}
            variant="text"
            leftIcon={<ChevronLeft />}
            color="error"
          >
            مشاهده درخواست‌ها
          </Button>
          <Button
            onClick={() => onDeleteClick(data.id)}
            variant="text"
            leftIcon={<Trash2 />}
            color="error"
          >
            حذف
          </Button>
        </div>
      ),
    },
  ];
};
