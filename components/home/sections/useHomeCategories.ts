"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { userCategoryList } from "@/lib/services/landing/api";

/** Shared by the category chips and the registration shortcuts — one query key,
 *  so react-query fetches it once no matter how the sections are ordered. */
export function useHomeCategories() {
  const { data } = useQuery({
    queryKey: ["applicationCategories"],
    queryFn: () => userCategoryList({ page: 1, count: 30 }),
    refetchInterval: 30_000,
    refetchOnWindowFocus: false,
  });

  return useMemo(
    () => [...(data?.result ?? [])].sort((a, b) => a.priority - b.priority),
    [data],
  );
}
