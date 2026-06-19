"use client";

import { Table } from "@dgshahr/ui-kit";
import TableEmptyState from "@/components/common/TableEmptyState";
import { tableEmptyMessage } from "@/lib/mock/messages";
import withNoSSR from "@/lib/utils/withNoSSR";
import FilterBar from "./FilterBar";
import { generateColumns } from "./columns";
import { useAdminCategoryList } from "@/lib/services/admin/hook";
import Header from "../artists/Header";
import { useRouter } from "next/navigation";
import useCategoryListParams from "@/lib/hooks/tables/useCategoryListParams";

function CategoryTable() {
  const router = useRouter();

  const {
    params,
    setParams,
    resetParams,
    finalParams,
    pagination,
    setPagination,
    isValidParams,
  } = useCategoryListParams();

  const { data, isPending } = useAdminCategoryList(
    isValidParams ? finalParams : undefined,
  );

  const columns = generateColumns((id) => {
    router.push(`/admin/categories/${id}`);
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

export default withNoSSR(CategoryTable);
