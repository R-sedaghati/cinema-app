"use client";

import { statusLabels } from "@/components/admin/transactions/columns";
import {
  useAdminTransactionRetrieve,
  useAdminTransactionReview,
} from "@/lib/services/admin/hook";
import { EFormFieldType } from "@/lib/services/admin/type";
import type { ITransactionDetail } from "@/lib/services/admin/type";
import convertGregorianTimeToShamsiTime from "@/lib/utils/convertGregorianTimeToShamsiTime";
import { formatAnswer } from "@/lib/utils/formatAnswer";
import { toResumeName } from "@/lib/utils/resumeName";
import withNoSSR from "@/lib/utils/withNoSSR";
import { Badge, Button, Card, Divider } from "@dgshahr/ui-kit";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import React from "react";
import { toast } from "react-toastify";

const FILE_TYPES = new Set<string>([EFormFieldType.IMAGE, EFormFieldType.VIDEO]);
const ANSWER_TEXT = { yes: "بله", no: "خیر", empty: "—", sep: "، " };

const statusColors = { PENDING: "warning", APPROVED: "success", REJECTED: "error" } as const;

const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex justify-between gap-4 py-2 border-b border-gray-200 last:border-0">
    <span className="text-gray-500 shrink-0">{label}</span>
    <span className="text-gray-900 text-left break-all">{children}</span>
  </div>
);

const AnswerRows = ({ rows }: { rows: ITransactionDetail["answers"] }) =>
  rows.length === 0 ? (
    <p className="text-gray-500">—</p>
  ) : (
    <>
      {rows.map((row) => (
        <Row key={row.key} label={row.label}>
          {FILE_TYPES.has(row.type)
            ? (row.value as string[]).map((url, i) => (
                <a key={url} href={url} target="_blank" rel="noreferrer" className="text-primary-600 underline mr-2">
                  فایل {i + 1}
                </a>
              ))
            : formatAnswer(row, row.value, ANSWER_TEXT)}
        </Row>
      ))}
    </>
  );

function ResumeRequestDetail() {
  const id = Number(useParams().id);
  const router = useRouter();
  const { data, isPending } = useAdminTransactionRetrieve(id);
  const review = useAdminTransactionReview();
  const request = data?.result;

  const decide = (status: "APPROVED" | "REJECTED") =>
    review.mutate(
      { id, status },
      {
        onSuccess: () =>
          toast.success(status === "APPROVED" ? "درخواست تایید شد و پیامک ارسال شد." : "درخواست رد شد."),
      },
    );

  if (isPending || !request) {
    return <p className="p-6 text-gray-500">{isPending ? "در حال بارگذاری..." : "درخواست یافت نشد."}</p>;
  }

  const { requester, artist } = request;

  return (
    <div className="flex flex-col gap-6 p-4 pt-6">
      <div className="flex justify-start">
        <Button
          onClick={() => router.push("/admin/transactions")}
          variant="text"
          rightIcon={<ChevronRight />}
          color="gray"
        >
          بازگشت به تراکنش‌ها
        </Button>
      </div>
      <Card>
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="font-h3-bold text-error-500">درخواست مشاهده رزومه #{request.trackingCode}</p>
            <Badge size="medium" type="twoTone" value={statusLabels[request.status]} color={statusColors[request.status]} />
          </div>
          <Divider color="gray" size="thin" type="horizontal" />
          <div className="flex flex-wrap gap-6 text-sm text-gray-600">
            <span>تاریخ ثبت: {convertGregorianTimeToShamsiTime(request.createdAt)}</span>
            {request.reviewedAt && <span>تاریخ بررسی: {convertGregorianTimeToShamsiTime(request.reviewedAt)}</span>}
          </div>
          {request.status === "PENDING" && (
            <div className="flex gap-3">
              <Button color="success" isLoading={review.isPending} disabled={review.isPending} onClick={() => decide("APPROVED")}>
                تایید و ارسال پیامک
              </Button>
              <Button variant="secondary" color="error" disabled={review.isPending} onClick={() => decide("REJECTED")}>
                رد درخواست
              </Button>
            </div>
          )}
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <p className="font-h3-bold text-error-500">درخواست‌دهنده</p>
              {request.isGuest && (
                <Badge size="medium" type="twoTone" color="gray" value="بدون ورود (شماره تأیید نشده)" />
              )}
            </div>
            <Divider color="gray" size="thin" type="horizontal" />
            {requester.avatar && (
              <img src={requester.avatar} alt="" className="h-20 w-20 rounded-full object-cover" />
            )}
            <div>
              <Row label="نام در فرم">{request.requesterName || "—"}</Row>
              <Row label="نام حساب کاربری">
                {[requester.firstName, requester.lastName].filter(Boolean).join(" ") || "—"}
              </Row>
              <Row label="شماره موبایل">
                {requester.id ? (
                  <Link href={`/admin/users/${requester.id}`} className="text-primary-600 hover:underline" dir="ltr">
                    {requester.phoneNumber ?? "—"}
                  </Link>
                ) : (
                  requester.phoneNumber ?? "—"
                )}
              </Row>
              <Row label="ایمیل">{requester.email ?? "—"}</Row>
              <Row label="کد کاربری">{requester.code ?? "—"}</Row>
              <Row label="عضویت از">{convertGregorianTimeToShamsiTime(requester.createdAt) || "—"}</Row>
            </div>
            <p className="font-p1-bold text-gray-700 mt-2">پاسخ‌های فرم درخواست</p>
            <div>
              <AnswerRows rows={request.answers} />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <p className="font-h3-bold text-error-500">رزومه درخواست‌شده</p>
              {artist.id && (
                <Link href={`/admin/artist-registration/${artist.id}`} className="text-primary-600 hover:underline text-sm">
                  مشاهده کامل رزومه
                </Link>
              )}
            </div>
            <Divider color="gray" size="thin" type="horizontal" />
            {artist.avatar && <img src={artist.avatar} alt="" className="h-20 w-20 rounded-full object-cover" />}
            <div>
              <Row label="نام هنرمند">{artist.name ?? "—"}</Row>
              <Row label="کد هنرمند">{artist.code ?? "—"}</Row>
              <Row label="دسته‌بندی">
                {artist.categories.map((c) => toResumeName(c.faName)).join("، ") || "—"}
              </Row>
              <Row label="شماره تماس">{artist.phoneNumber ?? "—"}</Row>
              <Row label="ایمیل">{artist.email ?? "—"}</Row>
            </div>
            <p className="font-p1-bold text-gray-700 mt-2">اطلاعاتی که با تایید برای درخواست‌دهنده باز می‌شود</p>
            <div>
              <AnswerRows rows={artist.privateFields} />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default withNoSSR(ResumeRequestDetail);
