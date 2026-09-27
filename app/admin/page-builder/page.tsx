"use client";

import { Button, Card } from "@dgshahr/ui-kit";
import Input from "@/components/common/Input";
import Textarea from "@/components/common/Textarea";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import {
  useAdminSiteContent,
  useAdminSiteContentUpdate,
} from "@/lib/services/admin/hook";
import { LANDING_COPY } from "@/lib/constants/landingCopy";
import type { LandingCopyKey } from "@/lib/constants/landingCopy";
import { HOME_SECTIONS, type HomeSectionKey } from "@/lib/constants/homeSections";
import {
  orderedHomeSections,
  type IResolvedHomeSection,
} from "@/lib/utils/resolveHomeSections";
import { SectionList } from "@/components/admin/page-builder/SectionList";
import { withStoragePaths } from "@/lib/utils/resolveSections";
import withNoSSR from "@/lib/utils/withNoSSR";
import {
  PREVIEW_DRAFT,
  PREVIEW_PATH,
  PREVIEW_READY,
} from "@/lib/constants/pageBuilderPreview";

/** Long copy gets a textarea — the same cut `CopyCard` makes. */
const isLongCopy = (key: LandingCopyKey) =>
  LANDING_COPY[key].value.includes("\n") || LANDING_COPY[key].value.length > 60;

/** Preview widths — the iframe's own viewport, so md:/lg: breakpoints react. */
const DEVICES = [
  { label: "موبایل", width: 390 },
  { label: "تبلت", width: 768 },
  { label: "دسکتاپ", width: 1280 },
];

function PageBuilder() {
  const queryClient = useQueryClient();
  const { data } = useAdminSiteContent();
  const { mutate: save, isPending } = useAdminSiteContentUpdate();

  const [sections, setSections] = useState<IResolvedHomeSection[]>([]);
  const [landing, setLanding] = useState<Record<string, string>>({});
  const [dirty, setDirty] = useState(false);

  // Seed from the server once it arrives; later refetches must not stomp edits.
  useEffect(() => {
    if (!data?.result || dirty) return;
    setSections(orderedHomeSections(data.result.homeSections));
    setLanding({ ...(data.result.landing ?? {}) });
  }, [data, dirty]);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [device, setDevice] = useState(DEVICES[0].width);
  const [guides, setGuides] = useState(true);

  // Push the draft on every edit, and again whenever the iframe (re)loads and
  // says it is ready — its listener may attach after our first post.
  useEffect(() => {
    const frame = () => iframeRef.current?.contentWindow;
    const send = () =>
      frame()?.postMessage({ type: PREVIEW_DRAFT, sections, landing, guides }, location.origin);
    const onMessage = (e: MessageEvent) => {
      if (e.origin === location.origin && e.source === frame() && e.data?.type === PREVIEW_READY) send();
    };
    send();
    addEventListener("message", onMessage);
    return () => removeEventListener("message", onMessage);
  }, [sections, landing, guides]);

  const setCopy = (key: LandingCopyKey, value: string) => {
    setLanding((prev) => ({ ...prev, [key]: value }));
    setDirty(true);
  };

  const handleSave = () => {
    save(
      // Re-resolve so half-typed sizes (<40px) are dropped, not sent.
      { homeSections: withStoragePaths(orderedHomeSections(sections)), landing },
      {
        onSuccess: () => {
          setDirty(false);
          queryClient.invalidateQueries({ queryKey: ["adminSiteContent"] });
          toast.success("صفحه اصلی ذخیره شد");
        },
        // The admin axios interceptor already toasts the failure.
      },
    );
  };

  const renderExtra = (key: HomeSectionKey) => {
    const meta = HOME_SECTIONS[key];

    return (
      <>
        {meta.copyKeys.map((copyKey) => {
          const field = LANDING_COPY[copyKey];
          // Empty means "use the shipped default" — the resolver falls back, so
          // the default is the placeholder.
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
          <Link href={meta.manageLink} className="text-sm text-primary-600 underline">
            {meta.manageLabel ?? "مدیریت محتوا"}
          </Link>
        )}

        {meta.copyKeys.length === 0 && !meta.manageLink && (
          <p className="text-sm text-gray-500">این بخش متن قابل ویرایشی ندارد.</p>
        )}
      </>
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
          <SectionList
            catalog={HOME_SECTIONS}
            sections={sections}
            onChange={(next) => {
              setSections(next);
              setDirty(true);
            }}
            renderExtra={renderExtra}
          />
        </Card>

        <Card className="flex min-w-0 flex-col gap-3 p-3">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm text-gray-500">پیش‌نمایش</p>
            <div className="flex gap-1">
              {DEVICES.map((d) => (
                <button
                  key={d.width}
                  type="button"
                  onClick={() => setDevice(d.width)}
                  className={`rounded-lg border px-2.5 py-1 text-xs ${device === d.width
                      ? "border-primary-500 bg-primary-50 text-primary-700"
                      : "border-gray-200 text-gray-600 hover:border-gray-300"
                    }`}
                >
                  {d.label} · {d.width}
                </button>
              ))}
            </div>
            <label className="ms-auto flex cursor-pointer items-center gap-1.5 text-xs text-gray-600">
              <input type="checkbox" checked={guides} onChange={(e) => setGuides(e.target.checked)} />
              راهنمای اندازه (کادر آبی: بخش، صورتی: کارت)
            </label>
          </div>

          <div className="overflow-x-auto rounded-2xl bg-zinc-950">
            <iframe
              ref={iframeRef}
              src={PREVIEW_PATH}
              title="پیش‌نمایش صفحه اصلی"
              style={{ width: device }}
              className="mx-auto block h-[75vh] border-0"
            />
          </div>
        </Card>
      </div>
    </div>
  );
}

export default withNoSSR(PageBuilder);
