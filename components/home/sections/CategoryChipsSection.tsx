"use client";
/* eslint-disable @next/next/no-img-element */

import { useRouter } from "next/navigation";
import { useLandingCopy } from "@/lib/hooks/useLandingCopy";
import { useHomeCategories } from "./useHomeCategories";

export function CategoryChipsSection({ variant = "chips" }: { variant?: string }) {
  const router = useRouter();
  const copy = useLandingCopy();
  const categories = useHomeCategories();

  if (categories.length === 0) return null;

  if (variant === "tiles") {
    return (
      <div className="grid grid-cols-3 gap-2 md:grid-cols-6 md:gap-3">
        <button
          onClick={() => router.push("/artists")}
          className="flex aspect-square flex-col items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900/60 text-xs font-medium text-zinc-300 transition-colors hover:border-error-500/40 md:text-sm"
        >
          {copy("homeAllLabel")}
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => router.push(`/artists?category=${cat.id}`)}
            className="group relative aspect-square overflow-hidden rounded-2xl"
          >
            <img
              src={cat.image ?? "/cat-1.svg"}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 to-black/10" />
            <span className="absolute inset-x-0 bottom-0 p-2 text-xs font-medium text-zinc-100 md:text-sm">
              {cat.faName}
            </span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto md:overflow-visible scrollbar-hidden pb-1">
      <div className="flex gap-2 w-max md:w-auto md:flex-wrap">
        <button
          onClick={() => router.push("/artists")}
          className="rounded-full px-4 py-2 md:px-5 md:py-2.5 text-xs md:text-sm font-medium transition-colors whitespace-nowrap bg-zinc-800 text-zinc-400 hover:text-zinc-200"
        >
          {copy("homeAllLabel")}
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => router.push(`/artists?category=${cat.id}`)}
            className="flex flex-col items-start gap-0.5 rounded-2xl px-4 py-2 md:px-5 md:py-2.5 text-xs md:text-sm font-medium transition-colors whitespace-nowrap bg-zinc-800 text-zinc-400 hover:text-zinc-200"
          >
            <span>{cat.faName}</span>
            {cat.description && (
              <span className="text-[10px] md:text-xs font-normal text-zinc-500">
                {cat.description}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
