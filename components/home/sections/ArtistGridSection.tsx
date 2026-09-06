"use client";
/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { userArtsitList } from "@/lib/services/landing/api";
import { IArtistItem } from "@/lib/services/admin/type";
import { useLandingCopy } from "@/lib/hooks/useLandingCopy";

const SKELETON_KEYS = ["sk-0", "sk-1", "sk-2", "sk-3", "sk-4", "sk-5"];

export function ArtistGridSection({ variant = "grid" }: { variant?: string }) {
  const copy = useLandingCopy();
  const { data, isLoading } = useQuery({
    queryKey: ["applicationArtists"],
    queryFn: () => userArtsitList(undefined),
    refetchInterval: 30_000,
    refetchOnWindowFocus: false,
  });

  const artists = data?.result ?? [];
  const isRail = variant === "rail";

  return (
    <section className={isRail ? "-mx-4" : undefined}>
      <div
        className={`mb-3 flex items-center justify-between md:mb-4 ${isRail ? "px-4" : ""}`}
      >
        <h2 className="text-sm font-semibold text-zinc-100 md:text-lg">
          {copy("homeArtistsTitle")}
        </h2>
        <Link href="/artists" className="text-xs text-error-500 md:text-sm">
          {copy("homeArtistsCta")}
        </Link>
      </div>

      {isLoading ? (
        <Skeleton variant={variant} />
      ) : artists.length === 0 ? (
        <Empty message={copy("homeEmptyArtists")} />
      ) : variant === "castlist" ? (
        <CastList artists={artists} />
      ) : isRail ? (
        <div className="overflow-x-auto scrollbar-hidden">
          <div className="flex w-max gap-3 px-4 pb-1 md:gap-5">
            {artists.map((artist) => (
              <div key={artist.id} className="w-36 shrink-0 md:w-44">
                <ArtistCard artist={artist} />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 md:gap-5 lg:grid-cols-5">
          {artists.map((artist) => (
            <ArtistCard key={artist.id} artist={artist} />
          ))}
        </div>
      )}
    </section>
  );
}

/** Dense cast-list reading: portrait, name, craft, city on one line each. */
function CastList({ artists }: { artists: IArtistItem[] }) {
  return (
    <div className="divide-y divide-zinc-800 border-y border-zinc-800">
      {artists.map((artist) => {
        const name = [artist.user.firstName, artist.user.lastName]
          .filter(Boolean)
          .join(" ");
        const craft = artist.categories?.[0]?.faName;
        // A profile can exist before its name does. The row still needs a
        // primary label, so the craft moves up rather than leaving it blank.
        const primary = name || craft;

        return (
          <Link
            key={artist.id}
            href={`/artists/${artist.id}`}
            className="flex items-center gap-3 py-2.5 transition-colors hover:bg-zinc-900/60"
          >
            <div className="h-11 w-11 shrink-0 overflow-hidden rounded-full bg-zinc-800 md:h-12 md:w-12">
              {artist.user.avatar && (
                <img
                  src={artist.user.avatar}
                  alt=""
                  className="h-full w-full object-cover"
                />
              )}
            </div>
            <span className="min-w-0 flex-1 truncate text-sm font-medium text-zinc-100 md:text-base">
              {primary}
            </span>
            {name && craft && (
              <span className="shrink-0 text-xs text-zinc-400 md:text-sm">
                {craft}
              </span>
            )}
            {typeof artist.answers?.city === "string" && artist.answers.city && (
              <span className="hidden shrink-0 text-xs text-zinc-600 md:inline md:text-sm">
                {artist.answers.city as string}
              </span>
            )}
          </Link>
        );
      })}
    </div>
  );
}

function Skeleton({ variant }: { variant: string }) {
  if (variant === "castlist") {
    return (
      <div className="divide-y divide-zinc-800 border-y border-zinc-800">
        {SKELETON_KEYS.map((k) => (
          <div key={k} className="flex items-center gap-3 py-2.5">
            <div className="h-11 w-11 shrink-0 animate-pulse rounded-full bg-zinc-800" />
            <div className="h-3 w-1/3 animate-pulse rounded-full bg-zinc-800" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 md:gap-5 lg:grid-cols-5">
      {SKELETON_KEYS.map((k) => (
        <div
          key={k}
          className="animate-pulse rounded-2xl border border-zinc-800 bg-zinc-900/60 p-3 md:p-4"
        >
          <div className="mb-3 aspect-square w-full rounded-xl bg-zinc-800" />
          <div className="mb-2 h-3 w-3/4 rounded-full bg-zinc-800" />
          <div className="h-2.5 w-1/2 rounded-full bg-zinc-800" />
        </div>
      ))}
    </div>
  );
}

function Empty({ message }: { message: string }) {
  return (
    <div className="py-16 text-center">
      <img
        src="/not-found-search.svg"
        alt=""
        width={72}
        height={72}
        className="mx-auto mb-4 opacity-30"
      />
      <p className="text-sm text-zinc-500">{message}</p>
    </div>
  );
}

function ArtistCard({ artist }: { artist: IArtistItem }) {
  const copy = useLandingCopy();

  return (
    <Link
      href={`/artists/${artist.id}`}
      className="flex h-full flex-col rounded-2xl border border-zinc-800 bg-zinc-900/60 p-3 transition-colors hover:border-error-500/40 active:scale-[.98] md:p-4"
    >
      <div className="mb-3 aspect-square w-full overflow-hidden rounded-xl bg-zinc-800 md:mb-4">
        {artist.user.avatar ? (
          <img
            src={artist.user.avatar}
            alt=""
            width={200}
            height={200}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="text-2xl font-bold text-zinc-600 md:text-3xl">
              {artist.user.firstName?.[0] ?? copy("avatarFallback")}
            </span>
          </div>
        )}
      </div>

      <p className="truncate text-sm font-semibold leading-tight text-zinc-100 transition-colors group-hover:text-error-400 md:text-base">
        {artist.user.firstName} {artist.user.lastName}
      </p>

      <div className="mt-1.5 flex flex-col gap-1 md:mt-2">
        {artist.categories?.[0] && (
          <span className="inline-block w-fit rounded-full bg-zinc-800 px-2 py-0.5 text-xs text-zinc-400 md:px-2.5 md:py-1 md:text-sm">
            {artist.categories[0].faName}
          </span>
        )}
        {typeof artist.answers?.city === "string" && artist.answers.city && (
          <span className="text-xs text-zinc-600 md:text-sm">
            {artist.answers.city as string}
          </span>
        )}
      </div>
    </Link>
  );
}
