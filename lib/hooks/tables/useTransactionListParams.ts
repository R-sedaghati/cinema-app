import { useState } from "react";
import { ParamsTransactionList } from "@/lib/services/admin/type";

interface Pagination {
  page: number;
  count: number;
}

const initialParams: Partial<ParamsTransactionList> = {
  search: null,
  status: null,
};

/**
 * Unlike the artist tables, transactions list unconditionally — there is no
 * "pick a filter first" gate, so no `isValidParams`.
 */
export default function useTransactionListParams() {
  const [params, setParams] =
    useState<Partial<ParamsTransactionList>>(initialParams);
  const [pagination, setPagination] = useState<Pagination>({
    count: 10,
    page: 1,
  });

  const finalParams = { ...params, ...pagination };

  const resetParams = () => {
    setParams(initialParams);
    setPagination((state) => ({ ...state, page: 1 }));
  };

  return {
    params,
    setParams,
    resetParams,
    finalParams,
    pagination,
    setPagination,
  };
}
