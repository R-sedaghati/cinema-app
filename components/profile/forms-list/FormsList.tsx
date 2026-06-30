"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ContentCard from "../ContentCard";
import { Table } from "@dgshahr/ui-kit";
import { generateColumns } from "./Columns";
import { useUserAtristRequests } from "@/lib/services/landing/hook";
import TableEmptyState from "@/components/common/TableEmptyState";
import { tableEmptyMessage } from "@/lib/mock/messages";
import { hasValidParams } from "@/lib/utils/hasValidParams";
import { IPagination } from "@/lib/services/landing/type";
import { EArtistRequestStatus, IArtistItem } from "@/lib/services/admin/type";
import ArtistStatus from "@/components/admin/artist-registration/ArtistStatus";
import convertGregorianTimeToShamsiTime from "@/lib/utils/convertGregorianTimeToShamsiTime";
import Button from "@/components/common/Button";
import { ChevronLeft } from "lucide-react";

export default function FormsList() {
  const router = useRouter();
  const [pagination, setPagination] = useState<IPagination>({
    page: 1,
    count: 10,
  });

  const finalParams = {
    page: pagination.page,
    count: pagination.count,
  };

  const { data, isPending } = useUserAtristRequests(finalParams);

  const isValidParams = hasValidParams(finalParams);

  const handleView = (item: IArtistItem) => {
    if (item.status === EArtistRequestStatus.NEED_TO_REVISION) {
      router.push(`/artist-registration?editId=${item.id}`);
    } else {
      router.push(`/artists/${item.id}`);
    }
  };

  const items = data?.result ?? [];

  return (
    <ContentCard title="لیست فرم‌ها">
      {/* Mobile card list */}
      <div className="flex flex-col gap-3 md:hidden">
        {isPending &&
          ["sk-1", "sk-2", "sk-3"].map((k) => (
            <div
              key={k}
              className="animate-pulse rounded-2xl bg-zinc-900/70 border border-zinc-800/60 px-4 py-4 flex flex-col gap-3"
            >
              <div className="flex justify-between items-start">
                <div className="h-4 w-32 rounded bg-zinc-800" />
                <div className="h-6 w-20 rounded-full bg-zinc-800" />
              </div>
              <div className="h-3 w-24 rounded bg-zinc-800/60" />
              <div className="h-8 w-24 rounded self-start bg-zinc-800/40" />
            </div>
          ))}

        {!isPending && items.length === 0 && (
          <p className="py-8 text-center text-sm text-zinc-500">
            هیچ فرمی ثبت نشده است.
          </p>
        )}

        {!isPending &&
          items.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl bg-zinc-900/70 border border-zinc-800/60 px-4 py-4 flex flex-col gap-3"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="font-medium text-zinc-100 leading-snug">
                  {item.user.firstName} {item.user.lastName}
                </span>
                <ArtistStatus status={item.status} isSolid />
              </div>

              <div className="flex items-center gap-2 text-xs text-zinc-500">
                {item.trackingCode && (
                  <>
                    <span>کد پیگیری: {item.trackingCode}</span>
                    {item.createdAt && <span>•</span>}
                  </>
                )}
                {item.createdAt && (
                  <span>{convertGregorianTimeToShamsiTime(item.createdAt)}</span>
                )}
              </div>

              <div className="flex justify-start">
                <Button
                  variant="text"
                  leftIcon={<ChevronLeft size={16} />}
                  onClick={() => handleView(item)}
                  className="p-0! text-sm"
                >
                  {item.status === EArtistRequestStatus.NEED_TO_REVISION
                    ? "ویرایش فرم"
                    : "مشاهده فرم"}
                </Button>
              </div>
            </div>
          ))}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block">
        <Table
          rowKey="id"
          className="w-full"
          stickyTableHeader
          columns={generateColumns(handleView)}
          data={items}
          {...(isValidParams && isPending && { loading: { size: 45 } })}
          {...(data?.count && {
            pagination: {
              pageSize: pagination.count,
              defaultCurrent: pagination.page,
              totalCount: data?.count ?? 0,
              onPageChange: (p) =>
                setPagination((state) => ({ ...state, page: p })),
            },
          })}
          emptyContent={
            <TableEmptyState
              showImage={!isValidParams}
              message={
                tableEmptyMessage[isValidParams ? "notFound" : "emptyParam"]
              }
            />
          }
        />
      </div>
    </ContentCard>
  );
}
