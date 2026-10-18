/* eslint-disable @next/next/no-img-element */
import type { CSSProperties } from "react";
import type { DownloadAlign, IDownloadElement, IDownloadPage, IDownloadSection } from "@/lib/services/admin/type";
import { DOWNLOAD_ICONS } from "@/lib/constants/downloadIcons";
import {
  BUTTON_VARIANTS,
  IMAGE_VARIANTS,
  SECTION_VARIANTS,
  TEXT_VARIANTS,
  variantOf,
} from "@/lib/constants/downloadVariants";

const FLEX: Record<DownloadAlign, string> = { start: "flex-start", center: "center", end: "flex-end" };

const px = (value?: number) => (value === undefined ? undefined : `${value}px`);

const border = (width?: number, color?: string): CSSProperties =>
  color || width ? { border: `${width ?? 1}px solid ${color ?? "currentColor"}` } : {};

function Element({ element, align }: { element: IDownloadElement; align: DownloadAlign }) {
  switch (element.type) {
    case "heading":
    case "text": {
      const Tag = element.type === "heading" ? "h2" : "p";
      const variant = variantOf(TEXT_VARIANTS, element.variant);
      const size = variant.size ?? (element.type === "heading" ? "text-3xl" : "text-base");
      return (
        <Tag
          className={`w-full whitespace-pre-line ${size} ${element.type === "heading" ? "font-extrabold" : "leading-8"} ${variant.className}`}
          style={{
            fontSize: px(element.fontSize),
            color: element.color,
            fontWeight: element.weight,
            textAlign: element.align ?? align,
          }}
        >
          {element.text}
        </Tag>
      );
    }
    case "image": {
      if (!element.image) return null;
      const img = (
        <img
          src={element.image}
          alt=""
          className={`block h-auto max-w-full ${variantOf(IMAGE_VARIANTS, element.variant).className}`}
          style={{ width: px(element.width), borderRadius: px(element.radius) }}
        />
      );
      return element.href ? <a href={element.href}>{img}</a> : img;
    }
    case "button": {
      const href = element.file ?? element.href;
      const Icon = element.icon ? DOWNLOAD_ICONS[element.icon]?.Icon : undefined;
      const external = !element.file && /^https?:/i.test(href ?? "");
      return (
        <a
          href={href}
          download={element.file ? "" : undefined}
          target={external ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
          className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 font-bold transition hover:opacity-90 ${variantOf(BUTTON_VARIANTS, element.variant).className} ${element.fullWidth ? "w-full" : ""}`}
          style={{
            fontSize: px(element.fontSize),
            color: element.color,
            background: element.background,
            borderRadius: px(element.radius),
            paddingInline: px(element.paddingX),
            paddingBlock: px(element.paddingY),
            ...border(element.borderWidth, element.borderColor),
          }}
        >
          {element.iconImage ? (
            <img src={element.iconImage} alt="" className="h-[1.4em] w-auto" />
          ) : (
            Icon && <Icon className="h-[1.2em] w-[1.2em]" />
          )}
          {element.label}
        </a>
      );
    }
  }
}

function Section({ section }: { section: IDownloadSection }) {
  const align = section.align ?? "center";
  const overlay = (section.backgroundOverlay ?? 50) / 100;
  const variant = variantOf(SECTION_VARIANTS, section.variant);

  return (
    <section
      className={`@container mx-auto w-full max-w-[960px] overflow-hidden px-4 py-8 ${variant.className}`}
      style={{
        maxWidth: px(section.maxWidth),
        paddingBlock: px(section.paddingY),
        paddingInline: px(section.paddingX),
        borderRadius: px(section.radius),
        backgroundColor: section.background,
        backgroundImage: section.backgroundImage
          ? `linear-gradient(rgba(0,0,0,${overlay}),rgba(0,0,0,${overlay})),url("${section.backgroundImage}")`
          : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
        ...border(section.borderWidth, section.borderColor),
      }}
    >
      <div
        className={`gap-4 ${variant.body ?? section.layout === "row" ? "flex flex-row flex-wrap items-center" : "flex flex-col"}`}
        style={{
          gap: px(section.gap),
          ...(variant.body
            ? { justifyItems: FLEX[align] }
            : section.layout === "row"
              ? { justifyContent: FLEX[align] }
              : { alignItems: FLEX[align] }),
        }}
      >
        {section.elements.map((element) => (
          <Element key={element.id} element={element} align={align} />
        ))}
      </div>
    </section>
  );
}

/** The `/download` page body; also the admin builder's live preview. */
export function DownloadSections({ page }: { page?: IDownloadPage | null }) {
  const sections = (page?.sections ?? []).filter((s) => !s.hidden);

  if (!sections.length) {
    return <p className="py-20 text-center text-gray-400">به‌زودی لینک دانلود اپلیکیشن اینجا قرار می‌گیرد.</p>;
  }

  return (
    <div className="flex flex-col gap-6 py-6">
      {sections.map((section) => (
        <Section key={section.id} section={section} />
      ))}
    </div>
  );
}
