"use client";

import { Table } from "@dgshahr/ui-kit";
import TableEmptyState from "@/components/common/TableEmptyState";
import { tableEmptyMessage } from "@/lib/mock/messages";
import withNoSSR from "@/lib/utils/withNoSSR";
import FilterBar from "./FilterBar";
import { generateColumns } from "./columns";
import Header from "../users/Header";
import RequestDetailModal from "./RequestDetailModal";
import { useState } from "react";
import { useAdminSupportList } from "@/lib/services/admin/hook";
import useSupportListParams from "@/lib/hooks/tables/useSupportListParams";

function RequestTable() {
  const {
    params,
    setParams,
    resetParams,
    finalParams,
    pagination,
    setPagination,
    isValidParams,
  } = useSupportListParams();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedArtistId, setSelectedArtistId] = useState<number | undefined>(
    undefined,
  );

  const { data, isPending } = useAdminSupportList(
    isValidParams ? finalParams : undefined,
  );

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
        columns={generateColumns((artist) => {
          setSelectedArtistId(artist);
          setIsDrawerOpen(true);
        })}
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

      <RequestDetailModal
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        selectedArtistId={selectedArtistId}
      />
    </div>
  );
}

export default withNoSSR(RequestTable);
