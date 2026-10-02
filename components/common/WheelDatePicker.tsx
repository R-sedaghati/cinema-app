"use client";

import { useEffect, useRef } from "react";
import clsx from "clsx";
import { JALALI_MONTHS, Jalali, jalaliMonthLength } from "@/lib/utils/jalali";

const ITEM_H = 40;
const VISIBLE = 5; // odd, so one row sits in the middle
const PAD = ((VISIBLE - 1) / 2) * ITEM_H;

const faNum = (n: number) => n.toLocaleString("fa-IR", { useGrouping: false });
const range = (from: number, to: number) => Array.from({ length: to - from + 1 }, (_, i) => from + i);

function Wheel({
  items,
  index,
  onChange,
}: {
  items: string[];
  index: number;
  onChange: (index: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  // Sync scroll to index when it changes from outside (open, day clamped by a shorter month).
  useEffect(() => {
    const el = ref.current;
    if (el && Math.round(el.scrollTop / ITEM_H) !== index) el.scrollTop = index * ITEM_H;
  }, [index]);

  return (
    <div
      ref={ref}
      onScroll={(e) => {
        const i = Math.round(e.currentTarget.scrollTop / ITEM_H);
        if (i !== index && i >= 0 && i < items.length) onChange(i);
      }}
      className="relative flex-1 snap-y snap-mandatory overflow-y-scroll overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      style={{ height: VISIBLE * ITEM_H, paddingBlock: PAD }}
    >
      {items.map((label, i) => (
        <div
          key={i}
          onClick={() => ref.current?.scrollTo({ top: i * ITEM_H, behavior: "smooth" })}
          className={clsx(
            "flex snap-center cursor-pointer items-center justify-center transition-colors select-none",
            i === index ? "font-p1-medium text-gray-800" : "text-gray-500",
          )}
          style={{ height: ITEM_H }}
        >
          {label}
        </div>
      ))}
    </div>
  );
}

interface WheelDatePickerProps {
  value: Jalali;
  onChange: (value: Jalali) => void;
  minYear: number;
  maxYear: number;
}

/** iOS-style Jalali day / month / year wheels (scroll-snap, no deps). */
export default function WheelDatePicker({ value, onChange, minYear, maxYear }: WheelDatePickerProps) {
  const years = range(minYear, maxYear);
  const days = range(1, jalaliMonthLength(value.jy, value.jm));

  // Changing month/year can shorten the month — clamp the day.
  const set = (next: Partial<Jalali>) => {
    const v = { ...value, ...next };
    onChange({ ...v, jd: Math.min(v.jd, jalaliMonthLength(v.jy, v.jm)) });
  };

  return (
    <div className="relative flex ss02 [mask-image:linear-gradient(transparent,black_30%,black_70%,transparent)]">
      <div
        className="pointer-events-none absolute inset-x-0 rounded-xl bg-gray-100"
        style={{ top: PAD, height: ITEM_H }}
      />
      <Wheel items={days.map(faNum)} index={value.jd - 1} onChange={(i) => set({ jd: i + 1 })} />
      <Wheel items={JALALI_MONTHS} index={value.jm - 1} onChange={(i) => set({ jm: i + 1 })} />
      <Wheel items={years.map(faNum)} index={value.jy - minYear} onChange={(i) => set({ jy: minYear + i })} />
    </div>
  );
}
