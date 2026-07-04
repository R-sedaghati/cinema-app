"use client";

import { useUserTutorialList } from "@/lib/services/landing/hook";
import Link from "next/link";
import Image from "next/image";

const PREVIEW_COUNT = 4;

export function TutorialSection() {
  const { data } = useUserTutorialList();
  const tutorials = (data?.result ?? []).slice(0, PREVIEW_COUNT);

  if (tutorials.length === 0) return null;

  return (
    <section>
      <div className="flex items-center justify-between mb-3 md:mb-4">
        <h2 className="text-sm md:text-lg font-semibold text-zinc-100">آموزش‌ها</h2>
        <Link href="/tutorials" className="text-xs md:text-sm text-error-500">
          همه
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {tutorials.map((tutorial) => (
          <Link
            key={tutorial.id}
            href="/tutorials"
            className="flex flex-col gap-2 rounded-2xl border border-zinc-800 bg-zinc-900/60 overflow-hidden hover:border-error-500/40 transition-colors"
          >
            <div className="relative w-full aspect-video bg-gray-100">
              {tutorial.thumbnail && (
                <Image
                  src={tutorial.thumbnail}
                  alt={tutorial.title}
                  fill
                  className="object-cover"
                />
              )}
            </div>
            <p className="px-3 pb-3 text-xs md:text-sm font-medium text-zinc-100 line-clamp-2">
              {tutorial.title}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
