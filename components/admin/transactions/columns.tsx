import { ITransactionItem } from "@/lib/services/admin/type";
import convertEnNumberToFaNumberWithSeparation from "@/lib/utils/convertEnNumberToFaNumberWithSeparation";
import convertGregorianTimeToShamsiTime from "@/lib/utils/convertGregorianTimeToShamsiTime";
import { Badge } from "@dgshahr/ui-kit";
import { ColumnsType } from "@dgshahr/ui-kit/Table";

const statusLabels: Record<ITransactionItem["status"], string> = {
  PENDING: "در انتظار پرداخت",
  COMPLETED: "پرداخت شده",
  FAILED: "ناموفق",
  CANCELED: "لغو شده",
};

const statusColors: Record<
  ITransactionItem["status"],
  "success" | "warning" | "error" | "gray"
> = {
  PENDING: "warning",
  COMPLETED: "success",
  FAILED: "error",
  CANCELED: "gray",
};

export const generateColumns = (): ColumnsType<ITransactionItem>[] => {
  return [
    {
      align: "start",
      key: "trackingCode",
      dataIndex: "trackingCode",
      title: "شماره پیگیری",
      className: "align-middle",
      render: (data) => (
        <p className="font-p1-regular">{data.trackingCode}</p>
      ),
    },
    {
      align: "center",
      key: "requesterName",
      dataIndex: "requesterName",
      title: "درخواست‌دهنده",
      className: "align-middle",
      render: (data) => (
        <p className="font-p1-regular">{data.requesterName || "—"}</p>
      ),
    },
    {
      align: "center",
      key: "buyerPhone",
      dataIndex: "buyerPhone",
      title: "شماره موبایل",
      className: "align-middle",
      render: (data) => (
        <p className="font-p1-regular">{data.buyer?.phoneNumber ?? "—"}</p>
      ),
    },
    {
      align: "center",
      key: "artist",
      dataIndex: "artist",
      title: "کد هنرمند",
      className: "align-middle",
      render: (data) => (
        <p className="font-p1-regular">{data.artist?.code ?? "—"}</p>
      ),
    },
    {
      align: "center",
      key: "createAt",
      dataIndex: "createAt",
      title: "تاریخ ثبت",
      className: "align-middle",
      render: (data) => (
        <p className="font-p1-regular">
          {data.createdAt && convertGregorianTimeToShamsiTime(data.createdAt)}
        </p>
      ),
    },
    {
      align: "center",
      key: "status",
      dataIndex: "status",
      title: "وضعیت",
      className: "align-middle",
      render: (data) => (
        <Badge
          size="medium"
          value={statusLabels[data.status]}
          type="twoTone"
          color={statusColors[data.status]}
        />
      ),
    },
    {
      align: "center",
      key: "amount",
      dataIndex: "amount",
      title: "مبلغ تراکنش(تومان)",
      className: "align-middle",
      render: (data) => (
        <p className="font-p1-regular text-gray-700">
          {data.amount === 0
            ? "رایگان"
            : convertEnNumberToFaNumberWithSeparation(data.amount)}
        </p>
      ),
    },
  ];
};
