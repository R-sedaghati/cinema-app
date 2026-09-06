"use client";
/* eslint-disable @next/next/no-img-element */

import { useUserTutorialList } from "@/lib/services/landing/hook";
import Link from "next/link";
import { useLandingCopy } from "@/lib/hooks/useLandingCopy";

const PREVIEW_COUNT = 4;
const RAIL_COUNT = 8;
/** How many items each layout shows — denser layouts can afford more. */
const COUNT: Record<string, number> = {
  rail: RAIL_COUNT,
  list: 5,
  text: 8,
};

export function TutorialsSection({ variant = "grid" }: { variant?: string }) {
  const { data } = useUserTutorialList();
  const copy = useLandingCopy();
  const isRail = variant === "rail";
  const tutorials = (data?.result ?? []).slice(0, COUNT[variant] ?? PREVIEW_COUNT);

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

      {variant === "list" ? (
        <div className="divide-y divide-zinc-800 border-y border-zinc-800">
          {tutorials.map((tutorial) => (
            <Link
              key={tutorial.id}
              href="/tutorials"
              className="flex items-center gap-3 py-2.5 transition-colors hover:bg-zinc-900/60"
            >
              <div className="relative h-12 w-20 shrink-0 overflow-hidden rounded-lg bg-zinc-800 md:h-14 md:w-24">
                {tutorial.thumbnail && (
                  <img
                    src={tutorial.thumbnail}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                )}
              </div>
              <p className="line-clamp-2 flex-1 text-xs font-medium text-zinc-100 md:text-sm">
                {tutorial.title}
              </p>
            </Link>
          ))}
        </div>
      ) : variant === "text" ? (
        <ul className="columns-1 gap-6 md:columns-2">
          {tutorials.map((tutorial) => (
            <li key={tutorial.id} className="mb-1.5 break-inside-avoid">
              <Link
                href="/tutorials"
                className="block truncate text-sm text-zinc-200 hover:text-error-400 md:text-base"
              >
                {tutorial.title}
              </Link>
            </li>
          ))}
        </ul>
      ) : isRail ? (
        <div className="overflow-x-auto scrollbar-hidden">
          <div className="flex w-max gap-3 px-4 pb-1 md:gap-4">{cards}</div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">{cards}</div>
      )}
    </section>
  );
}
