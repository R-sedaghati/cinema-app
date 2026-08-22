"use client";

import { useUserTutorialList } from "@/lib/services/landing/hook";

export function MainTutorialVideo() {
  const { data } = useUserTutorialList();
  const mainTutorial = data?.result?.find((tutorial) => tutorial.isMain);

  if (!mainTutorial) return null;

  return (
    <section>
      <div className="flex flex-col gap-3 rounded-2xl md:border md:border-zinc-800 md:bg-zinc-900/60 md:p-4">
        <h2 className="text-sm md:text-lg font-semibold text-zinc-100">
          {mainTutorial.title}
        </h2>
        <div className="relative w-full aspect-video rounded-xl overflow-hidden">
          <iframe
            src={mainTutorial.videoUrl}
            className="absolute inset-0 w-full h-full"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  );
}
