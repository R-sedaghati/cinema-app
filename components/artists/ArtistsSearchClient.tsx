"use client";

import { useState } from "react";
import { artistCategories } from "@/lib/mock/artists";
import { ChevronDown, MoveLeft, Search, X } from "lucide-react";
import { mobileSplitPattern, splitPattern } from "@/lib/utils/split-pattern";
import Image from "next/image";
import ArtistCard from "./Card";
import NotFoundSearch from "../common/NotFoundSearch";
import { Chip, Input, Select as UiKitSelect } from "@dgshahr/ui-kit";
import { chevronCn } from "@/lib/utils/chevronCn";
import {
  useUserArtsitList,
  useUserProvinceList,
} from "@/lib/services/landing/hook";
import useDebounce from "@/lib/hooks/useDebounce";
import { isMobile } from "react-device-detect";
import { EArtistGender } from "@/lib/services/admin/type";

type Filters = {
  categoryId__in: number[];
  gender: EArtistGender | null;
  city__in: number[];
};

export function ArtistsSearchClient() {
  const [query, setQuery] = useState("");
  const debouncedSearch = useDebounce(query, 1500);

  const [filters, setFilters] = useState<Filters>({
    categoryId__in: [],
    gender: null,
    city__in: [],
  });

  const { data } = useUserArtsitList({
    search: debouncedSearch,
    categoryId__in: filters.categoryId__in.length
      ? filters.categoryId__in
      : undefined,
    gender: filters.gender ?? undefined,
    city__in: filters.city__in.length ? filters.city__in : undefined,
  });

  const { data: provinceData } = useUserProvinceList();

  const results = data?.result ?? [];
  const rows = isMobile
    ? mobileSplitPattern(artistCategories)
    : splitPattern(artistCategories);

  return (
    <div className="space-y-12 relative">
      <div className="flex flex-col items-center justify-center gap-5">
        <h1 className="text-[24px] ma:text-[32px] text-zinc-50 w-full text-center">
          دسته بندی رو سرچ کن یا انتخاب کن
        </h1>

        <div className="relative md:w-131.5 w-full">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="مثلاً: مهسا، کارگردان، تهران..."
            rightIcon={<Search className="text-zinc-500" size={20} />}
            containerClassName="rounded-full!"
            leftIcon={
              query.length ? (
                <X
                  size={20}
                  onClick={() => setQuery("")}
                  className="absolute cursor-pointer left-3 top-1/2 -translate-y-1/2 text-zinc-500"
                />
              ) : undefined
            }
          />
        </div>

        {data?.result && (
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <UiKitSelect
              value={filters.categoryId__in}
              mode="multiple"
              searchable={false}
              onChange={(value) =>
                setFilters((p) => ({ ...p, categoryId__in: value }))
              }
              options={
                artistCategories?.map((item) => ({
                  label: item.title,
                  value: item.id,
                })) ?? []
              }
              customInput={(isOpen) => (
                <Chip
                  label="دسته‌بندی"
                  badgeNumber={filters.categoryId__in.length || undefined}
                  filled={isOpen || filters.categoryId__in.length > 0}
                  leftIcon={<ChevronDown className={chevronCn(isOpen)} />}
                />
              )}
            />

            <UiKitSelect
              value={filters.gender}
              searchable={false}
              onChange={(value) =>
                setFilters((p) => ({
                  ...p,
                  gender: value,
                }))
              }
              options={[
                {
                  label: "همه",
                  value: null,
                },
                {
                  label: "مرد",
                  value: EArtistGender.MAN,
                },
                {
                  label: "زن",
                  value: EArtistGender.WOMAN,
                },
              ]}
              customInput={(isOpen) => (
                <Chip
                  label={filters.gender ?? "جنسیت"}
                  filled={isOpen || filters.gender !== null}
                  leftIcon={<ChevronDown className={chevronCn(isOpen)} />}
                />
              )}
            />

            <UiKitSelect
              value={filters.city__in}
              mode="multiple"
              searchable={false}
              onChange={(value) =>
                setFilters((p) => ({ ...p, city__in: value }))
              }
              options={
                provinceData?.result?.map((item) => ({
                  label: item.name,
                  value: item.id,
                })) ?? []
              }
              customInput={(isOpen) => (
                <Chip
                  label="استان"
                  badgeNumber={filters.city__in.length || undefined}
                  filled={isOpen || filters.city__in.length > 0}
                  leftIcon={<ChevronDown className={chevronCn(isOpen)} />}
                />
              )}
            />
          </div>
        )}
      </div>

      {!data?.result && (
        <div className="flex flex-wrap flex-col gap-4">
          {rows.map((row, rowIndex) => (
            <div key={rowIndex} className="flex flex-wrap justify-center gap-4">
              {row.map((item) => (
                <button
                  key={item.title}
                  onClick={() => {
                    setFilters((p) => ({ ...p, categoryId__in: [item.id] }));
                  }}
                  className="md:w-60 overflow-hidden w-36 h-20 relative px-4 pb-6 md:pb-0 md:pt-3 bg-zinc-900 rounded-2xl flex items-center gap-4 md:gap-0 md:justify-between border border-transparent hover:border-red-900 cursor-pointer"
                >
                  <p className="text-nowrap text-sm md:text-base z-1">
                    {item.title}
                  </p>
                  <MoveLeft className="text-error-500 z-1" />
                  <Image
                    src={item.image}
                    width={90}
                    height={90}
                    alt={item.title}
                    className="absolute md:relative left-3 md:left-0 bottom-0 z-0 w-12.5 h-12.5 md:w-auto md:h-auto"
                  />
                </button>
              ))}
            </div>
          ))}
        </div>
      )}

      {data?.result.length === 0 ? (
        <NotFoundSearch />
      ) : (
        <div className="grid gap-4 md:grid-cols-4">
          {data?.result &&
            results.map((item) => <ArtistCard key={item.id} artist={item} />)}
        </div>
      )}

      <div className="w-170 h-170 rounded-full absolute opacity-20 -bottom-44 -right-96 -z-1 bg-radial-primary" />
      <div className="w-170 h-170 rounded-full absolute opacity-20 bottom-12 -left-96 -z-1 bg-radial-primary" />
    </div>
  );
}
