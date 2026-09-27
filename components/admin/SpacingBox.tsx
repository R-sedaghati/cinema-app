"use client";

import React from "react";
import { toEnglishDigits } from "@/lib/utils/toEnglishDigits";

export type SpacingSide = "top" | "bottom" | "sides" | "gap";
export type SpacingValues = Partial<Record<SpacingSide, number>>;

interface Props {
  values: SpacingValues;
  /** What an empty input falls back to, shown as its placeholder. */
  placeholders?: Partial<Record<SpacingSide, string>>;
  onChange: (next: SpacingValues) => void;
  /** Show the between-blocks input (page layouts; sections have no children to space). */
  withGap?: boolean;
  max?: number;
}

const LABEL: Record<SpacingSide, string> = {
  top: "بالا",
  bottom: "پایین",
  sides: "چپ و راست",
  gap: "فاصله بین بخش‌ها",
};

/**
 * Box-model editor: inputs sit where the space they control sits, so admins read
 * it like a picture of the page instead of a list of CSS names. Values in px;
 * empty = default.
 */
export function SpacingBox({ values, placeholders = {}, onChange, withGap = false, max = 200 }: Props) {
  const field = (side: SpacingSide) => (
    <label className="flex flex-col items-center gap-0.5 text-[11px] text-gray-500">
      {LABEL[side]}
      <input
        type="text"
        inputMode="numeric"
        dir="ltr"
        aria-label={`${LABEL[side]} (پیکسل)`}
        placeholder={placeholders[side] ?? "پیش‌فرض"}
        value={values[side] ?? ""}
        onChange={(e) => {
          const raw = toEnglishDigits(e.target.value).replace(/\D/g, "");
          const next = { ...values };
          if (raw === "") delete next[side];
          else next[side] = Math.min(Number(raw), max);
          onChange(next);
        }}
        className="w-16 rounded-md border border-gray-200 bg-white px-1 py-0.5 text-center text-xs text-gray-800 placeholder:text-gray-400 focus:border-primary-500 focus:outline-none"
      />
    </label>
  );

  const hasValue = Object.keys(values).length > 0;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex flex-col items-center gap-1.5 rounded-xl border border-dashed border-sky-300 bg-sky-50/60 p-2">
        {field("top")}
        <div className="flex w-full items-center gap-1.5">
          {field("sides")}
          <div className="flex flex-1 flex-col items-stretch gap-1.5">
            <div className="rounded-md bg-gray-200 py-2 text-center text-[11px] text-gray-500">محتوا</div>
            {withGap && (
              <>
                <div className="flex justify-center">{field("gap")}</div>
                <div className="rounded-md bg-gray-200 py-2 text-center text-[11px] text-gray-500">محتوا</div>
              </>
            )}
          </div>
        </div>
        {field("bottom")}
      </div>
      <div className="flex justify-between text-[11px] text-gray-400">
        <span>پیکسل، ۰ تا {max.toLocaleString("fa")}. خالی = پیش‌فرض</span>
        {hasValue && (
          <button type="button" className="text-primary-600 underline" onClick={() => onChange({})}>
            بازنشانی
          </button>
        )}
      </div>
    </div>
  );
}
