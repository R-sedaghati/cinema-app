"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useLandingCopy } from "@/lib/hooks/useLandingCopy";
import type { LandingCopyKey } from "@/lib/constants/landingCopy";

const CTA_CARDS: { href: string; title: LandingCopyKey; subtitle: LandingCopyKey }[] = [
  { href: "/support", title: "homeSupportTitle", subtitle: "homeSupportSubtitle" },
  { href: "/tutorials", title: "homeTutorialsTitle", subtitle: "homeTutorialsSubtitle" },
  { href: "/faq", title: "homeFaqTitle", subtitle: "homeFaqSubtitle" },
];

export function CtaCardsSection({ variant = "cards" }: { variant?: string }) {
  const copy = useLandingCopy();

  // Quiet reading: hairline rows, no boxes competing with the sections above.
  if (variant === "rows") {
    return (
      <div className="divide-y divide-zinc-800 border-y border-zinc-800">
        {CTA_CARDS.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="flex items-center justify-between gap-4 py-4 transition-colors hover:bg-zinc-900/40"
          >
            <div>
              <p className="text-sm font-semibold text-zinc-100 md:text-base">
                {copy(card.title)}
              </p>
              <p className="mt-0.5 text-xs text-zinc-500 md:text-sm">
                {copy(card.subtitle)}
              </p>
            </div>
            <ArrowLeft size={18} className="shrink-0 text-zinc-600" />
          </Link>
        ))}
      </div>
    );
  }

  // One block, split by vertical rules — reads as a single unit, not three cards.
  if (variant === "panel") {
    return (
      <div className="grid divide-y divide-zinc-800 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/60 md:grid-cols-3 md:divide-x md:divide-y-0">
        {CTA_CARDS.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="flex flex-col gap-1 p-5 transition-colors hover:bg-zinc-900 md:p-6"
          >
            <p className="text-sm font-semibold text-zinc-100 md:text-base">
              {copy(card.title)}
            </p>
            <p className="text-xs text-zinc-500 md:text-sm">{copy(card.subtitle)}</p>
          </Link>
        ))}
      </div>
    );
  }

  return (
    <div className="md:grid md:grid-cols-3 md:gap-5 space-y-4 md:space-y-0">
      {CTA_CARDS.map((card) => (
        <Link
          key={card.href}
          href={card.href}
          className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-900/60 px-4 py-4 md:px-6 md:py-6 hover:border-error-500/40 transition-colors group active:scale-[.99]"
        >
          <div>
            <p className="text-sm md:text-base font-semibold text-zinc-100">
              {copy(card.title)}
            </p>
            <p className="text-xs md:text-sm text-zinc-500 mt-0.5 md:mt-1">
              {copy(card.subtitle)}
            </p>
          </div>
          <ArrowLeft
            size={18}
            className="text-zinc-600 group-hover:text-error-500 transition-colors md:size-6"
          />
        </Link>
      ))}
    </div>
  );
}
