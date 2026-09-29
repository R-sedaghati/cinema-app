"use client";

import { Badge, Select, Table } from "@dgshahr/ui-kit";
import { ColumnsType } from "@dgshahr/ui-kit/Table";
import Link from "next/link";
import { useState } from "react";
import TableEmptyState from "@/components/common/TableEmptyState";
import { useAdminPayments } from "@/lib/services/admin/hook";
import type { IAdminPayment, IAdminPaymentStatus } from "@/lib/services/admin/type";
import convertGregorianTimeToShamsiTime from "@/lib/utils/convertGregorianTimeToShamsiTime";
import convertEnNumberToFaNumberWithSeparation from "@/lib/utils/convertEnNumberToFaNumberWithSeparation";

const STATUS_BADGE: Record<
  IAdminPaymentStatus,
  { label: string; color: "success" | "warning" | "error" | "gray" }
> = {
  COMPLETED: { label: "موفق", color: "success" },
  PENDING: { label: "در انتظار بانک", color: "warning" },
  FAILED: { label: "ناموفق", color: "error" },
  CANCELED: { label: "لغو شده", color: "gray" },
};

const GATEWAY_LABELS: Record<string, string> = {
  saman: "درگاه سامان",
  wallet: "کیف پول",
  free: "رایگان",
};

const toman = (value: number) => `${convertEnNumberToFaNumberWithSeparation(value)} تومان`;

const columns: ColumnsType<IAdminPayment>[] = [
  {
    align: "start",
    key: "createdAt",
    dataIndex: "createdAt",
    title: "زمان",
    className: "align-middle whitespace-nowrap",
    render: (data) => (
      <p className="font-p2-regular">{convertGregorianTimeToShamsiTime(data.createdAt)}</p>
    ),
  },
  {
    align: "start",
    key: "artist",
    dataIndex: "artist",
    title: "هنرمند",
    className: "align-middle whitespace-nowrap",
    render: (data) =>
      data.artist ? (
        <Link
          href={`/admin/artist-registration/${data.artist.id}`}
          className="flex flex-col font-p2-medium text-primary-600"
        >
          {[data.artist.name, data.artist.code].filter(Boolean).join(" — ") || `#${data.artist.id}`}
          {data.phone && <span className="font-p3-regular text-gray-500">{data.phone}</span>}
        </Link>
      ) : (
        "—"
      ),
  },
  {
    align: "start",
    key: "amount",
    dataIndex: "amount",
    title: "مبلغ",
    className: "align-middle whitespace-nowrap",
    render: (data) => (
      <div className="flex flex-col">
        <p className="font-p2-medium">{toman(data.amount + data.walletAmount)}</p>
        {data.walletAmount > 0 && data.amount > 0 && (
          <p className="font-p3-regular text-gray-500">
            {toman(data.amount)} درگاه + {toman(data.walletAmount)} کیف پول
          </p>
        )}
      </div>
    ),
  },
  {
    align: "start",
    key: "gateway",
    dataIndex: "gateway",
    title: "روش پرداخت",
    className: "align-middle whitespace-nowrap",
    render: (data) => <p className="font-p2-regular">{GATEWAY_LABELS[data.gateway] ?? data.gateway}</p>,
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
        type="twoTone"
        value={STATUS_BADGE[data.status].label}
        color={STATUS_BADGE[data.status].color}
      />
    ),
  },
  {
    align: "start",
    key: "refNum",
    dataIndex: "refNum",
    title: "شماره پیگیری بانک",
    className: "align-middle",
    render: (data) => (
      <p dir="ltr" className="font-p3-regular break-all text-end">
        {data.refNum ?? "—"}
      </p>
    ),
  },
];

const Payments = () => {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<IAdminPaymentStatus | null>(null);

  const { data, isPending } = useAdminPayments({ page, ...(status && { status }) });

  return (
    <div className="flex flex-col gap-5">
      <Select
        inputProps={{ placeholder: "وضعیت" }}
        mode="single"
        wrapperClassName="md:!w-60"
        value={status}
        onChange={(value) => {
          setStatus((value as IAdminPaymentStatus) ?? null);
          setPage(1);
        }}
        options={Object.entries(STATUS_BADGE).map(([value, { label }]) => ({ label, value }))}
      />

      <Table
        rowKey="id"
        className="w-full"
        stickyTableHeader
        columns={columns}
        data={data?.result ?? []}
        {...(isPending && { loading: { size: 45 } })}
        {...(data?.count && {
          pagination: {
            pageSize: 20,
            defaultCurrent: page,
            totalCount: data.count,
            onPageChange: setPage,
          },
        })}
        emptyContent={<TableEmptyState showImage={false} message="تراکنشی برای نمایش وجود ندارد" />}
      />
    </div>
  );
};

export default Payments;
