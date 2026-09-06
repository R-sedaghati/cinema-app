"use client";
/* eslint-disable @next/next/no-img-element */

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { useUserBannerList } from "@/lib/services/landing/hook";
import type { IBannerItem } from "@/lib/services/admin/type";
import { fontSizeStyle } from "@/lib/utils/fontSize";

const BANNER_GRADIENTS = [
  "from-zinc-950 via-amber-950/50 to-zinc-900",
  "from-zinc-950 via-zinc-800/60 to-zinc-900",
  "from-amber-950/50 via-zinc-900 to-zinc-950",
];

/** Perforated edges of a 35mm strip, drawn in CSS so the frames read as film. */
const SPROCKETS =
  "repeating-linear-gradient(to left, transparent 0 10px, rgba(255,255,255,.18) 10px 20px)";

export function BannerSliderSection({ variant = "slider" }: { variant?: string }) {
  const { data, isLoading } = useUserBannerList();
  const banners = useMemo(
    () => [...(data?.result ?? [])].sort((a, b) => a.priority - b.priority),
    [data],
  );

  if (isLoading) {
    return <div className="h-52 md:h-96 bg-zinc-900 animate-pulse" />;
  }

  if (banners.length === 0) return null;

  if (variant === "still") {
    return (
      <div className="h-52 md:h-96">
        <BannerFrame slide={banners[0]} index={0} />
      </div>
    );
  }

  if (variant === "filmstrip") {
    return (
      <div className="bg-zinc-950 py-3 md:py-4">
        <div
          className="h-2 md:h-3"
          style={{ backgroundImage: SPROCKETS }}
          aria-hidden
        />
        <div className="overflow-x-auto scrollbar-hidden">
          <div className="flex w-max gap-1 px-1 py-1">
            {banners.map((slide, index) => (
              <div
                key={slide.id}
                className="h-40 w-72 shrink-0 overflow-hidden md:h-64 md:w-[28rem]"
              >
                <BannerFrame slide={slide} index={index} compact />
              </div>
            ))}
          </div>
        </div>
        <div
          className="h-2 md:h-3"
          style={{ backgroundImage: SPROCKETS }}
          aria-hidden
        />
      </div>
    );
  }

  return (
    <div>
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 3500, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop
        className="application-banner h-52 md:h-96 overflow-hidden"
      >
        {banners.map((slide, index) => (
          <SwiperSlide key={slide.id}>
            <BannerFrame slide={slide} index={index} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

function BannerFrame({
  slide,
  index,
  compact = false,
}: {
  slide: IBannerItem;
  index: number;
  compact?: boolean;
}) {
  return (
    <div
      className={`relative h-full w-full bg-linear-to-bl ${BANNER_GRADIENTS[index % BANNER_GRADIENTS.length]} flex items-center overflow-hidden ${
        compact ? "px-4 md:px-6" : "px-6 md:px-16"
      }`}
    >
      <div className="relative z-10 flex-1 md:max-w-xl">
        {slide.subtitle && (
          <p
            className={`text-error-400 font-medium mb-1 md:mb-2 ${compact ? "text-xs" : "text-sm md:text-base"}`}
            style={fontSizeStyle(slide.subtitleFontSize)}
          >
            {slide.subtitle}
          </p>
        )}
        {slide.title && (
          <h2
            className={`text-white font-bold ${compact ? "mb-2 text-lg md:text-2xl" : "mb-4 text-2xl md:mb-6 md:text-5xl"}`}
            style={fontSizeStyle(slide.titleFontSize)}
          >
            {slide.title}
          </h2>
        )}
        {slide.ctaLabel && slide.ctaLink && (
          <Link
            href={slide.ctaLink}
            className={`inline-flex items-center gap-1.5 rounded-full bg-error-500 font-semibold text-zinc-950 ${
              compact ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm md:px-6 md:py-3 md:text-base"
            }`}
            style={fontSizeStyle(slide.ctaLabelFontSize)}
          >
            {slide.ctaLabel}
            <ArrowLeft size={compact ? 12 : 14} />
          </Link>
        )}
      </div>
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        {/* ponytail: plain img — banner hosts vary and the Capacitor WebView has no Next optimizer */}
        <img
          src={slide.image}
          alt=""
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
    </div>
  );
}
