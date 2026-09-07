"use client";

import { Button, Card } from "@dgshahr/ui-kit";
import Input from "@/components/common/Input";
import Textarea from "@/components/common/Textarea";
import { ChevronDown, Eye, EyeOff, GripVertical } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import {
  useAdminSiteContent,
  useAdminSiteContentUpdate,
} from "@/lib/services/admin/hook";
import { LANDING_COPY } from "@/lib/constants/landingCopy";
import type { LandingCopyKey } from "@/lib/constants/landingCopy";
import { HOME_SECTIONS, type HomeSectionKey } from "@/lib/constants/homeSections";
import { HOME_SECTION_COMPONENTS } from "@/components/home/sections/registry";
import {
  orderedHomeSections,
  type IResolvedHomeSection,
} from "@/lib/utils/resolveHomeSections";
import { LandingCopyDraftProvider } from "@/lib/hooks/useLandingCopy";
import withNoSSR from "@/lib/utils/withNoSSR";

/** Long copy gets a textarea — the same cut `CopyCard` makes. */
const isLongCopy = (key: LandingCopyKey) =>
  LANDING_COPY[key].value.includes("\n") || LANDING_COPY[key].value.length > 60;

function PageBuilder() {
  const queryClient = useQueryClient();
  const { data } = useAdminSiteContent();
  const { mutate: save, isPending } = useAdminSiteContentUpdate();

  const [sections, setSections] = useState<IResolvedHomeSection[]>([]);
  const [landing, setLanding] = useState<Record<string, string>>({});
  const [expanded, setExpanded] = useState<HomeSectionKey | null>(null);
  const [dragging, setDragging] = useState<string | null>(null);
  const [dropIndex, setDropIndex] = useState<number | null>(null);
  const [dirty, setDirty] = useState(false);

  // Seed from the server once it arrives; later refetches must not stomp edits.
  useEffect(() => {
    if (!data?.result || dirty) return;
    setSections(orderedHomeSections(data.result.homeSections));
    setLanding({ ...(data.result.landing ?? {}) });
  }, [data, dirty]);

  const visible = useMemo(() => sections.filter((s) => !s.hidden), [sections]);

  const move = (fromKey: string, to: number) => {
    setSections((prev) => {
      const from = prev.findIndex((s) => s.key === fromKey);
      if (from === -1 || from === to || from + 1 === to) return prev;
      const next = [...prev];
      const [item] = next.splice(from, 1);
      next.splice(from < to ? to - 1 : to, 0, item);
      return next;
    });
    setDirty(true);
  };

  const setVariant = (key: string, variant: string) => {
    setSections((prev) =>
      prev.map((s) => (s.key === key ? { ...s, variant } : s)),
    );
    setDirty(true);
  };

  const toggle = (key: string) => {
    setSections((prev) =>
      prev.map((s) => (s.key === key ? { ...s, hidden: !s.hidden } : s)),
    );
    setDirty(true);
  };

  const setCopy = (key: LandingCopyKey, value: string) => {
    setLanding((prev) => ({ ...prev, [key]: value }));
    setDirty(true);
  };

  const handleSave = () => {
    save(
      { homeSections: sections, landing },
      {
        onSuccess: () => {
          setDirty(false);
          queryClient.invalidateQueries({ queryKey: ["adminSiteContent"] });
          toast.success("صفحه اصلی ذخیره شد");
        },
        onError: () => toast.error("ذخیره صفحه اصلی انجام نشد"),
      },
    );
  };

  return (
    <div className="flex flex-col gap-5 p-4 md:p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-bold">صفحه‌ساز صفحه اصلی</h1>
          <p className="text-sm text-gray-500 mt-1">
            ترتیب بخش‌ها را با کشیدن تغییر دهید، بخش‌های اضافه را پنهان کنید و
            متن‌ها را ویرایش کنید. پیش‌نمایش سمت چپ زنده است.
          </p>
        </div>
        <Button onClick={handleSave} disabled={!dirty || isPending}>
          {isPending ? "در حال ذخیره..." : "ذخیره"}
        </Button>
      </div>

      <div className="grid gap-5 lg:grid-cols-[380px_1fr] items-start">
        <Card className="flex flex-col gap-2 p-3">
          {sections.map((section, index) => {
            const key = section.key as HomeSectionKey;
            const meta = HOME_SECTIONS[key];
            if (!meta) return null;

            return (
              <div
                key={section.key}
                draggable={dragging === section.key}
                onDragOver={(e) => {
                  if (!dragging) return;
                  e.preventDefault();
                  const box = e.currentTarget.getBoundingClientRect();
                  setDropIndex(
                    e.clientY < box.top + box.height / 2 ? index : index + 1,
                  );
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  if (dragging && dropIndex !== null) move(dragging, dropIndex);
                  setDragging(null);
                  setDropIndex(null);
                }}
                onDragEnd={() => {
                  setDragging(null);
                  setDropIndex(null);
                }}
                className={`rounded-xl border ${dropIndex === index ? "border-t-2 border-t-primary-500" : ""
                  } ${section.hidden ? "opacity-60" : ""} border-gray-200`}
              >
                <div className="flex items-center gap-2 p-2">
                  <button
                    type="button"
                    aria-label="جابه‌جایی"
                    className="cursor-grab text-gray-400"
                    onMouseDown={() => setDragging(section.key)}
                    onMouseUp={() => setDragging(null)}
                  >
                    <GripVertical size={18} />
                  </button>

                  <span className="flex-1 text-sm font-medium">{meta.admin}</span>

                  <button
                    type="button"
                    aria-label={section.hidden ? "نمایش بخش" : "پنهان کردن بخش"}
                    onClick={() => toggle(section.key)}
                    className="text-gray-500 hover:text-gray-800"
                  >
                    {section.hidden ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>

                  <button
                    type="button"
                    aria-label="ویرایش متن‌ها"
                    onClick={() => setExpanded(expanded === key ? null : key)}
                    className="text-gray-500 hover:text-gray-800"
                  >
                    <ChevronDown
                      size={18}
                      className={expanded === key ? "rotate-180" : ""}
                    />
                  </button>
                </div>

                {expanded === key && (
                  <div className="flex flex-col gap-3 border-t border-gray-100 p-3">
                    {meta.variants.length > 1 && (
                      <fieldset className="flex flex-col gap-2">
                        <legend className="text-sm text-gray-600">چیدمان</legend>
                        <div className="flex flex-wrap gap-2">
                          {meta.variants.map((v) => (
                            <label
                              key={v.key}
                              className={`cursor-pointer rounded-lg border px-3 py-1.5 text-sm ${section.variant === v.key
                                  ? "border-primary-500 bg-primary-50 text-primary-700"
                                  : "border-gray-200 text-gray-600 hover:border-gray-300"
                                }`}
                            >
                              <input
                                type="radio"
                                className="sr-only"
                                name={`variant-${section.key}`}
                                value={v.key}
                                checked={section.variant === v.key}
                                onChange={() => setVariant(section.key, v.key)}
                              />
                              <span className="flex flex-col items-center gap-1.5">
                                <VariantGlyph variant={v.key} />
                                {v.admin}
                              </span>
                            </label>
                          ))}
                        </div>
                      </fieldset>
                    )}

                    {meta.copyKeys.map((copyKey) => {
                      const field = LANDING_COPY[copyKey];
                      // Empty means "use the shipped default" — the resolver
                      // falls back, so the default is the placeholder.
                      const value = landing[copyKey] ?? "";

                      return isLongCopy(copyKey) ? (
                        <Textarea
                          key={copyKey}
                          labelContent={field.admin}
                          placeholder={field.value}
                          value={value}
                          rows={3}
                          onChange={(e) => setCopy(copyKey, e.target.value)}
                        />
                      ) : (
                        <Input
                          key={copyKey}
                          labelContent={field.admin}
                          placeholder={field.value}
                          value={value}
                          onChange={(e) => setCopy(copyKey, e.target.value)}
                        />
                      );
                    })}

                    {meta.manageLink && (
                      <Link
                        href={meta.manageLink}
                        className="text-sm text-primary-600 underline"
                      >
                        {meta.manageLabel ?? "مدیریت محتوا"}
                      </Link>
                    )}

                    {meta.copyKeys.length === 0 && !meta.manageLink && (
                      <p className="text-sm text-gray-500">
                        این بخش متن قابل ویرایشی ندارد.
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </Card>

        <Card className="p-3">
          <p className="mb-2 text-sm text-gray-500">پیش‌نمایش</p>
          {/* pointer-events-none: the real sections contain links and router
              pushes — the preview must never navigate the panel away. */}
          <LandingCopyDraftProvider value={landing}>
            <div
              dir="rtl"
              className="pointer-events-none select-none max-w-[900px] overflow-hidden rounded-2xl bg-zinc-950 text-zinc-100"
            >
              <PreviewSections sections={visible} />
            </div>
          </LandingCopyDraftProvider>
        </Card>
      </div>
    </div>
  );
}

/**
 * Wireframe thumbnail for a layout variant — CSS boxes, no assets. Keyed by
 * variant key, which is shared across sections on purpose: `grid` looks the
 * same whichever section draws it.
 */
function VariantGlyph({ variant }: { variant: string }) {
  const frame =
    "h-9 w-14 shrink-0 rounded-md border border-current/25 p-1 opacity-70";
  const fill = "rounded-[2px] bg-current";

  switch (variant) {
    case "grid":
    case "cards":
    case "tiles":
      return (
        <span className={`${frame} grid grid-cols-3 grid-rows-2 gap-[3px]`}>
          {["a", "b", "c", "d", "e", "f"].map((k) => (
            <span key={k} className={fill} />
          ))}
        </span>
      );

    case "rail":
    case "posters":
    case "slider":
    case "filmstrip":
      // Last box clipped by the frame — the horizontal-scroll tell.
      return (
        <span className={`${frame} flex gap-[3px] overflow-hidden`}>
          {["a", "b", "c"].map((k) => (
            <span key={k} className={`${fill} w-3.5 shrink-0`} />
          ))}
        </span>
      );

    case "list":
    case "rows":
    case "castlist":
      return (
        <span className={`${frame} flex flex-col justify-between`}>
          {["a", "b", "c"].map((k) => (
            <span key={k} className={`${fill} h-1.5 w-full`} />
          ))}
        </span>
      );

    case "text":
    case "columns":
      return (
        <span className={`${frame} flex gap-[3px]`}>
          {["a", "b"].map((col) => (
            <span key={col} className="flex flex-1 flex-col justify-between">
              {["a", "b", "c"].map((k) => (
                <span key={k} className={`${fill} h-1 w-full`} />
              ))}
            </span>
          ))}
        </span>
      );

    case "chips":
      return (
        <span className={`${frame} flex flex-wrap content-start gap-[3px]`}>
          {["w-4", "w-5", "w-3", "w-5", "w-3.5"].map((w) => (
            <span key={w} className={`${fill} h-1.5 rounded-full ${w}`} />
          ))}
        </span>
      );

    case "stacked":
      return (
        <span className={`${frame} flex flex-col justify-center gap-[3px]`}>
          <span className={`${fill} h-1.5 w-2/3`} />
          <span className={`${fill} h-2.5 w-full opacity-50`} />
        </span>
      );

    case "marquee":
      return (
        <span className={`${frame} flex items-center justify-center`}>
          <span className="h-5 w-10 rounded-[2px] border-2 border-current" />
        </span>
      );

    case "framed":
      return (
        <span className={`${frame} flex items-center justify-center`}>
          <span className={`${fill} h-5 w-9`} />
        </span>
      );

    default:
      // still, bleed, panel and anything new: one full block.
      return (
        <span className={`${frame} flex`}>
          <span className={`${fill} h-full w-full`} />
        </span>
      );
  }
}

function PreviewSections({ sections }: { sections: IResolvedHomeSection[] }) {
  const render = (section: IResolvedHomeSection) => {
    const Section = HOME_SECTION_COMPONENTS[section.key];
    return <Section key={section.key} variant={section.variant} />;
  };

  return (
    <div className="min-h-40 pb-6">
      {sections.filter((s) => HOME_SECTIONS[s.key].fullBleed).map(render)}
      <div className="mx-auto max-w-6xl px-4">
        <div className="space-y-5 md:space-y-8">
          {sections.filter((s) => !HOME_SECTIONS[s.key].fullBleed).map(render)}
        </div>
      </div>
    </div>
  );
}

export default withNoSSR(PageBuilder);
