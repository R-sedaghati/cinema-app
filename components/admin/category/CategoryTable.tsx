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

  const { params, setParams, resetParams, pagination, setPagination } =
    useCategoryListParams();

  // ponytail: server-side search on /admin/categories is unreliable, so fetch the
  // whole list (backend caps count at 100) and search/filter/paginate client-side.
  // Move back to server params if categories ever exceed 100.
  const { data, isPending } = useAdminCategoryList({ page: 1, count: 100 });

  const query = (params.search ?? "").trim().toLowerCase();
  const filtered = (data?.result ?? []).filter((item) => {
    if (params.isActive != null && item.isActive !== params.isActive)
      return false;
    if (!query) return true;
    return [item.faName, item.enName, item.description].some((field) =>
      field?.toLowerCase().includes(query),
    );
  });
  const pageRows = filtered.slice(
    (pagination.page - 1) * pagination.count,
    pagination.page * pagination.count,
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
        loading={isPending}
        resetParams={resetParams}
      />

      <Table
        key={`${query}-${String(params.isActive)}`}
        rowKey="id"
        className="w-full"
        header={{
          showTotal: true,
          extraElement: <Header />,
        }}
        stickyTableHeader
        columns={columns}
        data={pageRows}
        {...(isPending && { loading: { size: 45 } })}
        {...(filtered.length > 0 && {
          pagination: {
            pageSize: pagination.count,
            defaultCurrent: pagination.page,
            totalCount: filtered.length,
            onPageChange: (p) =>
              setPagination((state) => ({ ...state, page: p })),
          },
        })}
        emptyContent={<TableEmptyState message={tableEmptyMessage.notFound} />}
      />
    </div>
  );
}

export default withNoSSR(CategoryTable);
