import { ICategoryItem } from "@/lib/services/admin/type";
import { Badge, Button } from "@dgshahr/ui-kit";
import { ColumnsType } from "@dgshahr/ui-kit/Table";
import { ChevronLeft, Pencil, Trash2 } from "lucide-react";
import Image from "next/image";

export const generateColumns = (
  onProfileClick: (id: number) => void,
  onRequestClick: (id: number) => void,
  onDeleteClick: (id: number) => void,
): ColumnsType<ICategoryItem>[] => {
  return [
    {
      align: "start",
      key: "id",
      dataIndex: "id",
      title: "ردیف",
      className: "align-middle",
      render: (data) => data.id && <p className="font-p1-regular">{data.id}</p>,
    },
    {
      align: "center",
      key: "image",
      dataIndex: "image",
      title: "تصویر",
      className: "align-middle",
      render: (data) =>
        data.image ? (
          <Image
            src={data.image}
            alt={data.faName}
            width={40}
            height={40}
            className="rounded-md object-cover w-10 h-10"
          />
        ) : (
          <p className="font-p1-regular text-gray-400">-</p>
        ),
    },
    {
      align: "center",
      key: "category",
      dataIndex: "category",
      title: "دسته‌بندی",
      className: "align-middle",
      render: (data) => <p className="font-p1-regular">{data.faName}</p>,
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
      render: (data) =>
        data.isActive ? (
          <Badge value={"فعال"} type="twoTone" color="success" />
        ) : (
          <Badge value={"غیرفعال"} type="twoTone" color="error" />
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
            onClick={() => onProfileClick(data.id)}
            variant="text"
            leftIcon={<Pencil />}
            color="error"
          >
            ویرایش
          </Button>
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
