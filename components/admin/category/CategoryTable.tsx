"use client";

import { Table } from "@dgshahr/ui-kit";
import TableEmptyState from "@/components/common/TableEmptyState";
import { tableEmptyMessage } from "@/lib/mock/messages";
import withNoSSR from "@/lib/utils/withNoSSR";
import FilterBar from "./FilterBar";
import { generateColumns } from "./columns";
import { useAdminCategoryDelete, useAdminCategoryList } from "@/lib/services/admin/hook";
import Header from "./Header";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import useCategoryListParams from "@/lib/hooks/tables/useCategoryListParams";

function CategoryTable() {
  const router = useRouter();
  const queryClient = useQueryClient();

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
  const { mutate: deleteCategory } = useAdminCategoryDelete();

  const columns = generateColumns(
    (id) => {
      router.push(`/admin/categories/${id}`);
    },
    (id) => {
      router.push(`/admin/artist-registration?categoryId=${id}`);
    },
    (id) => {
      if (!window.confirm("آیا از حذف این دسته‌بندی مطمئن هستید؟")) return;

      deleteCategory(id, {
        onSuccess: () => {
          toast.success("با موفقیت حذف شد");
          queryClient.invalidateQueries({ queryKey: ["categoryList"] });
        },
        onError: () => toast.error("خطا در حذف دسته‌بندی"),
      });
    },
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

export default withNoSSR(CategoryTable);
