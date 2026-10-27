"use client";
/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import type { ReactNode } from "react";
import { BookOpen, CircleHelp, FileText, LayoutGrid, User } from "lucide-react";
import { useLandingCopy } from "@/lib/hooks/useLandingCopy";
import { toResumeName } from "@/lib/utils/resumeName";
import { matchPages } from "@/lib/constants/searchPages";
import type { GlobalSearchResult } from "@/lib/services/landing/type";
import NotFoundSearch from "@/components/common/NotFoundSearch";
import { ArtistCard } from "@/components/home/sections/ArtistGridSection";

type Item = { key: string; href: string; title: string; subtitle?: string; image?: string | null };
type GroupKey = "artists" | "categories" | "tutorials" | "faqs" | "pages";

/** Full-page grids, matching the home page sections each group mirrors. */
const GRID: Record<GroupKey, string> = {
  artists: "grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 md:gap-5 lg:grid-cols-5",
  categories: "grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4",
  tutorials: "grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4",
  faqs: "grid gap-3 md:grid-cols-2 md:gap-4",
  pages: "grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4",
};

/**
 * A category result opens its registration form; a subcategory opens the parent's form
 * with that subcategory pre-ticked, same as picking it from the registration grid.
 */
const categoryHref = (category: GlobalSearchResult["categories"][number]) =>
  category.parent
    ? `/artist-registration?category=${category.parent.id}&step=1&ids=${category.parent.id},${category.id}`
    : `/artist-registration?category=${category.id}&step=1`;

export function SearchResults({
  query,
  data,
  isPending,
  compact = false,
  onNavigate,
}: {
  query: string;
  data?: GlobalSearchResult;
  isPending: boolean;
  /** Dropdown mode: fewer rows per group and a "see all" link. */
  compact?: boolean;
  onNavigate?: () => void;
}) {
  const copy = useLandingCopy();
  const perGroup = compact ? 3 : Infinity;
  const encoded = encodeURIComponent(query.trim());

  const groups: { key: GroupKey; title: string; icon: ReactNode; items: Item[]; more?: Item }[] = [
    {
      key: "artists" as const,
      title: copy("searchGroupArtists"),
      icon: <User size={16} />,
      items: (data?.artists ?? []).map((artist) => ({
        key: `a${artist.id}`,
        href: `/artists/${artist.id}`,
        title: artist.user?.code ?? "-----",
        subtitle: toResumeName(artist.categories?.at(0)?.faName),
        image: artist.user?.avatar,
      })),
      more:
        !compact && (data?.artistCount ?? 0) > (data?.artists.length ?? 0)
          ? {
              key: "more",
              href: `/artists?search=${encoded}`,
              title: copy("searchMoreArtists", { count: data?.artistCount ?? 0 }),
            }
          : undefined,
    },
    {
      key: "categories" as const,
      title: copy("searchGroupCategories"),
      icon: <LayoutGrid size={16} />,
      items: (data?.categories ?? []).map((category) => ({
        key: `c${category.id}`,
        href: categoryHref(category),
        title: category.faName,
        subtitle: category.parent?.faName ?? category.enName,
        image: category.image,
      })),
    },
    {
      key: "tutorials" as const,
      title: copy("searchGroupTutorials"),
      icon: <BookOpen size={16} />,
      items: (data?.tutorials ?? []).map((tutorial) => ({
        key: `t${tutorial.id}`,
        href: `/tutorials#tutorial-${tutorial.id}`,
        title: tutorial.title,
        image: tutorial.thumbnail,
      })),
    },
    {
      key: "faqs" as const,
      title: copy("searchGroupFaqs"),
      icon: <CircleHelp size={16} />,
      items: (data?.faqs ?? []).map((faq) => ({
        key: `f${faq.id}`,
        href: `/faq?open=${faq.id}`,
        title: faq.question,
      })),
    },
    {
      key: "pages" as const,
      title: copy("searchGroupPages"),
      icon: <FileText size={16} />,
      items: matchPages(query).map((page) => ({ key: page.href, href: page.href, title: page.title })),
    },
  ].filter((group) => group.items.length > 0);

  if (query.trim().length < 2) {
    return compact ? null : (
      <p data-el="body" className="py-10 text-center text-sm text-zinc-500">
        <span style={copy.style("searchTypeMore")}>{copy("searchTypeMore")}</span>
      </p>
    );
  }

  if (groups.length === 0) {
    if (isPending) return null;
    return compact ? (
      <p data-el="body" className="p-4 text-center text-sm text-zinc-500">
        <span style={copy.style("searchEmptyTitle")}>{copy("searchEmptyTitle")}</span>
      </p>
    ) : (
      <NotFoundSearch />
    );
  }

  const row = (item: Item) => (
    <Link
      key={item.key}
      href={item.href}
      onClick={onNavigate}
      className="flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-zinc-800/70"
    >
      {item.image && (
        <img src={item.image} alt="" className="h-9 w-9 shrink-0 rounded-lg object-cover" />
      )}
      <span className="min-w-0">
        <span data-el="result-title" className="block truncate text-sm text-zinc-100">
          {item.title}
        </span>
        {item.subtitle && (
          <span data-el="result-subtitle" className="block truncate text-xs text-zinc-500">
            {item.subtitle}
          </span>
        )}
      </span>
    </Link>
  );

  // Card for the full page; the artist group renders the home ArtistCard instead.
  const card = (groupKey: GroupKey, item: Item) => {
    if (groupKey === "categories") {
      return (
        <Link
          key={item.key}
          href={item.href}
          onClick={onNavigate}
          className="group relative h-40 overflow-hidden rounded-2xl transition-transform active:scale-[.98] md:h-52"
        >
          <img src={item.image ?? "/cat-1.svg"} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-3 text-right">
            <p data-el="card-title" className="text-sm font-semibold leading-tight text-white md:text-base">
              {item.title}
            </p>
            {item.subtitle && (
              <p data-el="card-text" className="mt-0.5 text-xs text-zinc-300">{item.subtitle}</p>
            )}
          </div>
        </Link>
      );
    }

    if (groupKey === "tutorials") {
      return (
        <Link
          key={item.key}
          href={item.href}
          onClick={onNavigate}
          className="flex flex-col gap-2 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/60 transition-colors hover:border-error-500/40"
        >
          <div className="relative flex aspect-video w-full items-center justify-center overflow-hidden bg-zinc-800">
            {item.image ? (
              <img src={item.image} alt={item.title} className="absolute inset-0 h-full w-full object-cover" />
            ) : (
              <BookOpen className="text-zinc-600" size={28} />
            )}
          </div>
          <p data-el="card-title" className="line-clamp-2 px-3 pb-3 text-xs font-medium text-zinc-100 md:text-sm">
            {item.title}
          </p>
        </Link>
      );
    }

    return (
      <Link
        key={item.key}
        href={item.href}
        onClick={onNavigate}
        className="flex items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 transition-colors hover:border-error-500/40 active:scale-[.98]"
      >
        <span className="text-error-500">
          {groupKey === "faqs" ? <CircleHelp size={20} /> : <FileText size={20} />}
        </span>
        <span data-el="card-title" className="line-clamp-2 text-sm font-medium text-zinc-100 md:text-base">
          {item.title}
        </span>
      </Link>
    );
  };

  return (
    <div className={compact ? "space-y-2 p-2" : "space-y-8"}>
      {groups.map((group) => (
        <section key={group.key}>
          <h2
            data-el="group-title"
            className={
              compact
                ? "mb-1 flex items-center gap-2 px-3 text-xs font-semibold text-error-500"
                : "mb-3 flex items-center gap-2 text-sm font-semibold text-zinc-100 md:mb-4 md:text-lg"
            }
          >
            <span className="text-error-500">{group.icon}</span>
            {group.title}
          </h2>
          {compact ? (
            group.items.slice(0, perGroup).map(row)
          ) : (
            <div data-card-grid className={GRID[group.key]}>
              {group.key === "artists"
                ? data?.artists.map((artist) => (
                    <div key={artist.id} data-card>
                      <ArtistCard artist={artist} />
                    </div>
                  ))
                : group.items.map((item) => card(group.key, item))}
            </div>
          )}
          {group.more && (
            <Link
              href={group.more.href}
              onClick={onNavigate}
              className={`block text-sm text-error-500 hover:underline ${compact ? "mt-1 px-3" : "mt-3"}`}
            >
              {group.more.title}
            </Link>
          )}
        </section>
      ))}

      {compact && (
        <Link
          href={`/search?q=${encoded}`}
          onClick={onNavigate}
          className="block border-t border-zinc-800 px-3 pt-2 text-center text-sm text-error-500 hover:underline"
        >
          <span style={copy.style("searchSeeAll")}>{copy("searchSeeAll")}</span>
        </Link>
      )}
    </div>
  );
}
