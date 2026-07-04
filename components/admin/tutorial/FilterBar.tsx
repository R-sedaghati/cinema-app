import { Button, Input, Select } from "@dgshahr/ui-kit";
import React, { Dispatch, SetStateAction, useState } from "react";
import Chip from "@/components/common/CustomChip";
import { ParamsTutorialList } from "@/lib/services/admin/type";
import { chevronCn } from "@/lib/utils/chevronCn";
import ObjectUtils from "@/lib/utils/objectUtils";
import convertFaNumericStringToEnNumericString from "@/lib/utils/convertFaNumericStringToEnNumericString";
import { ChevronDown } from "lucide-react";

interface Props {
  setParams: Dispatch<SetStateAction<Partial<ParamsTutorialList>>>;
  loading: boolean;
  params: Partial<ParamsTutorialList>;
  resetParams?: () => void;
}

const FilterBar = ({ setParams, params, loading, resetParams }: Props) => {
  const [search, setSearch] = useState<string>("");
  const showCleanFilters = ObjectUtils.hasMeaningfulValues(params, [
    "page",
    "count",
  ]);

  const setSearchParam = () => {
    if (search.length < 1) return;
    setParams({
      ...params,
      search: search,
      page: 1,
    });
  };

  const statusOptions = [
    {
      label: "فعال",
      value: true,
    },
    {
      label: "غیرفعال",
      value: false,
    },
  ];

  const statusLabel =
    params.isActive === true
      ? "فعال"
      : params.isActive === false
        ? "غیرفعال"
        : "وضعیت";

  return (
    <div className="flex flex-col gap-3 py-1 m-1 mb-5 justify-stretch md:flex-row md:flex-wrap md:py-0">
      <div className="flex flex-col gap-3 w-full md:flex-row">
        <Input
          placeholder="جستجو آموزش"
          title="جستجو آموزش"
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
        <Select
          searchable={false}
          mode="single"
          value={params.isActive ?? null}
          options={statusOptions}
          onChange={(value) => {
            setParams((prev) => ({
              ...prev,
              isActive: value,
              page: 1,
            }));
          }}
          optionCellClassName="!bg-transparent hover:!bg-primary-50"
          customInput={(isShownOption) => (
            <Chip
              label={statusLabel}
              filled={isShownOption || params.isActive !== null}
              leftIcon={<ChevronDown className={chevronCn(isShownOption)} />}
            />
          )}
        />

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
