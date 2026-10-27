"use client";

import ContentCard from "../ContentCard";
import { Pagination, Table } from "@dgshahr/ui-kit";
import { generateColumns, statusClasses, statusKeys } from "./Columns";
import { useLandingCopy } from "@/lib/hooks/useLandingCopy";
import { useState } from "react";
import { IPagination } from "@/lib/services/landing/type";
import { useUserContactRequests } from "@/lib/services/landing/hook";
import { hasValidParams } from "@/lib/utils/hasValidParams";
import TableEmptyState from "@/components/common/TableEmptyState";
import { tableEmptyMessage } from "@/lib/mock/messages";
import Button from "@/components/common/Button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { toResumeName } from "@/lib/utils/resumeName";
import convertGregorianTimeToShamsiTime from "@/lib/utils/convertGregorianTimeToShamsiTime";

export default function RequestsList() {
  const [pagination, setPagination] = useState<IPagination>({
    page: 1,
    count: 10,
  });

  const finalParams = {
    page: pagination.page,
    count: pagination.count,
  };

  const { data, isPending } = useUserContactRequests(finalParams);

  const isValidParams = hasValidParams(finalParams);
  const copy = useLandingCopy();

  const items = data?.result ?? [];

  return (
    <ContentCard title={copy("profileRequestsTitle")}>
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
          <p data-el="body" className="py-8 text-center text-sm text-zinc-500">
            <span style={copy.style("profileRequestsEmpty")}>{copy("profileRequestsEmpty")}</span>
          </p>
        )}

        {!isPending &&
          items.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl bg-zinc-900/70 border border-zinc-800/60 px-4 py-4 flex flex-col gap-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-col gap-1">
                  <span data-el="card-title" className="font-medium text-zinc-100 leading-snug">
                    {item.artist?.code ?? "—"}
                  </span>
                  <span data-el="card-meta" className="text-xs text-zinc-500">
                    {item.artist?.categories?.map((category) => toResumeName(category.faName)).join(copy("listSeparator"))}
                  </span>
                </div>
                <span
                  className={`shrink-0 rounded-full px-3 py-1 text-xs ${statusClasses[item.status]}`}
                >
                  {copy(statusKeys[item.status])}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500">
                {item.trackingCode && (
                  <>
                    <span>
                      {copy("profileRequestsColTracking")}: {item.trackingCode}
                    </span>
                    {item.createdAt && <span>•</span>}
                  </>
                )}
                {item.createdAt && (
                  <span>{convertGregorianTimeToShamsiTime(item.createdAt)}</span>
                )}
              </div>

              <Link href={`/artists/${item.artist?.id}`} className="self-start">
                <Button
                  variant="text"
                  leftIcon={<ChevronLeft size={16} />}
                  className="p-0! text-sm"
                >
                  <span style={copy.style("profileRequestsViewArtist")}>{copy("profileRequestsViewArtist")}</span>
                </Button>
              </Link>
            </div>
          ))}

        {!!data?.count && (
          <Pagination
            pageSize={pagination.count}
            defaultCurrent={pagination.page}
            totalCount={data.count}
            onPageChange={(p) =>
              setPagination((state) => ({ ...state, page: p }))
            }
            hideOnSinglePage
          />
        )}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block">
        <Table
          rowKey="id"
          className="w-full"
          stickyTableHeader
          columns={generateColumns(copy)}
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
