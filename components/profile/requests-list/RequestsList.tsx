"use client";

import ContentCard from "../ContentCard";
import { Table } from "@dgshahr/ui-kit";
import { columns } from "./Columns";
import { useState } from "react";
import { IPagination } from "@/lib/services/landing/type";
import { useUserSupport } from "@/lib/services/landing/hook";
import { hasValidParams } from "@/lib/utils/hasValidParams";
import Header from "@/components/admin/users/Header";
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

  const { data, isPending } = useUserSupport(finalParams);

  const isValidParams = hasValidParams(finalParams);

  return (
    <ContentCard title="درخواست‌های ارتباط با هنرمندان">
      <Table
        rowKey="id"
        className="w-full"
        stickyTableHeader
        columns={columns}
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
