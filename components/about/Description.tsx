"use client";

import { useUserAboutUs } from "@/lib/services/landing/hook";

export default function Description() {
  const { data } = useUserAboutUs();

  return (
    <div className="relative w-full text-right flex flex-col justify-center items-center">
      <h3 className="text-4xl font-h1-regular mb-10">درباره آرشیو هنر</h3>

      <div className="relative backdrop-blur-sm border-2 border-error-500/30 shadow-card text-xl rounded-4xl p-5 md:p-20 bg-zinc-900/40 w-full">
        <p className="mb-8">{data?.result?.at(0)?.text}</p>
      </div>
    </div>
  );
}
