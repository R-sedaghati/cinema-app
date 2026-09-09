"use client";
/* eslint-disable @next/next/no-img-element */

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLandingCopy } from "@/lib/hooks/useLandingCopy";
import { useArtistRegistrationStore } from "@/lib/stores/useUserArtist";
import useAuthStore from "@/lib/stores/useAuthStore";
import useLoginDrawerStore from "@/lib/stores/useLoginDrawerStore";
import { useHomeCategories } from "./useHomeCategories";

export function RegistrationRowSection({
  variant = "posters",
}: {
  variant?: string;
}) {
  const router = useRouter();
  const copy = useLandingCopy();
  const categories = useHomeCategories();
  const { isLoggedIn } = useAuthStore();
  const { open } = useLoginDrawerStore();
  const { setSelectedCategory, setStep, reset, setField } =
    useArtistRegistrationStore();

  const handleCategoryShortcut = (id: number, title: string) => {
    reset();
    setField("categoryId", [id]);
    setSelectedCategory(id, title);
    setStep(1);
    router.push(`/artist-registration?category=${id}&step=1`);
  };

  const onPick = (id: number, title: string) =>
    isLoggedIn ? handleCategoryShortcut(id, title) : open();

  const header = (padded: boolean) => (
    <div
      className={`mb-3 flex items-center justify-between md:mb-4 ${padded ? "px-4" : ""}`}
    >
      <h2 className="text-sm font-semibold text-zinc-100 md:text-lg">
        {copy("homeRegistrationTitle")}
      </h2>
      <Link href="/profile" className="text-xs text-error-500 md:text-sm">
        {copy("homeRegistrationCta")}
      </Link>
    </div>
  );

  // Credits-roll reading: one line per craft, hairline separated, no images.
  if (variant === "list") {
    return (
      <section>
        {header(false)}
        <div className="divide-y divide-zinc-800 border-y border-zinc-800">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onPick(cat.id, cat.faName)}
              className="flex w-full items-center justify-between gap-3 py-3 text-right transition-colors hover:bg-zinc-900/60"
            >
              <span className="flex flex-col">
                <span className="text-sm font-medium text-zinc-100 md:text-base">
                  {cat.faName}
                </span>
                {cat.description && (
                  <span className="text-xs text-zinc-500">{cat.description}</span>
                )}
              </span>
              <ArrowLeft size={16} className="shrink-0 text-zinc-600" />
            </button>
          ))}
        </div>
      </section>
    );
  }

  // Pills: the whole catalog at a glance, no imagery, wraps on any width.
  if (variant === "chips") {
    return (
      <section>
        {header(false)}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onPick(cat.id, cat.faName)}
              className="rounded-full border border-zinc-800 px-3 py-1.5 text-sm text-zinc-200 transition-colors hover:border-error-500/40 hover:text-error-400 active:scale-[.98] md:px-4 md:py-2"
            >
              {cat.faName}
            </button>
          ))}
        </div>
      </section>
    );
  }

  // Text-only columns: cheapest possible rendering of the same shortcuts.
  if (variant === "columns") {
    return (
      <section>
        {header(false)}
        <div className="columns-2 gap-6 md:columns-3 lg:columns-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onPick(cat.id, cat.faName)}
              className="mb-1.5 block w-full break-inside-avoid truncate text-right text-sm text-zinc-200 transition-colors hover:text-error-400 md:text-base"
            >
              {cat.faName}
            </button>
          ))}
        </div>
      </section>
    );
  }

  if (variant === "grid") {
    return (
      <section>
        {header(false)}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onPick(cat.id, cat.faName)}
              className="group relative h-40 overflow-hidden rounded-2xl transition-transform active:scale-[.98] md:h-52"
            >
              <img
                src={cat.image ?? "/cat-1.svg"}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-3 text-right">
                <p className="text-sm font-semibold leading-tight text-white md:text-base">
                  {cat.faName}
                </p>
              </div>
            </button>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="-mx-4">
      {header(true)}
      <div className="overflow-x-auto scrollbar-hidden">
        <div className="flex gap-3 md:gap-4 w-max px-4 pb-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onPick(cat.id, cat.faName)}
              className="relative overflow-hidden w-40 h-52 md:w-56 md:h-72 shrink-0 rounded-2xl group active:scale-[.98] transition-transform"
            >
              <img
                src={cat.image ?? "/cat-1.svg"}
                alt={cat.faName}
                className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-3 md:p-4 text-right">
                <p className="text-sm md:text-lg font-semibold text-white leading-tight">
                  {cat.faName}
                </p>
                <span className="inline-flex items-center gap-1 text-xs md:text-sm text-error-400 mt-1.5">
                  {copy("homeRegistrationCta")}
                  <ArrowLeft size={12} />
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
