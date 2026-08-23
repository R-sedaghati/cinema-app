"use client";
/* eslint-disable @next/next/no-img-element */

import { useLandingCopy } from "@/lib/hooks/useLandingCopy";

// ponytail: image per card is positional, exactly like the about-page benefit cards
const reasonImages = [
  "./reasons-profile.svg",
  "./reasons-search.svg",
  "./reasons-relation.svg",
];

const Reasons = () => {
  const copy = useLandingCopy();

  const cards = [1, 2, 3].map((n) => ({
    id: n,
    image: reasonImages[n - 1],
    title: copy(`reason${n}Title` as "reason1Title"),
    detail: copy(`reason${n}Detail` as "reason1Detail"),
  }));

  return (
    <div className="flex flex-col justify-center items-center gap-10">
      <h3 className="font-h1-bold">{copy("reasonsTitle")}</h3>
      <div className="flex flex-wrap justify-center items-center gap-10">
        {cards.map((item) => (
          <div
            key={item.id}
            className="w-73 min-h-109 flex bg-secondary-black flex-col justify-between items-center gap-8 border border-error-500/30 shadow-card rounded-4xl p-8"
          >
            <img src={item.image} alt={item.title} width={216} height={160} />
            <h5 className="font-h3-bold h-7.5">{item.title}</h5>
            <p className="font-p1-regular flex-1 text-zinc-400">
              {item.detail}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reasons;
