"use client";

import { Button, Card } from "@dgshahr/ui-kit";
import Input from "@/components/common/Input";
import Textarea from "@/components/common/Textarea";
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
import { SectionList } from "@/components/admin/page-builder/SectionList";
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
  const [dirty, setDirty] = useState(false);

  // Seed from the server once it arrives; later refetches must not stomp edits.
  useEffect(() => {
    if (!data?.result || dirty) return;
    setSections(orderedHomeSections(data.result.homeSections));
    setLanding({ ...(data.result.landing ?? {}) });
  }, [data, dirty]);

  const visible = useMemo(() => sections.filter((s) => !s.hidden), [sections]);

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
