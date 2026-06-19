"use client";

import { Table } from "@dgshahr/ui-kit";
import TableEmptyState from "@/components/common/TableEmptyState";
import { tableEmptyMessage } from "@/lib/mock/messages";
import withNoSSR from "@/lib/utils/withNoSSR";
import useArtistListParams from "@/lib/hooks/tables/useArtistListParams";
import FilterBar from "./FilterBar";
import { generateColumns } from "./columns";
import Header from "../artists/Header";

function TransactionTable() {
  const {
    params,
    setParams,
    resetParams,
    finalParams,
    pagination,
    setPagination,
    isValidParams,
  } = useArtistListParams();

  //   const { data, isPending } = useAdminArtistList(
  //     isValidParams ? finalParams : undefined,
  //   );

  return (
    <div className="ss02">
      <FilterBar
        setParams={setParams}
        params={params}
        // loading={isValidParams && isPending}
        loading={false}
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
        columns={generateColumns()}
        data={[]}
        // data={isValidParams ? (data?.results ?? []) : []}
        // {...(isValidParams && isPending && { loading: { size: 45 } })}
        // {...(data?.count && {
        //   pagination: {
        //     pageSize: pagination.count,
        //     defaultCurrent: pagination.p,
        //     totalCount: data?.count ?? 0,
        //     onPageChange: (p) => setPagination((state) => ({ ...state, p: p })),
        //   },
        // })}
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

export default withNoSSR(TransactionTable);
