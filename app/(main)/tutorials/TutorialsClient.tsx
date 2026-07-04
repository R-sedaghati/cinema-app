"use client";

import { useUserTutorialList } from "@/lib/services/landing/hook";
import Image from "next/image";

export function TutorialsClient() {
  const { data } = useUserTutorialList();
  const tutorials = data?.result ?? [];

  return (
    <div className="flex flex-col gap-10 md:pb-28">
      <h3 className="font-h1-regular text-4xl text-center">آموزش‌ها</h3>

      {tutorials.length === 0 && (
        <p className="text-center text-zinc-500">
          تا این لحظه آموزشی ثبت نشده است.
        </p>
      )}

      <div className="flex flex-col gap-10">
        {tutorials.map((tutorial) => (
          <div
            key={tutorial.id}
            className="flex flex-col gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 md:p-6"
          >
            {tutorial.thumbnail && (
              <div className="relative w-full h-48 md:h-72 rounded-xl overflow-hidden bg-gray-100">
                <Image
                  src={tutorial.thumbnail}
                  alt={tutorial.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            <h4 className="text-lg md:text-xl font-semibold text-zinc-100">
              {tutorial.title}
            </h4>

            <div className="relative w-full aspect-video rounded-xl overflow-hidden">
              <iframe
                src={tutorial.videoUrl}
                className="absolute inset-0 w-full h-full"
                allowFullScreen
              />
            </div>

            <p className="text-sm md:text-base text-zinc-400 whitespace-pre-line">
              {tutorial.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
