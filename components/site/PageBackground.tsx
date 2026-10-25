"use client";

import { usePathname } from "next/navigation";
import { useUserSiteContent } from "@/lib/services/landing/hook";
import { resolvePageBackground } from "@/lib/utils/pageBackground";

/**
 * Admin-set page background, painted as a fixed layer behind the page. Renders
 * nothing when unset, so the body gradient in `globals.css` shows through.
 */
/** `path` stands in for the URL where the page renders elsewhere (the page-builder preview). */
export function PageBackground({ path }: { path?: string }) {
  const pathname = usePathname();
  const { data } = useUserSiteContent();
  const bg = resolvePageBackground(data?.result?.pageBackgrounds, path ?? pathname);

  if (!bg) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 bg-cover bg-center"
      style={{
        backgroundColor: bg.color,
        backgroundImage: bg.image ? `url("${bg.image}")` : undefined,
      }}
    >
      {bg.image && (
        <div
          className="absolute inset-0 bg-black"
          style={{ opacity: (bg.overlay ?? 50) / 100 }}
        />
      )}
    </div>
  );
}
