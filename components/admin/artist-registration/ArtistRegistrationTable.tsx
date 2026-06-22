"use client";

import { Table } from "@dgshahr/ui-kit";
import TableEmptyState from "@/components/common/TableEmptyState";
import { tableEmptyMessage } from "@/lib/mock/messages";
import withNoSSR from "@/lib/utils/withNoSSR";
import FilterBar from "./FilterBar";
import { generateColumns } from "./columns";
import { useAdminArtistList } from "@/lib/services/admin/hook";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "../users/Header";
import useArtistListParams from "@/lib/hooks/tables/useArtistListParams";
import { useEffect } from "react";

function ArtistRegistrationTable() {
  const router = useRouter();

  const searchParams = useSearchParams();
  const categoryId = searchParams.get("categoryId");

  const {
    params,
    setParams,
    resetParams,
    finalParams,
    pagination,
    setPagination,
    isValidParams,
  } = useArtistListParams();

  const { data, isPending } = useAdminArtistList(
    isValidParams ? finalParams : undefined,
  );

  useEffect(() => {
    if (!categoryId) return;

    setParams((prev) => ({
      ...prev,
      categoryId__in: [Number(categoryId)],
      page: 1,
    }));
  }, [categoryId, setParams]);

  const columns = generateColumns((id) => {
    router.push(`/admin/artist-registration/${id}`);
  });

  return (
    <div className="ss02 mb-5">
      <FilterBar
        setParams={setParams}
        params={params}
        loading={isValidParams && isPending}
        resetParams={resetParams}
      />

      <Table
        rowKey="id"
        className="w-full"
        header={{
          showTotal: true,
          extraElement: <Header />,
        }}
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
    </div>
  );
}

export default withNoSSR(ArtistRegistrationTable);
