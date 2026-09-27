import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { hasValidParams } from "@/lib/utils/hasValidParams";
import { ParamsArtistList } from "@/lib/services/admin/type";

interface Pagination {
  page: number;
  count: number;
}

const initialParams: Partial<ParamsArtistList> = {
  page: 1,
  count: 10,
  search: null,
  province__in: [],
  status__in: [],
  categoryId__in: [],
  updateAt__gte: null,
  updateAt__lte: null,
  createdAt__gte: null,
  createdAt__lte: null,
  crmStage__in: [],
  assignedAdminId: null,
  followUpAt__lte: null,
  sort: null,
  order: null,
  hidden: null,
};

/** `?status__in=` / `?categoryId=` in the URL seed the filters (sidebar, category links). */
export default function useArtistListParams() {
  const searchParams = useSearchParams();
  const [params, setParams] = useState<Partial<ParamsArtistList>>(() => {
    const status = searchParams.getAll("status__in");
    const categoryId = Number(searchParams.get("categoryId"));
    return {
      ...initialParams,
      ...(status.length && { status__in: status }),
      ...(categoryId && { categoryId__in: [categoryId] }),
    };
  });
  const [pagination, setPagination] = useState<Pagination>({
    count: 10,
    page: 1,
  });

  const finalParams = {
    ...params,
    ...pagination,
  };

  const isValidParams = hasValidParams(finalParams);

  const resetParams = () => {
    setParams(initialParams);
  };

  return {
    params,
    setParams,
    pagination,
    setPagination,
    finalParams,
    isValidParams,
    resetParams,
  };
}
