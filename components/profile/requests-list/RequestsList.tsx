"use client";

import ContentCard from "../ContentCard";
import { Table } from "@dgshahr/ui-kit";
import { generateColumns } from "./Columns";
import { useLandingCopy } from "@/lib/hooks/useLandingCopy";
import { useState } from "react";
import { IPagination } from "@/lib/services/landing/type";
import { useUserContactRequests } from "@/lib/services/landing/hook";
import { hasValidParams } from "@/lib/utils/hasValidParams";
import TableEmptyState from "@/components/common/TableEmptyState";
import { tableEmptyMessage } from "@/lib/mock/messages";

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

  return (
    <ContentCard title={copy("profileRequestsTitle")}>
      <Table
        rowKey="id"
        className="w-full"
        stickyTableHeader
        columns={generateColumns(copy)}
        data={data?.result ?? []}
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
    </ContentCard>
  );
}
