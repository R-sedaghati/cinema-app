import { useState } from "react";
import { hasValidParams } from "@/lib/utils/hasValidParams";
import { ParamsCategoryList } from "@/lib/services/admin/type";

interface Pagination {
  p: number;
  count: number;
}

const initialParams: Partial<ParamsCategoryList> = {
  p: 1,
  count: 10,
  search: null,
  isActive: null,
};

export default function useCategoryListParams() {
  const [params, setParams] =
    useState<Partial<ParamsCategoryList>>(initialParams);
  const [pagination, setPagination] = useState<Pagination>({ count: 10, p: 1 });

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
