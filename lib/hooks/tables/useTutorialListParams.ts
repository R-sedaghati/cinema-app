import { useState } from "react";
import { hasValidParams } from "@/lib/utils/hasValidParams";
import { ParamsTutorialList } from "@/lib/services/admin/type";

interface Pagination {
  page: number;
  count: number;
}

const initialParams: Partial<ParamsTutorialList> = {
  page: 1,
  count: 10,
  search: null,
  isActive: null,
};

export default function useTutorialListParams() {
  const [params, setParams] =
    useState<Partial<ParamsTutorialList>>(initialParams);
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
