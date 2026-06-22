import { useState } from "react";
import { hasValidParams } from "@/lib/utils/hasValidParams";
import { ParamsCategoryList } from "@/lib/services/admin/type";

interface Pagination {
  page: number;
  count: number;
}

const initialParams: Partial<ParamsCategoryList> = {
  page: 1,
  count: 10,
  search: null,
  isActive: null,
};

export default function useCategoryListParams() {
  const [params, setParams] =
    useState<Partial<ParamsCategoryList>>(initialParams);
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
