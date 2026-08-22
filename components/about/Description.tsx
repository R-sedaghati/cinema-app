"use client";

import { useUserAboutUs } from "@/lib/services/landing/hook";
import { fontSizeStyle } from "@/lib/utils/fontSize";
import { useLandingCopy } from "@/lib/hooks/useLandingCopy";

export default function Description() {
  const { data } = useUserAboutUs();
  const about = data?.result?.at(0);
  const copy = useLandingCopy();

  return (
    <div className="relative w-full text-right flex flex-col justify-center items-center">
      <h3 className="text-4xl font-h1-regular mb-10">{copy("aboutPageTitle")}</h3>

      <div className="relative backdrop-blur-sm border-2 border-error-500/30 shadow-card text-xl rounded-4xl p-5 md:p-20 bg-zinc-900/40 w-full">
        <p className="mb-8" style={fontSizeStyle(about?.fontSize)}>
          {about?.text}
        </p>
      </div>
    </div>
  );
}
