"use client";

import { Search } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLandingCopy } from "@/lib/hooks/useLandingCopy";

export function SearchHeaderSection({ variant = "stacked" }: { variant?: string }) {
  const router = useRouter();
  const copy = useLandingCopy();
  const [search, setSearch] = useState("");

  const submit = () => {
    if (search.trim()) {
      router.push(`/artists?search=${encodeURIComponent(search.trim())}`);
    }
  };

  const input = (
    <div className="relative">
      <Search
        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500"
        size={18}
      />
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && submit()}
        placeholder={copy("homeSearchPlaceholder")}
        className="w-full rounded-2xl py-3.5 md:py-4 pr-10 pl-4 text-sm md:text-base outline-none focus:ring-1 focus:ring-error-500/60 border border-zinc-700/40 bg-zinc-900/60"
      />
    </div>
  );

  if (variant === "marquee") {
    return (
      <div className="py-8 text-center md:py-14">
        <h1 className="mx-auto max-w-2xl text-3xl font-bold leading-tight text-zinc-100 md:text-5xl">
          {copy("homeExploreKicker")}
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-zinc-500 md:text-base">
          {copy("homeExploreTitle")}
        </p>
        <div className="mx-auto mt-6 max-w-xl md:mt-8">{input}</div>
      </div>
    );
  }

  return (
    <div className="pt-5 md:pt-8 pb-3 md:pb-5 space-y-3 md:space-y-4">
      <div>
        <h1 className="text-xl md:text-3xl font-bold text-zinc-100">
          {copy("homeExploreKicker")}
        </h1>
        <p className="text-xs md:text-sm text-zinc-500 mt-0.5 md:mt-1">
          {copy("homeExploreTitle")}
        </p>
      </div>
      <div className="md:w-131.5">{input}</div>
    </div>
  );
}
