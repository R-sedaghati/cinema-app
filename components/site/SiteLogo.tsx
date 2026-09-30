"use client";
/* eslint-disable @next/next/no-img-element */

import { useSiteLogo } from "@/lib/hooks/useSiteLogo";

/** Square site logo; keeps its box while loading so nothing shifts. */
export default function SiteLogo({ size }: { size: number }) {
  const src = useSiteLogo();
  return src ? (
    <img src={src} alt="logo" width={size} height={size} className="object-contain" />
  ) : (
    <span style={{ width: size, height: size }} className="inline-block shrink-0" />
  );
}
