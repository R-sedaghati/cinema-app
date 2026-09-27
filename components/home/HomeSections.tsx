"use client";

import React, { useEffect, useRef, useState } from "react";
import { HOME_SECTIONS } from "@/lib/constants/homeSections";
import { HOME_SECTION_COMPONENTS } from "@/components/home/sections/registry";
import type { IResolvedHomeSection } from "@/lib/utils/resolveHomeSections";
import { sectionBoxProps } from "@/lib/utils/resolveSections";

/**
 * The home page body: full-bleed sections first, the rest in the centered column.
 * Shared by the public page and the page-builder preview iframe.
 */
export function HomeSections({
  sections,
  guides = false,
}: {
  sections: IResolvedHomeSection[];
  /** Label each section box with its name and rendered px size (preview only). */
  guides?: boolean;
}) {
  const render = (section: IResolvedHomeSection) => {
    const Section = HOME_SECTION_COMPONENTS[section.key];
    return (
      <SectionBox
        key={section.key}
        guide={guides ? HOME_SECTIONS[section.key].admin : undefined}
        {...sectionBoxProps(section)}
      >
        <Section variant={section.variant} />
      </SectionBox>
    );
  };

  return (
    <>
      {sections.filter((s) => HOME_SECTIONS[s.key].fullBleed).map(render)}

      <div data-page className="mx-auto max-w-6xl px-4">
        <div data-page-stack className="space-y-5 md:space-y-8">
          {sections.filter((s) => !HOME_SECTIONS[s.key].fullBleed).map(render)}
        </div>
      </div>
    </>
  );
}

/** A section wrapper that, with `guide` set, measures itself for the guide label. */
function SectionBox({ guide, ...props }: { guide?: string } & React.ComponentProps<"div">) {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState("");

  useEffect(() => {
    const el = ref.current;
    if (!guide || !el) return;
    const observer = new ResizeObserver(() => setSize(`${el.offsetWidth}×${el.offsetHeight}`));
    observer.observe(el);
    return () => observer.disconnect();
  }, [guide]);

  return <div ref={ref} data-guide={guide ? `${guide} · ${size}` : undefined} {...props} />;
}
