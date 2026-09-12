"use client";

import clsx from "clsx";
import { MoveLeft } from "lucide-react";
import { isMobile } from "react-device-detect";
import { mobileSplitPattern, splitPattern } from "@/lib/utils/split-pattern";
import type { CopyFn } from "@/lib/utils/formCopy";

export interface RegistrationCategory {
  id: number;
  title: string;
  /** Set when this account already filed here — the card opens that request instead. */
  existingRequestId?: number;
  /** Category image; only the `covers` variant uses it. */
  image?: string | null;
}

interface Props {
  items: RegistrationCategory[];
  copy: CopyFn;
  variant?: string;
  onSelect: (id: number, title: string, existingRequestId?: number) => void;
}

/** Every variant draws the same button; only its box and the wrapper differ. */
function CategoryCard({
  item,
  copy,
  className,
  onSelect,
}: {
  item: RegistrationCategory;
  copy: CopyFn;
  className: string;
  onSelect: Props["onSelect"];
}) {
  return (
    <button
      onClick={() => onSelect(item.id, item.title, item.existingRequestId)}
      className={clsx(
        "relative overflow-hidden bg-zinc-900 border border-transparent hover:border-red-900 cursor-pointer",
        className,
      )}
    >
      <div className="flex flex-col items-start gap-1 z-10">
        <p className="text-nowrap text-sm md:text-base">{item.title}</p>
        {item.existingRequestId && (
          <span className="text-[10px] md:text-xs text-zinc-400">
            {copy("alreadyRegistered")}
          </span>
        )}
      </div>

      <MoveLeft className="text-error-500 z-10" />
    </button>
  );
}

const CategoryCardsSection: React.FC<Props> = ({
  items,
  copy,
  variant,
  onSelect,
}) => {
  const card = (item: RegistrationCategory, className: string) => (
    <CategoryCard
      key={item.id}
      item={item}
      copy={copy}
      className={className}
      onSelect={onSelect}
    />
  );

  if (variant === "grid") {
    return (
      <div className="grid w-full grid-cols-2 gap-4 md:grid-cols-4">
        {items.map((item) =>
          card(
            item,
            "h-20 w-full rounded-2xl px-4 flex items-center justify-between gap-2",
          ),
        )}
      </div>
    );
  }

  if (variant === "list") {
    return (
      <div className="flex w-full flex-col gap-2">
        {items.map((item) =>
          card(
            item,
            "h-14 w-full rounded-xl px-4 flex items-center justify-between gap-2",
          ),
        )}
      </div>
    );
  }

  if (variant === "chips") {
    return (
      <div className="flex flex-wrap justify-center gap-2">
        {items.map((item) =>
          card(item, "rounded-full px-4 py-2 flex items-center gap-2"),
        )}
      </div>
    );
  }

  if (variant === "covers") {
    // Image-backed tiles: the category picture fills the card, text sits on a
    // bottom gradient so it stays readable over any photo.
    return (
      <div className="grid w-full grid-cols-2 gap-4 md:grid-cols-4">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item.id, item.title, item.existingRequestId)}
            className="group relative h-40 w-full overflow-hidden rounded-2xl border border-transparent hover:border-red-900 cursor-pointer md:h-52"
          >
            <img
              src={item.image ?? "/cat-1.svg"}
              alt=""
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-3 text-right">
              <div className="flex flex-col items-start gap-0.5">
                <p className="text-sm font-semibold leading-tight text-white md:text-base">
                  {item.title}
                </p>
                {item.existingRequestId && (
                  <span className="text-[10px] text-zinc-300 md:text-xs">
                    {copy("alreadyRegistered")}
                  </span>
                )}
              </div>
              <MoveLeft className="shrink-0 text-error-500" />
            </div>
          </button>
        ))}
      </div>
    );
  }

  if (variant === "posters") {
    // Horizontal rail: the clipped last card is the scroll affordance.
    return (
      <div className="scrollbar-hidden flex w-full gap-4 overflow-x-auto pb-1">
        {items.map((item) =>
          card(
            item,
            "h-40 w-32 shrink-0 rounded-2xl p-4 flex flex-col items-start justify-between",
          ),
        )}
      </div>
    );
  }

  // staggered (default): alternating 4/3 rows on desktop, 4-up on mobile.
  const rows = isMobile ? mobileSplitPattern(items) : splitPattern(items);

  return (
    <div className="flex flex-col gap-4">
      {rows.map((row) => (
        <div
          key={row.map((r) => r.id).join("-")}
          className="flex flex-wrap justify-center gap-4"
        >
          {row.map((item) =>
            card(
              item,
              "md:w-60 w-32.5 h-20 px-4 pb-6 md:pb-0 md:pt-3 rounded-2xl flex items-center gap-4 md:gap-0 md:justify-between",
            ),
          )}
        </div>
      ))}
    </div>
  );
};

export default CategoryCardsSection;
