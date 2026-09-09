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
