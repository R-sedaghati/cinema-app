import { IArtistItem } from "@/lib/services/admin/type";
import convertGregorianTimeToShamsiTime from "@/lib/utils/convertGregorianTimeToShamsiTime";
import { Badge, Button } from "@dgshahr/ui-kit";
import { ColumnsType } from "@dgshahr/ui-kit/Table";
import { ChevronLeft } from "lucide-react";
import ArtistStatus from "./ArtistStatus";
import CrmStage from "./CrmStage";

/** A follow-up date at or before today is overdue and gets flagged in the table. */
const isOverdue = (followUpAt: string | null) => {
  if (!followUpAt) return false;
  const due = new Date(followUpAt);
  if (Number.isNaN(due.getTime())) return false;

  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);
  return due <= endOfToday;
};

export const generateColumns = (
  onProfileClick: (id: number) => void,
  onCrmClick: (id: number) => void,
): ColumnsType<IArtistItem>[] => {
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
      title: "نام و نام‌ خانوادگی",
      className: "align-middle",
      render: (data) => (
        <p className="font-p1-regular">{`${data?.user?.firstName}  ${data?.user?.lastName}`}</p>
      ),
    },
    {
      align: "center",
      key: "phoneNumber",
      dataIndex: "phoneNumber",
      title: "شماره موبایل",
      className: "align-middle",
      render: (data) => (
        <p className="font-p1-regular">{data?.user?.phoneNumber}</p>
      ),
    },
    {
      align: "center",
      key: "category",
      dataIndex: "category",
      title: " زمینه فعالیت",
      className: "align-middle",
      render: (data) => (
        <p className="font-p1-regular">{data?.categories?.at(0)?.faName}</p>
      ),
    },
    {
      align: "center",
      key: "city",
      dataIndex: "city",
      title: "شهر",
      className: "align-middle",
      render: (data) => <p className="font-p1-regular">{data?.answers?.city as string | undefined}</p>,
    },
    {
      align: "center",
      key: "paymentStatus",
      dataIndex: "paymentStatus",
      title: "وضعیت پرداخت:",
      className: "align-middle",
      render: (data) => (
        <Badge type="twoTone" color="success" value="پرداخت شده" />
      ),
    },
    {
      align: "center",
      key: "createAt",
      dataIndex: "createAt",
      title: "تاریخ ایجاد",
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
      render: (data) => <ArtistStatus status={data.status} isSolid={false} />,
    },
    {
      align: "center",
      key: "crmStage",
      dataIndex: "crmStage",
      title: "مرحله پیگیری",
      className: "align-middle",
      render: (data) => <CrmStage stage={data.crmStage} />,
    },
    {
      align: "center",
      key: "assignedAdmin",
      dataIndex: "assignedAdmin",
      title: "مسئول پیگیری",
      className: "align-middle",
      render: (data) => (
        <p className="font-p1-regular">
          {data.assignedAdmin
            ? `${data.assignedAdmin.firstName ?? ""} ${data.assignedAdmin.lastName ?? ""}`.trim() ||
              data.assignedAdmin.username
            : "—"}
        </p>
      ),
    },
    {
      align: "center",
      key: "followUpAt",
      dataIndex: "followUpAt",
      title: "پیگیری بعدی",
      className: "align-middle",
      render: (data) => (
        <p
          className={
            isOverdue(data.followUpAt)
              ? "font-p1-regular text-error-500"
              : "font-p1-regular"
          }
        >
          {data.followUpAt
            ? convertGregorianTimeToShamsiTime(data.followUpAt)
            : "—"}
        </p>
      ),
    },
    {
      align: "center",
      key: "actions",
      dataIndex: "actions",
      title: "عملیات",
      className: "align-middle",
      render: (data) => (
        <div className="flex gap-2 justify-center">
          <Button
            onClick={() => onCrmClick(data.id)}
            color="error"
            variant="outline"
          >
            پیگیری
          </Button>
          <Button
            onClick={() => onProfileClick(data.id)}
            color="error"
            variant="outline"
            leftIcon={<ChevronLeft />}
          >
            مشاهده فرم درخواست
          </Button>
        </div>
      ),
    },
  ];
};
