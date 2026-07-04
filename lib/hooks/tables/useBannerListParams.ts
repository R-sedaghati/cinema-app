import { useState } from "react";
import { hasValidParams } from "@/lib/utils/hasValidParams";
import { ParamsBannerList } from "@/lib/services/admin/type";

interface Pagination {
  page: number;
  count: number;
}

const initialParams: Partial<ParamsBannerList> = {
  page: 1,
  count: 10,
  search: null,
  isActive: null,
};

export default function useBannerListParams() {
  const [params, setParams] =
    useState<Partial<ParamsBannerList>>(initialParams);
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
