import { EArtistGender, IArtistItem } from "@/lib/services/admin/type";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ArtistCard({
  artist,
}: Readonly<{ artist: IArtistItem }>) {
  return (
    <Link
      href={`/artists/${artist.id}`}
      className="group rounded-2xl border border-zinc-800 bg-zinc-950/40 p-2 pb-4 hover:border-error-500/50"
    >
      <div className="w-full h-27 rounded-lg bg-zinc-800 mb-4"></div>
      <div className="text-base font-semibold text-zinc-100 group-hover:text-red-300 mb-2">
        {`${artist.user.firstName} ${artist.user.lastName}`}
      </div>
      <div className="mt-2 flex flex-wrap gap-2 text-xs">
        <span className="rounded-full bg-zinc-500 px-2 py-1 text-zinc-100 ring-1 ring-zinc-800">
          {artist?.categories?.at(0)?.faName ?? ""}
        </span>
        <span className="rounded-full bg-zinc-500 px-2 py-1 text-zinc-100 ring-1 ring-zinc-800">
          {artist?.user?.gender === EArtistGender.MAN ? "مرد" : "زن"}
        </span>
        <span className="rounded-full bg-zinc-500 px-2 py-1 text-zinc-100 ring-1 ring-zinc-800">
          {artist?.user?.city ?? ""}
        </span>
      </div>
      <p className="mt-4 mb-3 line-clamp-2 text-sm leading-7 text-zinc-400">
        {artist?.user?.aboutMe}
      </p>
      <div className="flex items-center justify-end">
        <ArrowLeft className="text-error-500 self-start mx-1.5" />
      </div>
    </Link>
  );
}
