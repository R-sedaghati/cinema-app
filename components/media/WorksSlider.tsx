"use client";

import { useRef, useState } from "react";

export type WorksSliderItem = {
  id: string;
  title?: string;
  year?: number;
  url?: string | null;
};

interface WorksSliderProps {
  title: string;
  items: WorksSliderItem[];
  variant: "photo" | "video";
}

export function WorksSlider({
  title,
  items,
  variant,
}: Readonly<WorksSliderProps>) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const onMouseLeave = () => {
    setIsDragging(false);
  };

  const onMouseUp = () => {
    setIsDragging(false);
  };

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.2;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <section className="pt-2">
      <h2 className="mb-4 px-4 text-lg font-bold text-zinc-900">{title}</h2>
      <div
        ref={scrollRef}
        onMouseDown={onMouseDown}
        onMouseLeave={onMouseLeave}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
        className="flex gap-4 overflow-x-auto pb-2 cursor-grab active:cursor-grabbing select-none"
      >
        {items.map((item) => (
          <div
            key={item.id}
            className="min-w-[80%] sm:min-w-[45%] lg:min-w-[30%] shrink-0 rounded-2xl border border-zinc-800 bg-zinc-950/40 p-4"
          >
            <div
              className={[
                "mb-4 aspect-video overflow-hidden rounded-xl",
                variant === "photo"
                  ? "bg-linear-to-br from-zinc-900 to-zinc-950"
                  : "bg-linear-to-br from-red-600/25 to-zinc-950",
              ].join(" ")}
            >
              {item.url && variant === "photo" ? (
                <img src={item.url} alt={item.title ?? ""} className="h-full w-full object-cover" />
              ) : item.url && variant === "video" ? (
                <video src={item.url} controls className="h-full w-full object-cover" />
              ) : (
                <div className="grid h-full place-items-center text-xs font-semibold text-zinc-200">
                  {variant === "photo" ? "نمونه تصویری" : "نمونه ویدیویی"}
                </div>
              )}
            </div>

            {item.title && (
              <div className="text-sm font-semibold text-zinc-100 hover:text-red-300">
                {item.title}
              </div>
            )}

            {item.year && (
              <div className="mt-2 text-xs text-zinc-500">{`سال ${item.year}`}</div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
