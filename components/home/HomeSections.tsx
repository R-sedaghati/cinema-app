"use client";

import React, { useEffect, useRef, useState } from "react";
import { HOME_SECTIONS } from "@/lib/constants/homeSections";
import { HOME_SECTION_COMPONENTS } from "@/components/home/sections/registry";
import type { IResolvedHomeSection } from "@/lib/utils/resolveHomeSections";
import { sectionBoxProps } from "@/lib/utils/resolveSections";
import { sectionCss } from "@/lib/utils/sectionStyles";

/**
 * The home page body: full-bleed sections first, the rest after. Every section is
 * a full-width band — background and padding sit on the band so the color reaches
 * the screen edges; the content column (max-w-6xl + page-layout width/sides) and
 * size overrides sit on the inner box. Gaps between sections are band padding,
 * not margins, so no unpainted strip shows between two colored bands.
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
    const meta = HOME_SECTIONS[section.key];
    const { width, height, maxWidth, minHeight, ...band } = section;
    const css = sectionCss(`[data-section="${section.key}"]`, meta.styles, section.styles);

    return (
      <SectionBox
        key={section.key}
        data-section={section.key}
        data-home-band=""
        data-bleed={meta.fullBleed ? "" : undefined}
        className={meta.fullBleed ? undefined : "py-2.5 md:py-4"}
        guide={guides ? meta.admin : undefined}
        {...sectionBoxProps(band)}
      >
        {css && <style>{css}</style>}
        <div
          data-home-inner={meta.fullBleed ? undefined : ""}
          className={meta.fullBleed ? undefined : "mx-auto max-w-6xl px-4"}
          style={sectionBoxProps({ width, height, maxWidth, minHeight }).style}
        >
          <Section variant={section.variant} />
        </div>
      </SectionBox>
    );
  };

  return (
    <>
      {sections.filter((s) => HOME_SECTIONS[s.key].fullBleed).map(render)}
      {sections.filter((s) => !HOME_SECTIONS[s.key].fullBleed).map(render)}
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
