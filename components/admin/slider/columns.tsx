import { IBannerItem } from "@/lib/services/admin/type";
import { Badge, Button } from "@dgshahr/ui-kit";
import { ColumnsType } from "@dgshahr/ui-kit/Table";
import { Pencil, Trash2 } from "lucide-react";
import Image from "next/image";

export const generateColumns = (
  onEditClick: (id: number) => void,
  onDeleteClick: (id: number) => void,
): ColumnsType<IBannerItem>[] => {
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
      render: (data) => (
        <div className="relative w-16 h-10 rounded-lg overflow-hidden bg-gray-100">
          {data.image && (
            <Image src={data.image} alt={data.title} fill className="object-cover" />
          )}
        </div>
      ),
    },
    {
      align: "center",
      key: "title",
      dataIndex: "title",
      title: "عنوان",
      className: "align-middle",
      render: (data) => <p className="font-p1-regular">{data.title}</p>,
    },
    {
      align: "center",
      key: "priority",
      dataIndex: "priority",
      title: "اولویت",
      className: "align-middle",
      render: (data) => <p className="font-p1-regular">{data.priority}</p>,
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
        <div className="flex gap-3 items-center">
          <Button
            onClick={() => onEditClick(data.id)}
            variant="outline"
            color="error"
            rightIcon={<Pencil />}
          >
            ویرایش
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
