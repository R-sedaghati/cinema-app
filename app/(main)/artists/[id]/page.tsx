import { notFound } from "next/navigation";
import { artistsMock } from "@/lib/mock/artists";
import { WorksSlider } from "@/components/media/WorksSlider";
import Aside from "@/components/artists/detail/Aside";

export default async function ArtistDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const artist = artistsMock.find((a) => a.id === id);

  if (!artist) notFound();

  return (
    <div className="relative min-h-screen px-6 py-16">
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

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-4 lg:grid-cols-3">
        <Aside id={id} />
        <div className="space-y-4 lg:col-span-2">
          <section className="rounded-3xl border-2 border-zinc-800 bg-zinc-900/90 p-8 shadow-2xl backdrop-blur">
            <h2 className="text-xl font-h1-regular text-error-500">
              درباره من
            </h2>
            <p className="mt-6 space-y-2 text-sm leading-8 text-zinc-300">
              {artist.about}
            </p>
          </section>

          <section className="rounded-3xl border-2 border-zinc-800 bg-zinc-900/90 p-8 shadow-2xl backdrop-blur">
            <h2 className="text-xl font-h1-regular text-error-500">
              نمونه کارهای تصویری
            </h2>
            <WorksSlider title="" items={artist.photoWorks} variant="photo" />
          </section>

          <section className="rounded-3xl border-2 border-zinc-800 bg-zinc-900/90 p-8 shadow-2xl backdrop-blur">
            <h2 className="text-xl font-h1-regular text-error-500">
              نمونه کارهای ویدیویی
            </h2>
            <WorksSlider title="" items={artist.videoWorks} variant="video" />
          </section>
        </div>
      </div>
    </div>
  );
}
