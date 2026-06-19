import Badge from "@/components/common/Badge";
import Button from "@/components/common/Button";
import { ColumnsType } from "@dgshahr/ui-kit/Table";
import { ChevronLeft } from "lucide-react";
import { ReactNode } from "react";

export type RequestItem = {
  id: string;
  title: string;
  status: ReactNode;
};

export const columnData: RequestItem[] = [
  {
    id: "1",
    status: <Badge color="success" value="تأیید شده" />,
    title: "بازیگر: آرمین شیخی",
  },
  {
    id: "2",
    status: <Badge color="warning" value="در حال بررسی" />,
    title: "خبرنگاری",
  },
  {
    id: "2",
    status: <Badge color="error" value="رد شده" />,
    title: "تصویربرداری",
  },
  {
    id: "3",
    status: <Badge color="success" value="تأیید شده" />,
    title: "صحنه و لباس",
  },
  {
    id: "1",
    status: <Badge color="success" value="تأیید شده" />,
    title: "بازیگر: آرمین شیخی",
  },
  {
    id: "2",
    status: <Badge color="warning" value="در حال بررسی" />,
    title: "خبرنگاری",
  },
  {
    id: "2",
    status: <Badge color="error" value="رد شده" />,
    title: "تصویربرداری",
  },
  {
    id: "3",
    status: <Badge color="success" value="تأیید شده" />,
    title: "صحنه و لباس",
  },
  {
    id: "1",
    status: <Badge color="success" value="تأیید شده" />,
    title: "بازیگر: آرمین شیخی",
  },
  {
    id: "2",
    status: <Badge color="warning" value="در حال بررسی" />,
    title: "خبرنگاری",
  },
  {
    id: "2",
    status: <Badge color="error" value="رد شده" />,
    title: "تصویربرداری",
  },
  {
    id: "3",
    status: <Badge color="success" value="تأیید شده" />,
    title: "صحنه و لباس",
  },
  {
    id: "1",
    status: <Badge color="success" value="تأیید شده" />,
    title: "بازیگر: آرمین شیخی",
  },
  {
    id: "2",
    status: <Badge color="warning" value="در حال بررسی" />,
    title: "خبرنگاری",
  },
  {
    id: "2",
    status: <Badge color="error" value="رد شده" />,
    title: "تصویربرداری",
  },
  {
    id: "3",
    status: <Badge color="success" value="تأیید شده" />,
    title: "صحنه و لباس",
  },
];

export const columns: ColumnsType<RequestItem>[] = [
  {
    dataIndex: "title",
    key: "title",
    title: "درخواست",
    className: "min-w-44",
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
        مشاهده پروفایل هنرمند
      </Button>
    ),
    title: "عملیات",
    className: "min-w-36",
  },
];
