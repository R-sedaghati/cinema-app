import { useState } from "react";
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
};

export default function useArtistListParams() {
  const [params, setParams] =
    useState<Partial<ParamsArtistList>>(initialParams);
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
