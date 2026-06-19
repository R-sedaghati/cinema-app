import { Button, Input } from "@dgshahr/ui-kit";
import React, { Dispatch, SetStateAction, useState } from "react";
import { ParamsArtistList } from "@/lib/services/admin/type";
import ObjectUtils from "@/lib/utils/objectUtils";
import convertFaNumericStringToEnNumericString from "@/lib/utils/convertFaNumericStringToEnNumericString";

interface Props {
  setParams: Dispatch<SetStateAction<Partial<ParamsArtistList>>>;
  loading: boolean;
  params: Partial<ParamsArtistList>;
  resetParams?: () => void;
}

const FilterBar = ({ setParams, params, loading, resetParams }: Props) => {
  const [search, setSearch] = useState<string>("");
  const showCleanFilters = ObjectUtils.hasMeaningfulValues(params, [
    "p",
    "count",
  ]);

  const setSearchParam = () => {
    if (search.length < 1) return;
    setParams({
      ...params,
      search: search,
      p: 1,
    });
  };

  return (
    <div className="flex flex-col gap-3 py-1 m-1 mb-5 justify-stretch md:flex-row md:flex-wrap md:py-0">
      <div className="flex flex-col gap-3 w-full md:flex-row">
        <Input
          placeholder="جستجو نام و نام‌ خانوادگی، شماره موبایل، شماره تراکنش‌"
          title="جستجو نام و نام‌ خانوادگی، شماره موبایل، شماره تراکنش‌"
          containerClassName="md:!w-1/3"
          disabled={loading && !params.search}
          value={search}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSearch(convertFaNumericStringToEnNumericString(e.target.value))
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setSearchParam();
            }
          }}
        />
        <Button
          className="order-1 md:order-0"
          onClick={setSearchParam}
          variant="primary"
          title="جستجو"
          color="error"
          isLoading={loading}
          disabled={search.length < 1}
        >
          جستجو
        </Button>
      </div>
      <div className="flex flex-wrap gap-3 items-center w-full">
        {showCleanFilters && (
          <button
            className="flex justify-center items-center mr-auto text-base font-semibold leading-normal transition-transform hover:scale-105 text-error-500"
            onClick={() => {
              resetParams?.();
              setSearch("");
            }}
          >
            حذف فیلترها
          </button>
        )}
      </div>
    </div>
  );
};

export default FilterBar;
