"use client";

import { Table } from "@dgshahr/ui-kit";
import TableEmptyState from "@/components/common/TableEmptyState";
import { tableEmptyMessage } from "@/lib/mock/messages";
import withNoSSR from "@/lib/utils/withNoSSR";
import useArtistListParams from "@/lib/hooks/tables/useArtistListParams";
import FilterBar from "./FilterBar";
import Header from "./Header";
import { generateColumns } from "./columns";
import { useAdminArtistList } from "@/lib/services/admin/hook";
import { useRouter } from "next/navigation";

function ArtistTable() {
  const router = useRouter();

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

  const columns = generateColumns((id) => {
    router.push(`/admin/artists/${id}`);
  });

  return (
    <div className="ss02">
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
            defaultCurrent: pagination.p,
            totalCount: data?.count ?? 0,
            onPageChange: (p) => setPagination((state) => ({ ...state, p: p })),
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

export default withNoSSR(ArtistTable);
