import { Button, Input, Select } from "@dgshahr/ui-kit";
import React, { Dispatch, SetStateAction, useState } from "react";
import Chip from "@/components/common/CustomChip";
import {
  EArtistRequestStatus,
  ParamsSupportList,
} from "@/lib/services/admin/type";
import { chevronCn } from "@/lib/utils/chevronCn";
import ObjectUtils from "@/lib/utils/objectUtils";
import convertFaNumericStringToEnNumericString from "@/lib/utils/convertFaNumericStringToEnNumericString";
import ExtendedDatePicker from "../../common/ExtendedUiDatePicker";
import { ChevronDown } from "lucide-react";
import SelectBeforeOption from "@/components/common/SelectBeforeOption";
import {
  useAdminCategoryList,
  useAdminProvinceList,
} from "@/lib/services/admin/hook";

interface Props {
  setParams: Dispatch<SetStateAction<Partial<ParamsSupportList>>>;
  loading: boolean;
  params: Partial<ParamsSupportList>;
  resetParams?: () => void;
}

const FilterBar = ({ setParams, params, loading, resetParams }: Props) => {
  const { data } = useAdminCategoryList();
  const { data: provinceData } = useAdminProvinceList();

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

  const status = [
    {
      label: "تایید شده",
      value: EArtistRequestStatus.APPROVED,
    },
    {
      label: "در انتظار بررسی",
      value: EArtistRequestStatus.PENDING,
    },
    {
      label: "در انتظار پرداخت",
      value: EArtistRequestStatus.PENDING_PAYMENT,
    },
    {
      label: "رد شده",
      value: EArtistRequestStatus.REJECTED,
    },
  ];

  return (
    <div className="flex flex-col gap-3 py-1 m-1 mb-5 justify-stretch md:flex-row md:flex-wrap md:py-0">
      <div className="flex flex-col gap-3 w-full md:flex-row">
        <Input
          placeholder="جستجو نام و نام‌ خانوادگی، شماره موبایل"
          title="جستجو نام و نام‌ خانوادگی، شماره موبایل"
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
          isLoading={false}
          mode="multiple"
          value={params.status__in ?? []}
          options={
            status.map((item) => ({
              label: item.label,
              value: item.value,
            })) ?? []
          }
          onChange={(value) => {
            setParams((prev) => ({
              ...prev,
              status__in: value,
              p: 1,
            }));
          }}
          optionCellClassName="!bg-transparent hover:!bg-primary-50"
          beforeOptions={
            <SelectBeforeOption
              onSelectNone={() =>
                setParams({ ...params, status__in: [], p: 1 })
              }
              onSelectAll={() =>
                setParams({
                  ...params,
                  status__in: status?.map((st) => st.value),
                  p: 1,
                })
              }
            />
          }
          customInput={(isShownOption) => (
            <Chip
              label="وضعیت"
              badgeNumber={params.status__in?.length || undefined}
              filled={isShownOption || !!params.status__in?.length}
              leftIcon={<ChevronDown className={chevronCn(isShownOption)} />}
            />
          )}
        />

        <Select
          searchable={false}
          isLoading={false}
          mode="multiple"
          value={params.categoryId__in ?? []}
          options={
            data?.result?.map((item) => ({
              label: item.faName,
              value: item.id,
            })) ?? []
          }
          onChange={(value) => {
            setParams((prev) => ({
              ...prev,
              categoryId__in: value,
              p: 1,
            }));
          }}
          optionCellClassName="!bg-transparent hover:!bg-primary-50"
          beforeOptions={
            <SelectBeforeOption
              onSelectNone={() =>
                setParams({ ...params, categoryId__in: [], p: 1 })
              }
              onSelectAll={() =>
                setParams({
                  ...params,
                  categoryId__in: data?.result?.map((st) => st.id),
                  p: 1,
                })
              }
            />
          }
          customInput={(isShownOption) => (
            <Chip
              label="دسته‌بندی"
              badgeNumber={params.categoryId__in?.length || undefined}
              filled={isShownOption || !!params.categoryId__in?.length}
              leftIcon={<ChevronDown className={chevronCn(isShownOption)} />}
            />
          )}
        />

        <Select
          searchable={false}
          isLoading={false}
          mode="multiple"
          value={params.province__in ?? []}
          options={
            provinceData?.result?.map((item) => ({
              label: item.name,
              value: item.id,
            })) ?? []
          }
          onChange={(value) => {
            setParams((prev) => ({
              ...prev,
              province__in: value,
              p: 1,
            }));
          }}
          optionCellClassName="!bg-transparent hover:!bg-primary-50"
          beforeOptions={
            <SelectBeforeOption
              onSelectNone={() =>
                setParams({ ...params, province__in: [], p: 1 })
              }
              onSelectAll={() =>
                setParams({
                  ...params,
                  province__in: provinceData?.result?.map((st) => st.id),
                  p: 1,
                })
              }
            />
          }
          customInput={(isShownOption) => (
            <Chip
              label="استان"
              badgeNumber={params.province__in?.length || undefined}
              filled={isShownOption || !!params.province__in?.length}
              leftIcon={<ChevronDown className={chevronCn(isShownOption)} />}
            />
          )}
        />

        <ExtendedDatePicker
          dateParamName="createdAt"
          label="تاریخ ایجاد"
          params={params}
          setParams={setParams}
        />
        <ExtendedDatePicker
          dateParamName="updateAt"
          label="آخرین تغییر"
          params={params}
          setParams={setParams}
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
