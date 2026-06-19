import { IArtistItem } from "@/lib/services/admin/type";
import convertEnNumberToFaNumberWithSeparation from "@/lib/utils/convertEnNumberToFaNumberWithSeparation";
import convertGregorianTimeToShamsiTime from "@/lib/utils/convertGregorianTimeToShamsiTime";
import { Badge } from "@dgshahr/ui-kit";
import { ColumnsType } from "@dgshahr/ui-kit/Table";

export const generateColumns = (): ColumnsType<IArtistItem>[] => {
  return [
    {
      align: "start",
      key: "id",
      dataIndex: "id",
      title: "شماره پیگیری",
      className: "align-middle",
      render: (data) => data.id && <p className="font-p1-regular">{data.id}</p>,
    },
    {
      align: "center",
      key: "createAt",
      dataIndex: "createAt",
      title: "تاریخ ساخت",
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
      title: "تاریخ پرداخت",
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
      render: (data) => (
        <Badge
          size="medium"
          value={"تایید شده"}
          type="twoTone"
          color="success"
        />
      ),
    },
    {
      align: "center",
      key: "price",
      dataIndex: "price",
      title: "مبلغ تراکنش(تومان)",
      className: "align-middle",
      render: (data) => (
        <p className="font-p1-regular text-gray-700">
          {convertEnNumberToFaNumberWithSeparation(2490000)}
        </p>
      ),
    },
  ];
};
