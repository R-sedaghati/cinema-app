"use client";

import { Table } from "@dgshahr/ui-kit";
import TableEmptyState from "@/components/common/TableEmptyState";
import { tableEmptyMessage } from "@/lib/mock/messages";
import withNoSSR from "@/lib/utils/withNoSSR";
import useTransactionListParams from "@/lib/hooks/tables/useTransactionListParams";
import { useAdminTransactionList } from "@/lib/services/admin/hook";
import FilterBar from "./FilterBar";
import { generateColumns } from "./columns";
import Header from "../users/Header";

function TransactionTable() {
  const { params, setParams, resetParams, finalParams, pagination, setPagination } =
    useTransactionListParams();

  const { data, isPending } = useAdminTransactionList(finalParams);

  return (
    <div className="ss02">
      <FilterBar
        setParams={setParams}
        params={params}
        loading={isPending}
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
        data={data?.result ?? []}
        {...(isPending && { loading: { size: 45 } })}
        {...(data?.count && {
          pagination: {
            pageSize: pagination.count,
            defaultCurrent: pagination.page,
            totalCount: data.count,
            onPageChange: (page) =>
              setPagination((state) => ({ ...state, page })),
          },
        })}
        emptyContent={
          <TableEmptyState showImage={false} message={tableEmptyMessage.notFound} />
        }
      />
    </div>
  );
}

export default withNoSSR(TransactionTable);
