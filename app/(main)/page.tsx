"use client";

import { useUserSiteContent } from "@/lib/services/landing/hook";
import { HOME_SECTIONS } from "@/lib/constants/homeSections";
import { HOME_SECTION_COMPONENTS } from "@/components/home/sections/registry";
import { resolveHomeSections } from "@/lib/utils/resolveHomeSections";

export default function ApplicationPage() {
  const { data } = useUserSiteContent();
  // Undefined config → shipped catalog order, so the page never flashes empty
  // while site-content is in flight.
  const sections = resolveHomeSections(data?.result?.homeSections);

  const render = (section: (typeof sections)[number]) => {
    const Section = HOME_SECTION_COMPONENTS[section.key];
    return <Section key={section.key} variant={section.variant} />;
  };

  return (
    <div className="min-h-screen pb-safe-32">
      {sections.filter((s) => HOME_SECTIONS[s.key].fullBleed).map(render)}

      <div className="mx-auto max-w-6xl px-4">
        <div className="space-y-5 md:space-y-8">
          {sections.filter((s) => !HOME_SECTIONS[s.key].fullBleed).map(render)}
        </div>
      </div>
    </div>
  );
}

