"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

/**
 * Artist search state lives in the URL so a filtered search is shareable and the back
 * button steps through it.
 *
 * Shape: `?category=3&search=مهسا&f_city=تهران,کرج&f_height_min=170`
 * The `f_` prefix keeps schema-derived filter keys from colliding with `category`/`search`.
 */
const FILTER_PREFIX = "f_";
const MIN_SUFFIX = "_min";
const MAX_SUFFIX = "_max";

export interface RangeValue {
  min?: string;
  max?: string;
}

export function useArtistSearchParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const categoryId = Number(searchParams.get("category")) || null;
  const search = searchParams.get("search") ?? "";

  const { selections, ranges } = useMemo(() => {
    const selections: Record<string, string[]> = {};
    const ranges: Record<string, RangeValue> = {};

    for (const [param, value] of searchParams.entries()) {
      if (!param.startsWith(FILTER_PREFIX) || !value) continue;
      const name = param.slice(FILTER_PREFIX.length);

      if (name.endsWith(MIN_SUFFIX)) {
        const key = name.slice(0, -MIN_SUFFIX.length);
        ranges[key] = { ...ranges[key], min: value };
      } else if (name.endsWith(MAX_SUFFIX)) {
        const key = name.slice(0, -MAX_SUFFIX.length);
        ranges[key] = { ...ranges[key], max: value };
      } else {
        selections[name] = value.split(",").filter(Boolean);
      }
    }

    return { selections, ranges };
  }, [searchParams]);

  const commit = useCallback(
    (next: URLSearchParams) => {
      const query = next.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    },
    [pathname, router],
  );

  const setParam = useCallback(
    (param: string, value: string | null) => {
      const next = new URLSearchParams(searchParams.toString());
      if (value) next.set(param, value);
      else next.delete(param);
      commit(next);
    },
    [commit, searchParams],
  );

  /** Switching category drops every filter — they belong to the previous field's schema. */
  const setCategory = useCallback(
    (id: number | null) => {
      const next = new URLSearchParams();
      const currentSearch = searchParams.get("search");
      if (id) next.set("category", String(id));
      if (currentSearch) next.set("search", currentSearch);
      commit(next);
    },
    [commit, searchParams],
  );

  const setSearch = useCallback(
    (value: string) => setParam("search", value || null),
    [setParam],
  );

  const setSelection = useCallback(
    (key: string, values: string[]) =>
      setParam(`${FILTER_PREFIX}${key}`, values.length ? values.join(",") : null),
    [setParam],
  );

  const toggleSelection = useCallback(
    (key: string, value: string) => {
      const current = selections[key] ?? [];
      setSelection(
        key,
        current.includes(value)
          ? current.filter((item) => item !== value)
          : [...current, value],
      );
    },
    [selections, setSelection],
  );

  const setRange = useCallback(
    (key: string, bound: "min" | "max", value: string) =>
      setParam(
        `${FILTER_PREFIX}${key}${bound === "min" ? MIN_SUFFIX : MAX_SUFFIX}`,
        value || null,
      ),
    [setParam],
  );

  const clearFilters = useCallback(() => {
    const next = new URLSearchParams();
    const category = searchParams.get("category");
    const currentSearch = searchParams.get("search");
    if (category) next.set("category", category);
    if (currentSearch) next.set("search", currentSearch);
    commit(next);
  }, [commit, searchParams]);

  const activeFilterCount =
    Object.values(selections).reduce((total, values) => total + values.length, 0) +
    Object.values(ranges).filter((range) => range.min || range.max).length;

  return {
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
  };
}
