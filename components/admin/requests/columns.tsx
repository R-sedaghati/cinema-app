import { ISupportItem } from "@/lib/services/admin/type";
import convertGregorianTimeToShamsiTime from "@/lib/utils/convertGregorianTimeToShamsiTime";
import { Badge, Button } from "@dgshahr/ui-kit";
import { ColumnsType } from "@dgshahr/ui-kit/Table";
import RequestStatus from "./RequestStatus";

export const generateColumns = (
  onOpenDrawer: (artist: number | undefined) => void,
): ColumnsType<ISupportItem>[] => {
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
      key: "userName",
      dataIndex: "userName",
      title: "درخواست دهنده",
      className: "align-middle",
      render: (data) => (
        <p className="font-p1-regular">{`${data.firstName}  ${data.lastName}`}</p>
      ),
    },
    {
      align: "center",
      key: "phoneNumber",
      dataIndex: "phoneNumber",
      title: "شماره موبایل",
      className: "align-middle",
      render: (data) => <p className="font-p1-regular">{data.phoneNumber}</p>,
    },
    {
      align: "center",
      key: "requestDetail",
      dataIndex: "requestDetail",
      title: "جزئیات درخواست",
      className: "align-middle",
      render: (data) => (
        <div className="flex flex-col gap-2">
          <div className="flex gap-2 items-center">
            <p className="font-p2-regular text-gray-500">هنرمند:</p>
            <p className="font-p2-regular text-gray-800">{`${data.firstName}  ${data.lastName}`}</p>
          </div>
          <div className="flex gap-2 items-center">
            <p className="font-p2-regular text-gray-500">وضعیت پرداخت:</p>
            <Badge value={"پرداخت شده"} type="twoTone" color="success" />
          </div>
        </div>
      ),
    },
    {
      align: "center",
      key: "createAt",
      dataIndex: "createAt",
      title: "تاریخ ثبت درخواست",
      className: "align-middle",
      render: (data) => {
        return (
          <p className="font-p1-regular">
            {data.createdAt && convertGregorianTimeToShamsiTime(data.createdAt)}
          </p>
        );
      },
    },
    {
      align: "center",
      key: "latesDate",
      dataIndex: "latesDate",
      title: "تاریخ آخرین تغییر",
      className: "align-middle",
      render: (data) => (
        <p className="font-p1-regular">
          {data.updatedAt && convertGregorianTimeToShamsiTime(data.updatedAt)}
        </p>
      ),
    },
    {
      align: "center",
      key: "status",
      dataIndex: "status",
      title: "وضعیت",
      className: "align-middle",
      render: (data) => <RequestStatus status={data.status} isSolid={false} />,
    },
    {
      align: "center",
      key: "actions",
      dataIndex: "actions",
      title: "عملیات",
      className: "align-middle",
      render: (data) => (
        <Button
          color="error"
          variant="outline"
          onClick={() => onOpenDrawer(data.id)}
        >
          مشاهده درخواست
        </Button>
      ),
    },
  ];
};
