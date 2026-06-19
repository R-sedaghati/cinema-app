import Badge from "@/components/common/Badge";
import Button from "@/components/common/Button";
import { ColumnsType } from "@dgshahr/ui-kit/Table";
import { ChevronLeft } from "lucide-react";
import { ReactNode } from "react";

export type RequestItem = {
  id: string;
  title: string;
  price: number;
  sendDate: string;
  status: ReactNode;
};

export const columnData: RequestItem[] = [
  {
    status: <Badge color="success" value="تأیید شده" />,
    id: "1",
    price: 320000,
    sendDate: "شنبه، ۱۴۰۳/۱۱/۲۰ - ۱۲:۳۴",
    title: "تهیه‌ کنندگی",
  },
  {
    status: <Badge color="warning" value="در حال بررسی" />,
    id: "2",
    price: 320000,
    sendDate: "شنبه، ۱۴۰۳/۱۱/۲۰ - ۱۲:۳۴",
    title: "خبرنگاری",
  },
  {
    status: <Badge color="error" value="رد شده" />,
    id: "2",
    price: 320000,
    sendDate: "شنبه، ۱۴۰۳/۱۱/۲۰ - ۱۲:۳۴",
    title: "تصویربرداری",
  },
  {
    status: <Badge color="success" value="تأیید شده" />,
    id: "3",
    price: 320000,
    sendDate: "شنبه، ۱۴۰۳/۱۱/۲۰ - ۱۲:۳۴",
    title: "صحنه و لباس",
  },
];

export const columns: ColumnsType<RequestItem>[] = [
  {
    dataIndex: "title",
    key: "title",
    title: "نام فرم",
    className: "min-w-36",
  },
  {
    dataIndex: "sendDate",
    key: "sendDate",
    title: "تاریخ ارسال",
    sort: {
      onSort: function Xs() {},
    },
    className: "min-w-56",
  },
  {
    dataIndex: "status",
    ellipsis: true,
    key: "status",
    sort: {
      onSort: function Xs() {},
    },
    render: (data) => <div className="">{data.status}</div>,
    title: "وضعیت",
    className: "min-w-36",
  },
  {
    align: "center",
    key: "actions",
    render: () => (
      <Button variant="text" leftIcon={<ChevronLeft />}>
        مشاهده پروفایل
      </Button>
    ),
    title: "عملیات",
    className: "min-w-36",
  },
];
