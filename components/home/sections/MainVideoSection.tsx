"use client";

import { useUserTutorialList } from "@/lib/services/landing/hook";

export function MainVideoSection({ variant = "framed" }: { variant?: string }) {
  const { data } = useUserTutorialList();
  const mainTutorial = data?.result?.find((tutorial) => tutorial.isMain);

  if (!mainTutorial) return null;

  const player = (
    <div data-el="player" className="relative w-full aspect-video overflow-hidden rounded-xl">
      <iframe
        src={mainTutorial.videoUrl}
        className="absolute inset-0 h-full w-full"
        allowFullScreen
      />
    </div>
  );

  // Edge-to-edge: the video leads and the title reads as its caption.
  if (variant === "bleed") {
    return (
      // Cancels the inner column's side padding (`--home-px`, see HomeSections).
      <section className="-mx-[var(--home-px,1rem)]">
        <div data-el="player" className="aspect-video w-full overflow-hidden">
          <iframe
            src={mainTutorial.videoUrl}
            className="h-full w-full"
            allowFullScreen
          />
        </div>
        <p data-el="title" className="px-4 pt-2 text-xs text-zinc-500 md:text-sm">
          {mainTutorial.title}
        </p>
      </section>
    );
  }

  return (
    <section>
      <div data-el="frame" className="flex flex-col gap-3 rounded-2xl md:border md:border-zinc-800 md:bg-zinc-900/60 md:p-4">
        <h2 data-el="title" className="text-sm md:text-lg font-semibold text-zinc-100">
          {mainTutorial.title}
        </h2>
        {player}
      </div>
    </section>
  );
}
