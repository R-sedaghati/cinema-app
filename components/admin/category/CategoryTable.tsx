"use client";

import { Table } from "@dgshahr/ui-kit";
import TableEmptyState from "@/components/common/TableEmptyState";
import { tableEmptyMessage } from "@/lib/mock/messages";
import withNoSSR from "@/lib/utils/withNoSSR";
import FilterBar from "./FilterBar";
import { generateColumns } from "./columns";
import { useAdminCategoryList, useAdminCategoryUpdate } from "@/lib/services/admin/hook";
import { ICategoryItem } from "@/lib/services/admin/type";
import DeleteCategoryDrawer from "./DeleteCategoryDrawer";
import Header from "./Header";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import useCategoryListParams from "@/lib/hooks/tables/useCategoryListParams";
import { buildCategoryGroups, flattenCategoryGroups } from "@/lib/utils/categoryTree";
import { useState } from "react";

function CategoryTable() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { params, setParams, resetParams, pagination, setPagination } =
    useCategoryListParams();

  // ponytail: server-side search on /admin/categories is unreliable, so fetch the
  // whole list (all pages) and search/filter/paginate client-side.
  const { data, isPending } = useAdminCategoryList();

  const query = (params.search ?? "").trim();
  const groups = buildCategoryGroups(data?.result ?? [], {
    query,
    isActive: params.isActive,
  });

  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  // While filtering, show every matching subcategory without a click.
  const filtering = Boolean(query) || params.isActive != null;
  const isExpanded = (id: number) => filtering || expanded.has(id);
  const toggleExpand = (id: number) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (!next.delete(id)) next.add(id);
      return next;
    });
  const expandableIds = groups.filter((g) => g.children.length).map((g) => g.parent.id);
  const allExpanded =
    expandableIds.length > 0 && expandableIds.every((id) => isExpanded(id));

  // Paginate by main category so a parent is never split from its subcategories.
  const rows = flattenCategoryGroups(
    groups.slice(
      (pagination.page - 1) * pagination.count,
      pagination.page * pagination.count,
    ),
    isExpanded,
  );

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["categoryList"] });
    queryClient.invalidateQueries({ queryKey: ["categoryRetrive"] });
  };

  const allCategories = data?.result ?? [];
  const [deleteTarget, setDeleteTarget] = useState<ICategoryItem | null>(null);
  const { mutate: updateCategory } = useAdminCategoryUpdate();
  const [togglingId, setTogglingId] = useState<number | null>(null);

  const columns = generateColumns({
    isExpanded,
    onToggleExpand: toggleExpand,
    togglingId,
    onToggleActive: (row) => {
      setTogglingId(row.id);
      updateCategory(
        { id: row.id, payload: { isActive: !row.isActive } },
        {
          onSuccess: () => {
            toast.success(row.isActive ? "دسته‌بندی غیرفعال شد" : "دسته‌بندی فعال شد");
            invalidate();
          },
          onError: () => toast.error("خطا در تغییر وضعیت"),
          onSettled: () => setTogglingId(null),
        },
      );
    },
    onEditClick: (id) => router.push(`/admin/categories/${id}`),
    onAddChildClick: (id) => router.push(`/admin/categories/new?parentId=${id}`),
    onRequestClick: (id) =>
      router.push(`/admin/artist-registration?categoryId=${id}`),
    onDeleteClick: (id) =>
      setDeleteTarget(allCategories.find((c) => c.id === id) ?? null),
  });

  return (
    <div className="ss02 mb-5">
      <FilterBar
        setParams={setParams}
        params={params}
        loading={isPending}
        resetParams={resetParams}
        expandAll={
          !filtering && expandableIds.length > 0
            ? {
                expanded: allExpanded,
                onToggle: () =>
                  setExpanded(allExpanded ? new Set() : new Set(expandableIds)),
              }
            : undefined
        }
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
        data={rows}
        getRowClassName={(row) => (row.depth ? "bg-gray-50" : undefined)}
        {...(isPending && { loading: { size: 45 } })}
        {...(groups.length > 0 && {
          pagination: {
            pageSize: pagination.count,
            defaultCurrent: pagination.page,
            totalCount: groups.length,
            onPageChange: (p) =>
              setPagination((state) => ({ ...state, page: p })),
          },
        })}
        emptyContent={<TableEmptyState message={tableEmptyMessage.notFound} />}
      />

      <DeleteCategoryDrawer
        category={deleteTarget}
        subcategories={allCategories.filter((c) => c.parent === deleteTarget?.id)}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}

export default withNoSSR(CategoryTable);
