"use client";

import { Badge, Button, Card, Switch, Table } from "@dgshahr/ui-kit";
import { ColumnsType } from "@dgshahr/ui-kit/Table";
import { useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import { CircleCheck, CircleAlert, CircleHelp } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import TableEmptyState from "@/components/common/TableEmptyState";
import { useAdminGatewayLogs, useAdminPaymentSettingsTest } from "@/lib/services/admin/hook";
import type { GatewayLogLevel, IGatewayLogItem } from "@/lib/services/admin/type";
import convertGregorianTimeToShamsiTime from "@/lib/utils/convertGregorianTimeToShamsiTime";

/**
 * Gateway health, for an admin who does not know what a token or a RefNum is: a big
 * status card on top, then every conversation with the bank in plain Persian. The raw
 * error stays one click away for whoever has to debug it.
 */

const ACTION_LABELS: Record<IGatewayLogItem["action"], string> = {
  check: "بررسی سلامت درگاه",
  token: "ارسال خریدار به بانک",
  verify: "تأیید پرداخت",
  reverse: "برگشت پول به خریدار",
};

const LEVEL_BADGE: Record<GatewayLogLevel, { label: string; color: "success" | "warning" | "error" }> = {
  ok: { label: "موفق", color: "success" },
  warning: { label: "توجه", color: "warning" },
  error: { label: "مشکل", color: "error" },
};

const STATUS_CARD = {
  ok: {
    title: "درگاه پرداخت سالم است",
    icon: <CircleCheck size={40} />,
    className: "border-success-500 bg-success-50 text-success-700",
  },
  error: {
    title: "درگاه پرداخت مشکل دارد",
    icon: <CircleAlert size={40} />,
    className: "border-error-500 bg-error-50 text-error-700",
  },
  unknown: {
    title: "هنوز گزارشی ثبت نشده",
    icon: <CircleHelp size={40} />,
    className: "border-gray-300 bg-gray-50 text-gray-700",
  },
};

const columns: ColumnsType<IGatewayLogItem>[] = [
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
    key: "action",
    dataIndex: "action",
    title: "رویداد",
    className: "align-middle whitespace-nowrap",
    render: (data) => <p className="font-p2-medium">{ACTION_LABELS[data.action]}</p>,
  },
  {
    align: "center",
    key: "level",
    dataIndex: "level",
    title: "نتیجه",
    className: "align-middle",
    render: (data) => (
      <Badge
        size="medium"
        type="twoTone"
        value={LEVEL_BADGE[data.level].label}
        color={LEVEL_BADGE[data.level].color}
      />
    ),
  },
  {
    align: "start",
    key: "message",
    dataIndex: "message",
    title: "توضیح",
    className: "align-middle",
    render: (data) => (
      <div className="flex flex-col gap-1">
        <p className="font-p2-regular">{data.message}</p>
        {data.detail && (
          <details className="text-gray-500">
            <summary className="cursor-pointer font-p3-regular">
              جزئیات فنی (برای پشتیبانی)
            </summary>
            <p dir="ltr" className="font-p3-regular break-all">
              {data.detail}
            </p>
          </details>
        )}
      </div>
    ),
  },
];

const GatewayLogs = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [problemsOnly, setProblemsOnly] = useState(false);

  const { data, isPending } = useAdminGatewayLogs({
    page,
    ...(problemsOnly && { level: "error" }),
  });
  const { mutate: check, isPending: isChecking } = useAdminPaymentSettingsTest();

  const summary = data?.result;
  const status = summary?.status === "error" ? "error" : summary?.status === "ok" ? "ok" : "unknown";
  const card = STATUS_CARD[status];

  const handleCheck = () =>
    check(undefined, {
      onSuccess: (response) => {
        if (response.result.ok) toast.success("درگاه سالم است");
        else toast.error("درگاه مشکل دارد؛ جزئیات در گزارش زیر آمده است");
        setPage(1);
        queryClient.invalidateQueries({ queryKey: ["adminGatewayLogs"] });
      },
      onError: () => toast.error("بررسی انجام نشد، دوباره تلاش کنید"),
    });

  return (
    <div className="flex flex-col gap-5">
      <Card>
        <div
          className={clsx(
            "flex flex-col md:flex-row md:items-center gap-4 border border-solid rounded-xl p-4",
            card.className,
          )}
        >
          {card.icon}
          <div className="flex flex-col gap-1 flex-1">
            <p className="font-h3-bold">{card.title}</p>
            {summary?.statusMessage && status !== "ok" && (
              <p className="font-p2-regular">{summary.statusMessage}</p>
            )}
            {summary?.checkedAt && (
              <p className="font-p3-regular text-gray-600">
                آخرین بررسی: {convertGregorianTimeToShamsiTime(summary.checkedAt)}
              </p>
            )}
            {status === "error" && summary?.lastOkAt && (
              <p className="font-p3-regular text-gray-600">
                آخرین باری که درگاه درست کار کرد:{" "}
                {convertGregorianTimeToShamsiTime(summary.lastOkAt)}
              </p>
            )}
          </div>
          <Button color="gray" variant="outline" isLoading={isChecking} onClick={handleCheck}>
            همین حالا بررسی کن
          </Button>
        </div>
        <p className="font-p2-regular text-gray-500 mt-3">
          سامانه هر یک ساعت یک بار خودکار درگاه بانک را بررسی می‌کند. «توجه» یعنی بانک
          پرداخت یک خریدار را قبول نکرده (مثلاً کارت او موجودی نداشته) و به معنای خرابی
          درگاه نیست.
        </p>
      </Card>

      <div className="flex justify-end">
        <Switch
          label="فقط مشکلات را نشان بده"
          checked={problemsOnly}
          onChange={() => {
            setProblemsOnly((value) => !value);
            setPage(1);
          }}
        />
      </div>

      <Table
        rowKey="id"
        className="w-full"
        stickyTableHeader
        columns={columns}
        data={summary?.items ?? []}
        {...(isPending && { loading: { size: 45 } })}
        {...(data?.count && {
          pagination: {
            pageSize: 20,
            defaultCurrent: page,
            totalCount: data.count,
            onPageChange: setPage,
          },
        })}
        emptyContent={
          <TableEmptyState showImage={false} message="گزارشی برای نمایش وجود ندارد" />
        }
      />
    </div>
  );
};

export default GatewayLogs;
