"use client";

import { useParams, useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { WorksSlider } from "@/components/media/WorksSlider";
import Aside from "@/components/artists/detail/Aside";
import { useUserArtistDetail } from "@/lib/services/landing/hook";
import { useLandingCopy } from "@/lib/hooks/useLandingCopy";

export default function ArtistDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = Number(params.id);
  const copy = useLandingCopy();

  const { data, isPending } = useUserArtistDetail(id || undefined);
  const artist = data?.result;

  if (!isPending && !artist) notFound();

  if (isPending || !artist) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-error-500 border-t-transparent" />
      </div>
    );
  }

  const photoWorks = artist.portfolios
    .filter((p) => p.type === "IMAGE")
    .map((p) => ({ id: String(p.id), url: p.url }));

  const videoWorks = artist.portfolios
    .filter((p) => p.type === "VIDEO")
    .map((p) => ({ id: String(p.id), url: p.url }));

  return (
    <div className="relative min-h-screen px-3 sm:px-6 py-16">
      <div className="pointer-events-none absolute inset-0">
        <div
          className="w-170 h-170 rounded-full absolute opacity-20 -bottom-44 -right-96 -z-1
        bg-radial-primary"
        />
        <div
          className="w-170 h-170 rounded-full absolute opacity-20 -top-32 -left-96 -z-1
        bg-radial-primary"
        />
      </div>

      <button
        type="button"
        onClick={() => router.back()}
        className="relative mx-auto mb-6 flex w-full max-w-7xl cursor-pointer items-center gap-2 text-sm text-zinc-300 transition-colors hover:text-zinc-50"
      >
        <ArrowRight size={20} />
        {copy("actionBack")}
      </button>

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="mt-16 lg:mt-0">
          <Aside artist={artist} />
        </div>
        <div className="space-y-3 sm:space-y-4 lg:col-span-2">
          <section className="rounded-3xl border-2 border-zinc-800 bg-zinc-900/90 p-5 sm:p-8 shadow-2xl backdrop-blur">
            <h2 className="text-lg sm:text-xl font-h1-regular text-error-500">{copy("artistAboutTitle")}</h2>
            <p className="mt-4 sm:mt-6 text-sm leading-8 text-zinc-300">
              {(artist.answers?.aboutMe as string | undefined) ?? "—"}
            </p>
          </section>

          <section className="rounded-3xl border-2 border-zinc-800 bg-zinc-900/90 p-5 sm:p-8 shadow-2xl backdrop-blur">
            <h2 className="text-lg sm:text-xl font-h1-regular text-error-500">{copy("artistPhotosTitle")}</h2>
            <WorksSlider title="" items={photoWorks} variant="photo" />
          </section>

          <section className="rounded-3xl border-2 border-zinc-800 bg-zinc-900/90 p-5 sm:p-8 shadow-2xl backdrop-blur">
            <h2 className="text-lg sm:text-xl font-h1-regular text-error-500">{copy("artistVideosTitle")}</h2>
            <WorksSlider title="" items={videoWorks} variant="video" />
          </section>
        </div>
      </div>
    </div>
  );
}
