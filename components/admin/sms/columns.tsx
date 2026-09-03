import { SMS_EVENT } from "@/lib/constants/sms/events";
import { ISmsTemplate } from "@/lib/services/admin/type";
import convertGregorianTimeToShamsiTime from "@/lib/utils/convertGregorianTimeToShamsiTime";
import { Badge, Button, Switch } from "@dgshahr/ui-kit";
import { ColumnsType } from "@dgshahr/ui-kit/Table";
import { Pencil } from "lucide-react";

export const generateColumns = (
  onEditClick: (template: ISmsTemplate) => void,
  onToggle: (template: ISmsTemplate) => void,
  togglingEvent: string | null,
): ColumnsType<ISmsTemplate>[] => {
  return [
    {
      align: "start",
      key: "event",
      dataIndex: "event",
      title: "رویداد",
      className: "align-middle",
      render: (data) => (
        <div className="flex flex-col gap-1 max-w-64">
          <p className="font-p1-medium">{SMS_EVENT[data.event]?.label ?? data.event}</p>
          <p className="font-p2-regular text-gray-500">
            {SMS_EVENT[data.event]?.description}
          </p>
        </div>
      ),
    },
    {
      align: "start",
      key: "body",
      dataIndex: "body",
      title: "متن پیامک",
      className: "align-middle",
      render: (data) => (
        <p className="font-p1-regular line-clamp-2 max-w-96 whitespace-pre-wrap">
          {data.body}
        </p>
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
      key: "updatedAt",
      dataIndex: "updatedAt",
      title: "آخرین ویرایش",
      className: "align-middle",
      render: (data) => (
        <div className="flex flex-col gap-1">
          <p className="font-p2-regular">
            {data.updatedAt ? convertGregorianTimeToShamsiTime(data.updatedAt) : "—"}
          </p>
          {data.updatedBy && (
            <p className="font-p2-regular text-gray-500">
              {`${data.updatedBy.firstName ?? ""} ${data.updatedBy.lastName ?? ""}`.trim() ||
                data.updatedBy.username}
            </p>
          )}
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
        <div className="flex gap-3 justify-center items-center">
          <Switch
            checked={data.isActive}
            disabled={togglingEvent === data.event}
            onChange={() => onToggle(data)}
          />
          <Button
            onClick={() => onEditClick(data)}
            variant="outline"
            color="error"
            rightIcon={<Pencil />}
          >
            ویرایش
          </Button>
        </div>
      ),
    },
  ];
};
