"use client";

import { Badge, Card, Switch, Table } from "@dgshahr/ui-kit";
import { ColumnsType } from "@dgshahr/ui-kit/Table";
import clsx from "clsx";
import { CircleCheck, CircleAlert, CircleHelp } from "lucide-react";
import { useState } from "react";
import TableEmptyState from "@/components/common/TableEmptyState";
import { useAdminSmsLogs } from "@/lib/services/admin/hook";
import type { ISmsLogItem, SmsLogLevel } from "@/lib/services/admin/type";
import convertGregorianTimeToShamsiTime from "@/lib/utils/convertGregorianTimeToShamsiTime";

/**
 * SMS panel health, same shape as the gateway log: operator status card on top (from the
 * hourly credit check), then every text handed to Melli Payamak. OTP codes are never logged.
 */

const ACTION_LABELS: Record<ISmsLogItem["action"], string> = {
  send: "ارسال پیامک",
  pattern: "کد ورود",
  check: "بررسی سلامت پنل",
};

const ACTION_FILTERS: { value: "" | ISmsLogItem["action"]; label: string }[] = [
  { value: "", label: "همه" },
  { value: "send", label: "ارسال" },
  { value: "pattern", label: "کد ورود" },
  { value: "check", label: "بررسی" },
];

const LEVEL_BADGE: Record<SmsLogLevel, { label: string; color: "success" | "error" }> = {
  ok: { label: "موفق", color: "success" },
  error: { label: "مشکل", color: "error" },
};

const STATUS_CARD = {
  ok: {
    title: "پنل پیامک سالم است",
    icon: <CircleCheck size={40} />,
    className: "border-success-500 bg-success-50 text-success-700",
  },
  error: {
    title: "پنل پیامک مشکل دارد",
    icon: <CircleAlert size={40} />,
    className: "border-error-500 bg-error-50 text-error-700",
  },
  unknown: {
    title: "هنوز گزارشی ثبت نشده",
    icon: <CircleHelp size={40} />,
    className: "border-gray-300 bg-gray-50 text-gray-700",
  },
};

const columns: ColumnsType<ISmsLogItem>[] = [
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
    align: "start",
    key: "receptor",
    dataIndex: "receptor",
    title: "گیرنده",
    className: "align-middle whitespace-nowrap",
    render: (data) => (
      <p dir="ltr" className="font-p2-regular">
        {data.receptor ?? "—"}
      </p>
    ),
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
    title: "متن / توضیح",
    className: "align-middle",
    render: (data) => (
      <div className="flex flex-col gap-1">
        <p className="font-p2-regular whitespace-pre-line">{data.message}</p>
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

const SmsLogs = () => {
  const [page, setPage] = useState(1);
  const [problemsOnly, setProblemsOnly] = useState(false);
  const [action, setAction] = useState<"" | ISmsLogItem["action"]>("");

  const { data, isPending } = useAdminSmsLogs({
    page,
    ...(problemsOnly && { level: "error" }),
    ...(action && { action }),
  });

  const summary = data?.result;
  const status = summary?.status === "error" ? "error" : summary?.status === "ok" ? "ok" : "unknown";
  const card = STATUS_CARD[status];

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
            {summary?.statusMessage && (
              <p className="font-p2-regular">{summary.statusMessage}</p>
            )}
            {summary?.checkedAt && (
              <p className="font-p3-regular text-gray-600">
                آخرین بررسی: {convertGregorianTimeToShamsiTime(summary.checkedAt)}
              </p>
            )}
            {status === "error" && summary?.lastOkAt && (
              <p className="font-p3-regular text-gray-600">
                آخرین باری که پنل درست کار کرد:{" "}
                {convertGregorianTimeToShamsiTime(summary.lastOkAt)}
              </p>
            )}
          </div>
          {summary && (
            <div className="flex gap-6 font-p2-medium">
              <p>ارسال موفق امروز: {summary.sentToday}</p>
              <p className={clsx(summary.failedToday > 0 && "text-error-700")}>
                ناموفق امروز: {summary.failedToday}
              </p>
            </div>
          )}
        </div>
        <p className="font-p2-regular text-gray-500 mt-3">
          سامانه هر یک ساعت یک بار خودکار اتصال و اعتبار پنل ملی پیامک را بررسی می‌کند. کد
          ورود کاربران برای امنیت در گزارش ذخیره نمی‌شود.
        </p>
      </Card>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {ACTION_FILTERS.map((filter) => (
            <button
              key={filter.value}
              type="button"
              onClick={() => {
                setAction(filter.value);
                setPage(1);
              }}
              className={clsx(
                "px-3 py-1 rounded-full border border-solid font-p2-regular",
                action === filter.value
                  ? "border-primary-500 bg-primary-50 text-primary-700"
                  : "border-gray-300 text-gray-600",
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>
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

export default SmsLogs;
