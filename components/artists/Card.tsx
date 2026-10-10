"use client";
/* eslint-disable @next/next/no-img-element */

import { IArtistItem } from "@/lib/services/admin/type";
import { useLandingCopy } from "@/lib/hooks/useLandingCopy";
import { toResumeName } from "@/lib/utils/resumeName";
import {
  ANSWER_KEYS,
  displayAnswer,
  displayGender,
  pickAnswer,
} from "@/lib/utils/artistAnswers";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ArtistCard({
  artist,
}: Readonly<{ artist: IArtistItem }>) {
  const copy = useLandingCopy();
  const genderText = displayGender(pickAnswer(artist?.answers, ANSWER_KEYS.gender), {
    man: copy("labelGenderMan"),
    woman: copy("labelGenderWoman"),
  });
  const cityText = displayAnswer(pickAnswer(artist?.answers, ANSWER_KEYS.city));

  return (
    <Link
      href={`/artists/${artist.id}`}
      className="group rounded-2xl border border-zinc-800 bg-zinc-950/40 p-2 pb-4 hover:border-error-500/50"
    >
      <div className="relative w-full h-27 rounded-lg overflow-hidden bg-zinc-800 mb-4">
        {artist?.user?.avatar ? (
          <img
            src={artist.user.avatar}
            alt={artist.user.code ?? "artist"}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-zinc-800" />
        )}
      </div>
      <div data-el="card-title" className="text-base font-semibold text-zinc-100 group-hover:text-red-300 mb-2">
        {artist?.user?.code ?? "-----"}
      </div>
      <div className="mt-2 flex flex-wrap gap-2 text-xs">
        <span data-el="card-meta" className="rounded-full bg-zinc-500 px-2 py-1 text-zinc-100 ring-1 ring-zinc-800">
          {toResumeName(artist?.categories?.at(0)?.faName)}
        </span>
        {genderText && (
          <span data-el="card-meta" className="rounded-full bg-zinc-500 px-2 py-1 text-zinc-100 ring-1 ring-zinc-800">
            {genderText}
          </span>
        )}
        <span data-el="card-meta" className="rounded-full bg-zinc-500 px-2 py-1 text-zinc-100 ring-1 ring-zinc-800">
          {cityText ?? ""}
        </span>
      </div>
      <p data-el="card-text" className="mt-4 mb-3 line-clamp-2 text-sm leading-7 text-zinc-400">
        {artist?.answers?.aboutMe as string | undefined}
      </p>
      <div className="flex items-center justify-end">
        <p data-el="card-link" className="text-error-500 font-p2-medium"><span style={copy.style("artistsCardCta")}>{copy("artistsCardCta")}</span></p>
        <ArrowLeft className="text-error-500 self-start mx-1.5" />
      </div>
    </Link>
  );
}
