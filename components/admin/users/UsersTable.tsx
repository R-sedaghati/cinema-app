"use client";

import { Table } from "@dgshahr/ui-kit";
import TableEmptyState from "@/components/common/TableEmptyState";
import { tableEmptyMessage } from "@/lib/mock/messages";
import withNoSSR from "@/lib/utils/withNoSSR";
import FilterBar from "./FilterBar";
import Header from "./Header";
import { generateColumns } from "./columns";
import { useAdminUsersList, useAdminUserDelete } from "@/lib/services/admin/hook";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useState } from "react";
import useAdminAuthStore from "@/lib/stores/useAdminAuthStore";
import useUsersListParams from "@/lib/hooks/tables/useUsersListParams";

function UsersTable() {
  const router = useRouter();
  const { mutate: deleteUser } = useAdminUserDelete();
  const canDelete = useAdminAuthStore((s) => s.role === "SUPER_ADMIN");
  // One mutation serves the whole table, so its `isPending` cannot say *which* row is
  // deleting — track that here to disable the buttons while one is in flight.
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const {
    params,
    setParams,
    resetParams,
    finalParams,
    pagination,
    setPagination,
    isValidParams,
  } = useUsersListParams();

  const { data, isPending } = useAdminUsersList(
    isValidParams ? finalParams : undefined,
  );

  const columns = generateColumns(
    (id) => {
      router.push(`/admin/users/${id}`);
    },
    (id) => {
      if (deletingId !== null) return;

      if (
        !window.confirm(
          "حذف این کاربر تمام اطلاعات، درخواست‌ها و فایل‌های او را برای همیشه پاک می‌کند. مطمئن هستید؟",
        )
      )
        return;

      setDeletingId(id);
      deleteUser(id, {
        // The list refresh lives in the mutation itself.
        onSuccess: () => {
          toast.success("کاربر حذف شد");
          // Deleting the last row of the last page would otherwise leave the table on a
          // page that no longer exists.
          setPagination((state) => ({
            ...state,
            page:
              (data?.result?.length ?? 0) === 1
                ? Math.max(state.page - 1, 1)
                : state.page,
          }));
        },
        // landingApi's admin interceptor already toasts the failure.
        onSettled: () => setDeletingId(null),
      });
    },
    canDelete,
    deletingId,
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
          extraElement: <Header queryKey="adminUsersList" />,
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

export default withNoSSR(UsersTable);
