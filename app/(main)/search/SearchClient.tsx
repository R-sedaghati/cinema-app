"use client";

import { useSearchParams } from "next/navigation";
import { useGlobalSearch } from "@/lib/services/landing/hook";
import { useLandingCopy } from "@/lib/hooks/useLandingCopy";
import { SearchResults } from "@/components/search/SearchResults";

export function SearchClient() {
  const copy = useLandingCopy();
  const query = useSearchParams().get("q") ?? "";
  const { data, isPending } = useGlobalSearch(query, 20);

  return (
    <div className="space-y-8">
      <h1 data-el="title" className="text-xl font-bold text-zinc-100 md:text-3xl">
        <span style={copy.style("searchPageTitle")}>{copy("searchPageTitle", { q: query })}</span>
      </h1>
      <SearchResults query={query} data={data} isPending={isPending} />
    </div>
  );
}
