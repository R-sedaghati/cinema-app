"use client";
/* eslint-disable @next/next/no-img-element */

import { ArrowRight, MoveLeft, Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { mobileSplitPattern, splitPattern } from "@/lib/utils/split-pattern";
import ArtistCard from "./Card";
import NotFoundSearch from "../common/NotFoundSearch";
import { Button, Input } from "@dgshahr/ui-kit";
import { ArtistFilterBar } from "./filters/ArtistFilterBar";
import { CategoryChips } from "./filters/CategoryChips";
import { buildParams } from "./filters/buildParams";
import {
  useUserArtistListInfinite,
  useUserCategoryFilters,
  useUserCategoryList,
} from "@/lib/services/landing/hook";
import useDebounce from "@/lib/hooks/useDebounce";
import { useIsMobile } from "@/lib/hooks/useIsMobile";
import { useArtistSearchParams } from "@/lib/hooks/useArtistSearchParams";
import { useEffect, useState } from "react";
import { useLandingCopy } from "@/lib/hooks/useLandingCopy";

const PAGE_SIZE = 12;

/**
 * Category names carry ZWNJ ("تهیه\u200cکنندگی") and admins type both the Arabic and the
 * Persian forms of ی/ک, so a raw `includes` misses tiles the user clearly meant.
 */
const normalizeFa = (value: string) =>
  value.replace(/\u200c/g, "").replace(/\u064a/g, "\u06cc").replace(/\u0643/g, "\u06a9").trim();

export function ArtistsSearchClient() {
  const copy = useLandingCopy();
  const {
    categoryId,
    search,
    selections,
    ranges,
    activeFilterCount,
    setCategory,
    setSearch,
    setSelection,
    setRange,
    clearFilters,
  } = useArtistSearchParams();

  // The input is local so typing doesn't push a history entry per keystroke.
  const [queryDraft, setQueryDraft] = useState(search);
  const debouncedQuery = useDebounce(queryDraft, 500);
  const isMobile = useIsMobile();
  const router = useRouter();

  useEffect(() => {
    if (debouncedQuery !== search) setSearch(debouncedQuery);
    // `search` is intentionally omitted: reacting to it would fight the draft state.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery]);

  // A back-navigation or a shared link changes the URL without touching the draft.
  useEffect(() => {
    if (search !== debouncedQuery) setQueryDraft(search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const { data: categoryData } = useUserCategoryList({ page: 1, count: 30 });
  const categories = categoryData?.result ?? [];

  const { data: filtersData, isPending: filtersPending } =
    useUserCategoryFilters(categoryId);
  const descriptors = filtersData?.result ?? [];

  // buildParams maps filter keys onto query params via the descriptors, so searching
  // before they land would silently drop every filter from a deep-linked URL.
  const filtersReady = !categoryId || !filtersPending;

  const { data, isPending, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useUserArtistListInfinite(
      buildParams({ categoryId, search, selections, ranges, descriptors }),
      PAGE_SIZE,
      filtersReady,
    );

  const artists = data?.pages.flatMap((page) => page.result ?? []) ?? [];
  const total = data?.pages.at(0)?.count ?? artists.length;
  // Tile filtering follows the draft, not the committed `search`, so the grid reacts to
  // the keystroke instead of waiting out the 500ms debounce the artist query needs.
  const tileQuery = normalizeFa(queryDraft);
  const visibleCategories = tileQuery
    ? categories.filter(
        (item) =>
          normalizeFa(item.faName).includes(tileQuery) ||
          item.children?.some((child) =>
            normalizeFa(child.faName).includes(tileQuery),
          ),
      )
    : categories;

  const rows = isMobile
    ? mobileSplitPattern(visibleCategories)
    : splitPattern(visibleCategories);

  return (
    <div className="space-y-12 relative">
      <button
        type="button"
        onClick={() => router.back()}
        className="flex cursor-pointer items-center gap-2 text-sm text-zinc-300 transition-colors hover:text-zinc-50"
      >
        <ArrowRight size={20} />
        {copy("actionBack")}
      </button>

      <div className="flex flex-col items-center justify-center gap-5">
        <h1 className="text-[24px] ma:text-[32px] text-zinc-50 w-full text-center">
          {categoryId ? copy("artistsTitle") : copy("artistsSubtitle")}
        </h1>

        <div className="relative md:w-131.5 w-full">
          <Input
            value={queryDraft}
            onChange={(e) => setQueryDraft(e.target.value)}
            placeholder={copy("artistsSearchPlaceholder")}
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
          <>
            <CategoryChips
              categories={categories}
              categoryId={categoryId}
              onSelect={setCategory}
            />

            <ArtistFilterBar
              descriptors={descriptors}
              isPending={filtersPending}
              selections={selections}
              ranges={ranges}
              activeFilterCount={activeFilterCount}
              onSelectionChange={setSelection}
              onRangeChange={setRange}
              onClear={clearFilters}
            />
          </>
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
                  <img
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
            <p className="text-sm text-zinc-500">
              {copy("artistsCount", { count: total })}
            </p>
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
                {isFetchingNextPage ? copy("artistsLoading") : copy("artistsLoadMore")}
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
