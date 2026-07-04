"use client";

import { Table } from "@dgshahr/ui-kit";
import TableEmptyState from "@/components/common/TableEmptyState";
import { tableEmptyMessage } from "@/lib/mock/messages";
import withNoSSR from "@/lib/utils/withNoSSR";
import FilterBar from "./FilterBar";
import Header from "./Header";
import { generateColumns } from "./columns";
import { useAdminTutorialDelete, useAdminTutorialList } from "@/lib/services/admin/hook";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import useTutorialListParams from "@/lib/hooks/tables/useTutorialListParams";

function TutorialTable() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { params, setParams, resetParams, finalParams, pagination, setPagination } =
    useTutorialListParams();

  const { data, isPending } = useAdminTutorialList(finalParams);
  const { mutate: deleteTutorial } = useAdminTutorialDelete();

  const columns = generateColumns(
    (id) => {
      router.push(`/admin/tutorials/${id}`);
    },
    (id) => {
      if (!window.confirm("آیا از حذف این آموزش مطمئن هستید؟")) return;

      deleteTutorial(id, {
        onSuccess: () => {
          toast.success("با موفقیت حذف شد");
          queryClient.invalidateQueries({ queryKey: ["tutorialList"] });
        },
        onError: () => toast.error("خطا در حذف آموزش"),
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
        rowKey="id"
        className="w-full"
        header={{
          showTotal: true,
          extraElement: <Header />,
        }}
        stickyTableHeader
        columns={columns}
        data={data?.result ?? []}
        loading={isPending ? { size: 45 } : undefined}
        {...(data?.count && {
          pagination: {
            pageSize: pagination.count,
            defaultCurrent: pagination.page,
            totalCount: data?.count ?? 0,
            onPageChange: (p) =>
              setPagination((state) => ({ ...state, page: p })),
          },
        })}
        emptyContent={<TableEmptyState showImage message={tableEmptyMessage.notFound} />}
      />
    </div>
  );
}

export default withNoSSR(TutorialTable);
