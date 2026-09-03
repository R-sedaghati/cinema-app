"use client";
/* eslint-disable @next/next/no-img-element */

import { useLandingCopy } from "@/lib/hooks/useLandingCopy";

const NotFoundSearch = () => {
  const copy = useLandingCopy();

  return (
    <div className="flex flex-col gap-6 justify-center items-center p-8 text-center">
      <img
        src={"./not-found-search.svg"}
        width={138}
        height={136}
        alt={copy("searchEmptyAlt")}
      />
      <div className="font-h3-bold font-semibold text-zinc-500">
        {copy("searchEmptyTitle")}
      </div>
    </div>
  );
};

export default NotFoundSearch;
