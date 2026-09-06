"use client";
/* eslint-disable @next/next/no-img-element */

import { useUserTutorialList } from "@/lib/services/landing/hook";
import Link from "next/link";
import { useLandingCopy } from "@/lib/hooks/useLandingCopy";

const PREVIEW_COUNT = 4;
const RAIL_COUNT = 8;

export function TutorialsSection({ variant = "grid" }: { variant?: string }) {
  const { data } = useUserTutorialList();
  const copy = useLandingCopy();
  const isRail = variant === "rail";
  const tutorials = (data?.result ?? []).slice(0, isRail ? RAIL_COUNT : PREVIEW_COUNT);

  if (tutorials.length === 0) return null;

  const cards = tutorials.map((tutorial) => (
    <Link
      key={tutorial.id}
      href="/tutorials"
      className={`flex flex-col gap-2 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/60 transition-colors hover:border-error-500/40 ${
        isRail ? "w-56 shrink-0 md:w-72" : ""
      }`}
    >
      <div className="relative aspect-video w-full bg-zinc-800">
        {tutorial.thumbnail && (
          <img
            src={tutorial.thumbnail}
            alt={tutorial.title}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
      </div>
      <p className="line-clamp-2 px-3 pb-3 text-xs font-medium text-zinc-100 md:text-sm">
        {tutorial.title}
      </p>
    </Link>
  ));

  return (
    <section className={isRail ? "-mx-4" : undefined}>
      <div
        className={`mb-3 flex items-center justify-between md:mb-4 ${isRail ? "px-4" : ""}`}
      >
        <h2 className="text-sm font-semibold text-zinc-100 md:text-lg">
          {copy("tutorialsSectionTitle")}
        </h2>
        <Link href="/tutorials" className="text-xs text-error-500 md:text-sm">
          {copy("tutorialsSectionCta")}
        </Link>
      </div>

      {isRail ? (
        <div className="overflow-x-auto scrollbar-hidden">
          <div className="flex w-max gap-3 px-4 pb-1 md:gap-4">{cards}</div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">{cards}</div>
      )}
    </section>
  );
}
