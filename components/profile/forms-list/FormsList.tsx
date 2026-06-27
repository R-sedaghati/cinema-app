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

  return (
    <ContentCard title="لیست فرم‌ها">
      <Table
        rowKey="id"
        className="w-full"
        stickyTableHeader
        columns={generateColumns(handleView)}
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
