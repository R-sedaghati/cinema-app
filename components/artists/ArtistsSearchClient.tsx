"use client";

import { ChevronDown, MoveLeft, Search, X } from "lucide-react";
import { mobileSplitPattern, splitPattern } from "@/lib/utils/split-pattern";
import Image from "next/image";
import ArtistCard from "./Card";
import NotFoundSearch from "../common/NotFoundSearch";
import { Button, Chip, Drawer, Input, Select as UiKitSelect } from "@dgshahr/ui-kit";
import { chevronCn } from "@/lib/utils/chevronCn";
import {
  useUserArtistListInfinite,
  useUserCategoryFilters,
  useUserCategoryList,
} from "@/lib/services/landing/hook";
import useDebounce from "@/lib/hooks/useDebounce";
import { useArtistSearchParams } from "@/lib/hooks/useArtistSearchParams";
import type {
  IArtistFilterDescriptor,
  ParamsPublicArtistList,
} from "@/lib/services/landing/type";
import { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";

const PAGE_SIZE = 12;

export function ArtistsSearchClient() {
  const {
    categoryId,
    search,
    selections,
    ranges,
    activeFilterCount,
    setCategory,
    setSearch,
    setSelection,
    toggleSelection,
    setRange,
    clearFilters,
  } = useArtistSearchParams();

  // The input is local so typing doesn't push a history entry per keystroke.
  const [queryDraft, setQueryDraft] = useState(search);
  const debouncedQuery = useDebounce(queryDraft, 500);
  const [openDrawerKey, setOpenDrawerKey] = useState<string | null>(null);

  useEffect(() => {
    if (debouncedQuery !== search) setSearch(debouncedQuery);
    // `search` is intentionally omitted: reacting to it would fight the draft state.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery]);

  const { data: categoryData } = useUserCategoryList({ page: 1, count: 30 });
  const categories = categoryData?.result ?? [];
  const selectedCategory = categories.find((item) => item.id === categoryId);

  const { data: filtersData, isPending: filtersPending } =
    useUserCategoryFilters(categoryId);
  const descriptors = filtersData?.result ?? [];

  const {
    data,
    isPending,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useUserArtistListInfinite(
    buildParams({ categoryId, search, selections, ranges, descriptors }),
    PAGE_SIZE,
  );

  const artists = data?.pages.flatMap((page) => page.result ?? []) ?? [];
  const total = data?.pages.at(0)?.count ?? artists.length;
  const rows = isMobile ? mobileSplitPattern(categories) : splitPattern(categories);

  return (
    <div className="space-y-12 relative">
      <div className="flex flex-col items-center justify-center gap-5">
        <h1 className="text-[24px] ma:text-[32px] text-zinc-50 w-full text-center">
          {categoryId ? "هنرمند مورد نظرت رو پیدا کن" : "دسته بندی رو سرچ کن یا انتخاب کن"}
        </h1>

        <div className="relative md:w-131.5 w-full">
          <Input
            value={queryDraft}
            onChange={(e) => setQueryDraft(e.target.value)}
            placeholder="مثلاً: کارگردان، تهران..."
            rightIcon={<Search className="text-zinc-500" size={20} />}
            containerClassName="rounded-full!"
            leftIcon={
              queryDraft.length ? (
                <X
                  size={20}
                  onClick={() => setQueryDraft("")}
                  className="absolute cursor-pointer left-3 top-1/2 -translate-y-1/2 text-zinc-500"
                />
              ) : undefined
            }
          />
        </div>

        {categoryId && (
          <div className="flex flex-wrap justify-center gap-2 mt-5">
            <Chip
              label={selectedCategory?.faName ?? "دسته‌بندی"}
              filled
              leftIcon={<X size={14} />}
              onClick={() => setCategory(null)}
            />

            {selectedCategory?.children?.map((child) => (
              <Chip
                key={child.id}
                label={child.faName}
                filled={categoryId === child.id}
                onClick={() => setCategory(child.id)}
              />
            ))}
          </div>
        )}

        {categoryId && descriptors.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2">
            {descriptors.map((descriptor) =>
              descriptor.kind === "select" ? (
                <SelectFilter
                  key={descriptor.key}
                  descriptor={descriptor}
                  values={selections[descriptor.key] ?? []}
                  onChange={(values) => setSelection(descriptor.key, values)}
                  onToggle={(value) => toggleSelection(descriptor.key, value)}
                  drawerOpen={openDrawerKey === descriptor.key}
                  onDrawerOpenChange={(open) =>
                    setOpenDrawerKey(open ? descriptor.key : null)
                  }
                />
              ) : (
                <RangeFilter
                  key={descriptor.key}
                  descriptor={descriptor}
                  value={ranges[descriptor.key] ?? {}}
                  onChange={(bound, value) => setRange(descriptor.key, bound, value)}
                />
              ),
            )}

            {activeFilterCount > 0 && (
              <Chip label="حذف فیلترها" leftIcon={<X size={14} />} onClick={clearFilters} />
            )}
          </div>
        )}

        {categoryId && !filtersPending && descriptors.length === 0 && (
          <p className="text-sm text-zinc-500">
            برای این دسته‌بندی فیلتری تعریف نشده است.
          </p>
        )}
      </div>

      {!categoryId && (
        <div className="flex flex-wrap flex-col gap-4">
          {rows.map((row, rowIndex) => (
            <div key={rowIndex} className="flex flex-wrap justify-center gap-4">
              {row.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setCategory(item.id)}
                  className="md:w-60 overflow-hidden w-36 h-20 relative px-4 pb-6 md:pb-0 md:pt-3 bg-zinc-900 rounded-2xl flex items-center gap-4 md:gap-0 md:justify-between border border-transparent hover:border-red-900 cursor-pointer"
                >
                  <p className="text-nowrap text-sm md:text-base z-1">{item.faName}</p>
                  <MoveLeft className="text-error-500 z-1" />
                  <Image
                    src={item.image ?? "/cat-1.svg"}
                    width={90}
                    height={90}
                    alt={item.faName}
                    className="absolute md:relative left-3 md:left-0 bottom-0 z-0 w-12.5 h-12.5 md:w-auto md:h-auto"
                  />
                </button>
              ))}
            </div>
          ))}
        </div>
      )}

      {(categoryId || search) && (
        <div className="space-y-6">
          {!isPending && artists.length > 0 && (
            <p className="text-sm text-zinc-500">{total} هنرمند یافت شد</p>
          )}

          {!isPending && artists.length === 0 ? (
            <NotFoundSearch />
          ) : (
            <div className="grid gap-4 md:grid-cols-4">
              {artists.map((item) => (
                <ArtistCard key={item.id} artist={item} />
              ))}
            </div>
          )}

          {hasNextPage && (
            <div className="flex justify-center">
              <Button
                variant="outline"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
              >
                {isFetchingNextPage ? "در حال بارگذاری..." : "نمایش بیشتر"}
              </Button>
            </div>
          )}
        </div>
      )}

      <div className="w-170 h-170 rounded-full absolute opacity-20 -bottom-44 -right-96 -z-1 bg-radial-primary" />
      <div className="w-170 h-170 rounded-full absolute opacity-20 bottom-12 -left-96 -z-1 bg-radial-primary" />
    </div>
  );
}

/**
 * Descriptors carry the exact API query key (`param`/`paramMin`/`paramMax`), so the
 * client never has to guess how a schema field maps onto a filter param.
 */
function buildParams({
  categoryId,
  search,
  selections,
  ranges,
  descriptors,
}: {
  categoryId: number | null;
  search: string;
  selections: Record<string, string[]>;
  ranges: Record<string, { min?: string; max?: string }>;
  descriptors: IArtistFilterDescriptor[];
}): ParamsPublicArtistList {
  const params: ParamsPublicArtistList = {};

  if (categoryId) params.category__in = [categoryId];
  if (search) params.search = search;

  for (const descriptor of descriptors) {
    if (descriptor.kind === "select") {
      const values = selections[descriptor.key];
      if (values?.length) params[descriptor.param] = values;
      continue;
    }

    const range = ranges[descriptor.key];
    if (range?.min) params[descriptor.paramMin] = range.min;
    if (range?.max) params[descriptor.paramMax] = range.max;
  }

  return params;
}

function SelectFilter({
  descriptor,
  values,
  onChange,
  onToggle,
  drawerOpen,
  onDrawerOpenChange,
}: Readonly<{
  descriptor: Extract<IArtistFilterDescriptor, { kind: "select" }>;
  values: string[];
  onChange: (values: string[]) => void;
  onToggle: (value: string) => void;
  drawerOpen: boolean;
  onDrawerOpenChange: (open: boolean) => void;
}>) {
  const chip = (isOpen: boolean) => (
    <Chip
      label={descriptor.label}
      badgeNumber={values.length || undefined}
      filled={isOpen || values.length > 0}
      leftIcon={<ChevronDown className={chevronCn(isOpen)} />}
    />
  );

  return (
    <>
      <div className="hidden md:block">
        <UiKitSelect
          value={values}
          mode="multiple"
          searchable={descriptor.options.length > 8}
          onChange={(value) => onChange(value as string[])}
          options={descriptor.options.map((option) => ({
            label: option.label,
            value: option.value,
          }))}
          customInput={chip}
        />
      </div>

      <div className="md:hidden">
        <Chip
          label={descriptor.label}
          badgeNumber={values.length || undefined}
          filled={values.length > 0}
          leftIcon={<ChevronDown size={14} />}
          onClick={() => onDrawerOpenChange(true)}
        />
      </div>

      <Drawer
        open={drawerOpen}
        onClose={() => onDrawerOpenChange(false)}
        position="bottom"
        header={{ title: descriptor.label, haveCloseIcon: true }}
        containerClassName="p-5"
      >
        <div className="flex flex-wrap gap-2 mt-4">
          {descriptor.options.map((option) => (
            <Chip
              key={option.value}
              label={option.label}
              filled={values.includes(option.value)}
              onClick={() => onToggle(option.value)}
            />
          ))}
        </div>
      </Drawer>
    </>
  );
}

function RangeFilter({
  descriptor,
  value,
  onChange,
}: Readonly<{
  descriptor: Extract<IArtistFilterDescriptor, { kind: "range" }>;
  value: { min?: string; max?: string };
  onChange: (bound: "min" | "max", value: string) => void;
}>) {
  const [draft, setDraft] = useState(value);
  const debounced = useDebounce(draft, 600);

  useEffect(() => {
    if ((debounced.min ?? "") !== (value.min ?? "")) onChange("min", debounced.min ?? "");
    if ((debounced.max ?? "") !== (value.max ?? "")) onChange("max", debounced.max ?? "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced]);

  return (
    <div className="flex items-center gap-2 rounded-full border border-zinc-800 px-3 py-1">
      <span className="text-sm text-zinc-400 text-nowrap">{descriptor.label}</span>
      <input
        type="number"
        inputMode="numeric"
        min={descriptor.min}
        max={descriptor.max}
        placeholder={String(descriptor.min)}
        value={draft.min ?? ""}
        onChange={(e) => setDraft((prev) => ({ ...prev, min: e.target.value }))}
        className="w-14 bg-transparent text-sm text-zinc-100 outline-none"
      />
      <span className="text-zinc-600">تا</span>
      <input
        type="number"
        inputMode="numeric"
        min={descriptor.min}
        max={descriptor.max}
        placeholder={String(descriptor.max)}
        value={draft.max ?? ""}
        onChange={(e) => setDraft((prev) => ({ ...prev, max: e.target.value }))}
        className="w-14 bg-transparent text-sm text-zinc-100 outline-none"
      />
    </div>
  );
}
