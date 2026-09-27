"use client";

import { useUserSiteContent } from "@/lib/services/landing/hook";
import { resolveHomeSections } from "@/lib/utils/resolveHomeSections";
import { HomeSections } from "@/components/home/HomeSections";

export default function ApplicationPage() {
  const { data } = useUserSiteContent();
  // Undefined config → shipped catalog order, so the page never flashes empty
  // while site-content is in flight.
  const sections = resolveHomeSections(data?.result?.homeSections);

  return (
    <div className="min-h-screen pb-safe-32">
      <HomeSections sections={sections} />
    </div>
  );
}
