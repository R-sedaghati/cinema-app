"use client";

import { Table } from "@dgshahr/ui-kit";
import TableEmptyState from "@/components/common/TableEmptyState";
import { tableEmptyMessage } from "@/lib/mock/messages";
import withNoSSR from "@/lib/utils/withNoSSR";
import FilterBar from "./FilterBar";
import { generateColumns, type SortProps } from "./columns";
import {
  useAdminArtistHiddenUpdate,
  useAdminArtistList,
  useAdminCategoryList,
} from "@/lib/services/admin/hook";
import { IArtistItem } from "@/lib/services/admin/type";
import { toast } from "react-toastify";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "../users/Header";
import useArtistListParams from "@/lib/hooks/tables/useArtistListParams";
import { useEffect, useState } from "react";
import CrmDrawer from "./CrmDrawer";

function ArtistRegistrationTable() {
  const router = useRouter();

  const searchParams = useSearchParams();
  const categoryId = searchParams.get("categoryId");

  const {
    params,
    setParams,
    resetParams,
    finalParams,
    pagination,
    setPagination,
    isValidParams,
  } = useArtistListParams();

  const { data, isPending } = useAdminArtistList(
    isValidParams ? finalParams : undefined,
  );

  const [crmArtistId, setCrmArtistId] = useState<number | null>(null);
  // Read off the current page rather than kept in state, so the drawer shows the
  // freshly-fetched row after a save invalidates the list.
  const crmArtist =
    data?.result?.find((item) => item.id === crmArtistId) ?? null;

  useEffect(() => {
    if (!categoryId) return;

    setParams((prev) => ({
      ...prev,
      categoryId__in: [Number(categoryId)],
      page: 1,
    }));
  }, [categoryId, setParams]);

  // Forms belong to top-level categories, so a request filed under a subcategory
  // shows its parent's name.
  const { data: categoryData } = useAdminCategoryList();
  const categories = categoryData?.result ?? [];
  const formNameOf = (categoryId?: number) => {
    const category = categories.find((c) => c.id === categoryId);
    const parentId = category?.parent ?? category?.id;
    return categories.find((c) => c.id === parentId)?.faName;
  };

  // Sorting is server-side: the header only moves `sort`/`order` in the query params.
  const sortOf = (key: string): SortProps => ({
    active:
      params.sort === key
        ? params.order === "ASC"
          ? "ascend"
          : "descend"
        : undefined,
    onSort: (value: "ascend" | "descend") =>
      setParams((prev) => ({
        ...prev,
        sort: key,
        order: value === "ascend" ? "ASC" : "DESC",
        page: 1,
      })),
  });

  const { mutate: setHidden, isPending: isHiding } = useAdminArtistHiddenUpdate();

  const handleHideClick = (item: IArtistItem) => {
    if (isHiding) return;
    const hidden = !item.hiddenAt;

    setHidden(
      { id: item.id, hidden },
      {
        onSuccess: () =>
          toast.success(hidden ? "فرم حذف شد" : "فرم بازگردانده شد"),
        onError: () => toast.error("عملیات انجام نشد"),
      },
    );
  };

  const columns = generateColumns(
    (id) => {
      router.push(`/admin/artist-registration/${id}`);
    },
    (id) => setCrmArtistId(id),
    formNameOf,
    sortOf,
    handleHideClick,
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
          extraElement: <Header queryKey="artistList" />,
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

      <CrmDrawer
        open={Boolean(crmArtistId)}
        onClose={() => setCrmArtistId(null)}
        artist={crmArtist}
      />
    </div>
  );
}

export default withNoSSR(ArtistRegistrationTable);
