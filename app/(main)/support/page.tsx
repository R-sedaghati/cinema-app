"use client";

import BackLinkSection from "@/components/artist-registration/sections/BackLinkSection";
import { SupportSections } from "@/components/support/SupportSections";
import { SUPPORT_SECTIONS } from "@/lib/constants/supportSections";
import { useUserSiteContent } from "@/lib/services/landing/hook";
import { resolveSections } from "@/lib/utils/resolveSections";

export default function SupportPage() {
  const { data } = useUserSiteContent();
  // Undefined config → shipped catalog order, so the page never flashes empty.
  const sections = resolveSections(SUPPORT_SECTIONS, data?.result?.supportSections);

  return (
    <div className="relative overflow-x-clip">
      <div className="mx-auto max-w-6xl px-4 pt-10">
        <BackLinkSection />
      </div>
      <SupportSections sections={sections} support={data?.result?.support} />
      <div
        className="w-170 h-170 rounded-full absolute opacity-20 -top-24 -left-96 -z-1
        bg-radial-primary"
      />
      <div
        className="w-170 h-170 rounded-full absolute opacity-20 bottom-44 -right-96 -z-1
        bg-radial-primary"
      />
    </div>
  );
}
