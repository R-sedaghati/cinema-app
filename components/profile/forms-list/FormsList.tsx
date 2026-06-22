"use client";

import { useState } from "react";
import ContentCard from "../ContentCard";
import { Table } from "@dgshahr/ui-kit";
import { columns } from "./Columns";
import { useUserAtristRequests } from "@/lib/services/landing/hook";
import Header from "@/components/admin/users/Header";
import TableEmptyState from "@/components/common/TableEmptyState";
import { tableEmptyMessage } from "@/lib/mock/messages";
import { hasValidParams } from "@/lib/utils/hasValidParams";
import { IPagination } from "@/lib/services/landing/type";

export default function FormsList() {
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

  return (
    <ContentCard title="لیست فرم‌ها">
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
