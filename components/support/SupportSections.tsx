"use client";

import { SUPPORT_SECTIONS, type SupportSectionKey } from "@/lib/constants/supportSections";
import type { ISiteContent, ISiteContentContactForm } from "@/lib/services/admin/type";
import { sectionBoxProps, type IResolvedSection } from "@/lib/utils/resolveSections";
import { sectionCss } from "@/lib/utils/sectionStyles";
import ContactUsForm from "./ContactUsForm";
import { SupportCards, SupportIntro } from "./SupportCenter";

/**
 * The support page body. Like `HomeSections`, each section is a full-width band —
 * background and padding on the band, the content column (max-w-6xl + page-layout
 * width/sides via `data-home-*`) inside. Shared by the page and the builder preview.
 */
export function SupportSections({
  sections,
  support,
  contactForm,
}: {
  sections: IResolvedSection<SupportSectionKey>[];
  support: ISiteContent["support"] | undefined;
  /** Draft form from the builder; absent = the saved one. */
  contactForm?: ISiteContentContactForm | null;
}) {
  return sections.map((section) => {
    const { width, height, maxWidth, minHeight, ...band } = section;
    const css = sectionCss(`[data-section="${section.key}"]`, SUPPORT_SECTIONS[section.key].styles, section.styles);

    return (
      <div
        key={section.key}
        data-section={section.key}
        data-home-band=""
        className="py-10"
        {...sectionBoxProps(band)}
      >
        {css && <style>{css}</style>}
        <div
          data-home-inner=""
          className="mx-auto max-w-6xl px-4"
          style={sectionBoxProps({ width, height, maxWidth, minHeight }).style}
        >
          {section.key === "intro" && <SupportIntro support={support} variant={section.variant} />}
          {section.key === "cards" && <SupportCards support={support} variant={section.variant} />}
          {section.key === "contactForm" && <ContactUsForm stored={contactForm} />}
        </div>
      </div>
    );
  });
}
