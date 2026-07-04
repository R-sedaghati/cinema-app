"use client";

import { Table } from "@dgshahr/ui-kit";
import TableEmptyState from "@/components/common/TableEmptyState";
import { tableEmptyMessage } from "@/lib/mock/messages";
import withNoSSR from "@/lib/utils/withNoSSR";
import FilterBar from "./FilterBar";
import Header from "./Header";
import { generateColumns } from "./columns";
import { useAdminBannerDelete, useAdminBannerList } from "@/lib/services/admin/hook";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import useBannerListParams from "@/lib/hooks/tables/useBannerListParams";

function SliderTable() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { params, setParams, resetParams, finalParams, pagination, setPagination } =
    useBannerListParams();

  const { data, isPending } = useAdminBannerList(finalParams);
  const { mutate: deleteBanner } = useAdminBannerDelete();

  const columns = generateColumns(
    (id) => {
      router.push(`/admin/sliders/${id}`);
    },
    (id) => {
      if (!window.confirm("آیا از حذف این اسلایدر مطمئن هستید؟")) return;

      deleteBanner(id, {
        onSuccess: () => {
          toast.success("با موفقیت حذف شد");
          queryClient.invalidateQueries({ queryKey: ["bannerList"] });
        },
        onError: () => toast.error("خطا در حذف اسلایدر"),
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

export default withNoSSR(SliderTable);
