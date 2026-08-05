import Button from "@/components/common/Button";
import { IContactRequestItem } from "@/lib/services/landing/type";
import convertEnNumberToFaNumberWithSeparation from "@/lib/utils/convertEnNumberToFaNumberWithSeparation";
import { ColumnsType } from "@dgshahr/ui-kit/Table";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

const statusLabels: Record<IContactRequestItem["status"], string> = {
  PENDING: "در انتظار پرداخت",
  COMPLETED: "پرداخت شده",
  FAILED: "ناموفق",
  CANCELED: "لغو شده",
};

const statusClasses: Record<IContactRequestItem["status"], string> = {
  PENDING: "bg-amber-900/40 text-amber-400",
  COMPLETED: "bg-emerald-900/40 text-emerald-400",
  FAILED: "bg-red-900/40 text-red-400",
  CANCELED: "bg-zinc-800 text-zinc-400",
};

export const columns: ColumnsType<IContactRequestItem>[] = [
  {
    align: "start",
    key: "artist",
    dataIndex: "artist",
    title: "هنرمند",
    className: "align-middle min-w-60",
    render: (data) => (
      <div className="flex flex-col gap-1">
        <p className="font-p1-regular">{data.artist?.code ?? "—"}</p>
        <span className="text-xs text-zinc-500">
          {data.artist?.categories?.map((category) => category.faName).join("، ")}
        </span>
      </div>
    ),
  },
  {
    align: "center",
    key: "trackingCode",
    dataIndex: "trackingCode",
    title: "شماره پیگیری",
    className: "align-middle min-w-32",
    render: (data) => <span className="text-sm">{data.trackingCode}</span>,
  },
  {
    align: "center",
    key: "amount",
    dataIndex: "amount",
    title: "مبلغ",
    className: "align-middle min-w-28",
    render: (data) => (
      <span className="text-sm">
        {convertEnNumberToFaNumberWithSeparation(data.amount)} تومان
      </span>
    ),
  },
  {
    align: "center",
    key: "status",
    dataIndex: "status",
    title: "وضعیت",
    className: "align-middle min-w-32",
    render: (data) => (
      <span
        className={`rounded-full px-3 py-1 text-xs ${statusClasses[data.status]}`}
      >
        {statusLabels[data.status]}
      </span>
    ),
  },
  {
    align: "center",
    key: "actions",
    dataIndex: "actions",
    title: "عملیات",
    className: "align-middle max-w-52",
    render: (data) => (
      <Link href={`/artists/${data.artist?.id}`}>
        <Button variant="text" leftIcon={<ChevronLeft />}>
          مشاهده پروفایل هنرمند
        </Button>
      </Link>
    ),
  },
];
