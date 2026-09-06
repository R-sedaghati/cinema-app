"use client";

import { Button, Card, Input, Textarea } from "@dgshahr/ui-kit";
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
                className={`rounded-xl border ${
                  dropIndex === index ? "border-t-2 border-t-primary-500" : ""
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
                              className={`cursor-pointer rounded-lg border px-3 py-1.5 text-sm ${
                                section.variant === v.key
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
                              {v.admin}
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
              className="pointer-events-none select-none overflow-hidden rounded-2xl bg-zinc-950 text-zinc-100"
            >
              <PreviewSections sections={visible} />
            </div>
          </LandingCopyDraftProvider>
        </Card>
      </div>
    </div>
  );
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
