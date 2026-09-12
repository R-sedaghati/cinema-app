"use client";

import { Button, Card } from "@dgshahr/ui-kit";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import {
  useAdminSiteContent,
  useAdminSiteContentUpdate,
} from "@/lib/services/admin/hook";
import {
  REGISTRATION_SECTIONS,
  type RegistrationScreen,
  type RegistrationSectionKey,
} from "@/lib/constants/registrationSections";
import {
  onScreen,
  orderedRegistrationSections,
  type IResolvedRegistrationSection,
} from "@/lib/utils/resolveRegistrationSections";
import { useHomeCategories } from "@/components/home/sections/useHomeCategories";
import { useFormCopy } from "@/lib/hooks/useFormCopy";
import { SectionList } from "@/components/admin/page-builder/SectionList";
import SelectScreen from "@/components/artist-registration/sections/SelectScreen";
import withNoSSR from "@/lib/utils/withNoSSR";

const SCREEN_LABEL: Record<RegistrationScreen, string> = {
  select: "صفحه انتخاب فرم",
  flow: "صفحه تکمیل فرم",
};

function RegistrationBuilder() {
  const queryClient = useQueryClient();
  const { data } = useAdminSiteContent();
  const { mutate: save, isPending } = useAdminSiteContentUpdate();
  const copy = useFormCopy();

  const [sections, setSections] = useState<IResolvedRegistrationSection[]>([]);
  const [dirty, setDirty] = useState(false);

  // Seed from the server once it arrives; later refetches must not stomp edits.
  useEffect(() => {
    if (!data?.result || dirty) return;
    setSections(orderedRegistrationSections(data.result.registrationSections));
  }, [data, dirty]);

  // Real categories, so the preview shows the admin their own forms.
  const categories = useHomeCategories();
  const items = useMemo(
    () => categories.map((c) => ({ id: c.id, title: c.faName, image: c.image })),
    [categories],
  );

  const selectSections = useMemo(() => onScreen(sections, "select"), [sections]);
  const flowSections = useMemo(() => onScreen(sections, "flow"), [sections]);

  /** Rows come back per screen; order only matters within one, so concat is safe. */
  const replaceScreen = (
    screen: RegistrationScreen,
    next: IResolvedRegistrationSection[],
  ) => {
    setSections((prev) =>
      screen === "select"
        ? [...next, ...onScreen(prev, "flow")]
        : [...onScreen(prev, "select"), ...next],
    );
    setDirty(true);
  };

  const handleSave = () => {
    save(
      { registrationSections: sections },
      {
        onSuccess: () => {
          setDirty(false);
          queryClient.invalidateQueries({ queryKey: ["adminSiteContent"] });
          toast.success("صفحه ثبت‌نام ذخیره شد");
        },
        // The admin axios interceptor already toasts the failure.
      },
    );
  };

  const renderExtra = (key: RegistrationSectionKey) => {
    const meta = REGISTRATION_SECTIONS[key];

    return meta.manageLink ? (
      <Link href={meta.manageLink} className="text-sm text-primary-600 underline">
        {meta.manageLabel ?? "مدیریت محتوا"}
      </Link>
    ) : (
      <p className="text-sm text-gray-500">
        متن این بخش در فرم‌ساز هر دسته‌بندی ویرایش می‌شود.
      </p>
    );
  };

  return (
    <div className="flex flex-col gap-5 p-4 md:p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-bold">صفحه‌ساز صفحه ثبت‌نام</h1>
          <p className="text-sm text-gray-500 mt-1">
            ترتیب و چیدمان بخش‌های صفحه ثبت‌نام هنرمند را تغییر دهید. ترتیب
            کارت‌ها از «اولویت» دسته‌بندی‌ها خوانده می‌شود.
          </p>
        </div>
        <Button onClick={handleSave} disabled={!dirty || isPending}>
          {isPending ? "در حال ذخیره..." : "ذخیره"}
        </Button>
      </div>

      <div className="grid gap-5 lg:grid-cols-[380px_1fr] items-start">
        <div className="flex flex-col gap-4">
          <Card className="flex flex-col gap-2 p-3">
            <p className="text-sm font-medium text-gray-700">
              {SCREEN_LABEL.select}
            </p>
            <SectionList
              catalog={REGISTRATION_SECTIONS}
              sections={selectSections}
              onChange={(next) => replaceScreen("select", next)}
              renderExtra={renderExtra}
            />
          </Card>

          <Card className="flex flex-col gap-2 p-3">
            <p className="text-sm font-medium text-gray-700">{SCREEN_LABEL.flow}</p>
            <SectionList
              catalog={REGISTRATION_SECTIONS}
              sections={flowSections}
              onChange={(next) => replaceScreen("flow", next)}
              renderExtra={renderExtra}
            />
          </Card>
        </div>

        <Card className="p-3">
          <p className="mb-2 text-sm text-gray-500">
            پیش‌نمایش {SCREEN_LABEL.select}
          </p>
          {/* pointer-events-none: the real sections navigate — the preview must
              never take the panel with it. */}
          <div
            dir="rtl"
            className="pointer-events-none select-none max-w-[900px] overflow-hidden rounded-2xl bg-zinc-950 py-4 text-zinc-100"
          >
            <SelectScreen
              sections={selectSections.filter((s) => !s.hidden)}
              items={items}
              copy={copy}
              onSelect={() => undefined}
            />
          </div>
          <p className="mt-3 text-sm text-gray-500">
            {SCREEN_LABEL.flow} پیش‌نمایش ندارد — به یک فرم انتخاب‌شده نیاز دارد.
          </p>
        </Card>
      </div>
    </div>
  );
}

export default withNoSSR(RegistrationBuilder);
