import RequestStatus from "@/components/admin/requests/RequestStatus";
import Button from "@/components/common/Button";
import { ISupportItem } from "@/lib/services/admin/type";
import { ColumnsType } from "@dgshahr/ui-kit/Table";
import { ChevronLeft } from "lucide-react";

export const columns: ColumnsType<ISupportItem>[] = [
  {
    align: "start",
    key: "title",
    dataIndex: "title",
    title: "درخواست",
    className: "align-middle",
    render: (data) =>
      data.id && (
        <p className="font-p1-regular">{`${data.firstName}  ${data.lastName}`}</p>
      ),
  },
  {
    align: "center",
    key: "status",
    dataIndex: "status",
    title: "وضعیت",
    className: "align-middle",
    render: (data) => <RequestStatus status={data.status} isSolid />,
  },
  {
    align: "center",
    key: "actions",
    dataIndex: "actions",
    title: "عملیات",
    className: "align-middle max-w-28",
    render: () => (
      <Button variant="text" leftIcon={<ChevronLeft />}>
        مشاهده پروفایل هنرمند
      </Button>
    ),
  },
];
