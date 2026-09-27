"use client";

import { Button, Card } from "@dgshahr/ui-kit";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import {
  useAdminSiteContent,
  useAdminSiteContentUpdate,
  useAdminUploadBannerImage,
} from "@/lib/services/admin/hook";
import { PAGE_BACKGROUNDS, type PageBackgroundKey } from "@/lib/constants/pageBackgrounds";
import type { IPageBackground } from "@/lib/utils/pageBackground";
import { toStoragePath } from "@/lib/utils/toStoragePath";
import ColorInput from "@/components/admin/ColorInput";
import { SpacingBox, type SpacingValues } from "@/components/admin/SpacingBox";
import { cleanPageLayout, type IPageLayout } from "@/lib/utils/pageLayout";
import Link from "next/link";
import withNoSSR from "@/lib/utils/withNoSSR";

const KEYS = Object.keys(PAGE_BACKGROUNDS) as PageBackgroundKey[];

/** Content-width presets; `undefined` = the page's shipped width. 1152 = today's `max-w-6xl`. */
const WIDTHS: { label: string; value?: number }[] = [
  { label: "پیش‌فرض" },
  { label: "باریک", value: 768 },
  { label: "معمولی", value: 1152 },
  { label: "پهن", value: 1440 },
  { label: "تمام‌عرض", value: 2400 },
];

type Device = "mobile" | "desktop";

/** SpacingBox sides → layout fields, per device. */
const SPACING_FIELDS: Record<Device, Record<keyof SpacingValues, keyof IPageLayout>> = {
  mobile: { top: "paddingTop", bottom: "paddingBottom", sides: "paddingX", gap: "gap" },
  desktop: { top: "paddingTopDesktop", bottom: "paddingBottomDesktop", sides: "paddingXDesktop", gap: "gapDesktop" },
};

const toSpacing = (layout: IPageLayout, device: Device): SpacingValues => {
  const out: SpacingValues = {};
  for (const [side, field] of Object.entries(SPACING_FIELDS[device]) as [keyof SpacingValues, keyof IPageLayout][]) {
    if (layout[field] !== undefined) out[side] = layout[field];
  }
  return out;
};

/** Public path of a page key, for the "view page" link. */
const pathOf = (key: PageBackgroundKey) => (key === "home" ? "/" : `/${key}`);

function PageBackgrounds() {
  const queryClient = useQueryClient();
  const { data } = useAdminSiteContent();
  const { mutate: save, isPending } = useAdminSiteContentUpdate();
  const { mutate: upload } = useAdminUploadBannerImage();

  const [backgrounds, setBackgrounds] = useState<Record<string, IPageBackground>>({});
  const [uploading, setUploading] = useState<string | null>(null);
  /** Local object URLs for fresh uploads — the upload returns a bare path the
   *  browser can't load; the saved value is still that path. */
  const [previews, setPreviews] = useState<Record<string, string>>({});
  const [layouts, setLayouts] = useState<Record<string, IPageLayout>>({});
  const [device, setDevice] = useState<Device>("mobile");
  const [dirty, setDirty] = useState(false);

  // Seed from the server once it arrives; later refetches must not stomp edits.
  useEffect(() => {
    if (!data?.result || dirty) return;
    setBackgrounds({ ...(data.result.pageBackgrounds ?? {}) });
    setLayouts({ ...(data.result.pageLayouts ?? {}) });
  }, [data, dirty]);

  const patch = (key: string, change: Partial<IPageBackground>) => {
    setBackgrounds((prev) => ({ ...prev, [key]: { ...prev[key], ...change } }));
    setDirty(true);
  };

  const patchLayout = (key: string, change: Partial<IPageLayout>) => {
    setLayouts((prev) => ({ ...prev, [key]: { ...prev[key], ...change } }));
    setDirty(true);
  };

  const setSpacing = (key: string, values: SpacingValues) => {
    const change: Partial<IPageLayout> = {};
    for (const [side, field] of Object.entries(SPACING_FIELDS[device]) as [keyof SpacingValues, keyof IPageLayout][]) {
      change[field] = values[side];
    }
    patchLayout(key, change);
  };

  /** Placeholder for an empty input: the value it inherits, else "default". */
  const inherited = (key: PageBackgroundKey): Partial<Record<keyof SpacingValues, string>> => {
    const own = layouts[key] ?? {};
    const base = key === "default" ? {} : (layouts.default ?? {});
    const out: Partial<Record<keyof SpacingValues, string>> = {};
    for (const side of Object.keys(SPACING_FIELDS.mobile) as (keyof SpacingValues)[]) {
      const mobileField = SPACING_FIELDS.mobile[side];
      const value =
        device === "desktop"
          ? (base[SPACING_FIELDS.desktop[side]] ?? own[mobileField] ?? base[mobileField])
          : base[mobileField];
      if (value !== undefined) out[side] = String(value);
    }
    return out;
  };

  const handleFile = (key: string, file?: File) => {
    if (!file) return;
    setUploading(key);
    upload(file, {
      onSuccess: (res) => {
        setPreviews((prev) => ({ ...prev, [key]: URL.createObjectURL(file) }));
        patch(key, { image: res.path });
      },
      onSettled: () => setUploading(null),
      // The admin axios interceptor already toasts the failure.
    });
  };

  const handleSave = () => {
    const pageBackgrounds = Object.fromEntries(
      Object.entries(backgrounds).map(([key, { color, image, overlay }]) => [
        key,
        { color, image: image ? toStoragePath(image) : undefined, overlay },
      ]),
    );

    const pageLayouts = Object.fromEntries(
      Object.entries(layouts)
        .map(([key, layout]) => [key, cleanPageLayout(layout)] as const)
        .filter(([, layout]) => Object.keys(layout).length > 0),
    );

    save(
      { pageBackgrounds, pageLayouts },
      {
        onSuccess: () => {
          setDirty(false);
          queryClient.invalidateQueries({ queryKey: ["adminSiteContent"] });
          toast.success("ظاهر صفحات ذخیره شد");
        },
      },
    );
  };

  return (
    <div className="flex flex-col gap-5 p-4 md:p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-bold">ظاهر صفحات</h1>
          <p className="text-sm text-gray-500 mt-1">
            برای هر صفحه پس‌زمینه، عرض محتوا و فاصله‌ها را تنظیم کنید. هر مقداری
            که خالی بماند از «همه صفحات» و در نبود آن از پیش‌فرض سایت گرفته
            می‌شود.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1 rounded-lg border border-gray-200 p-0.5 text-xs">
          <span className="px-1.5 text-gray-500">فاصله‌ها برای</span>
          {(["mobile", "desktop"] as const).map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDevice(d)}
              className={`rounded-md px-2.5 py-1 ${device === d ? "bg-primary-50 text-primary-700" : "text-gray-600"}`}
            >
              {d === "mobile" ? "موبایل" : "دسکتاپ"}
            </button>
          ))}
        </div>
        <Button onClick={handleSave} disabled={!dirty || isPending || uploading !== null}>
          {isPending ? "در حال ذخیره..." : "ذخیره"}
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {KEYS.map((key) => {
          const bg = backgrounds[key] ?? {};
          const src = bg.image && (previews[key] ?? bg.image);
          const layout = layouts[key] ?? {};
          const customWidth = layout.maxWidth !== undefined && !WIDTHS.some((w) => w.value === layout.maxWidth);

          return (
            <Card key={key} className="flex flex-col gap-3 p-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">{PAGE_BACKGROUNDS[key]}</p>
                {key !== "default" && (
                  <Link href={pathOf(key)} target="_blank" className="text-xs text-primary-600 underline">
                    مشاهده صفحه
                  </Link>
                )}
              </div>

              {/* Live swatch: same layering as the public `PageBackground`. */}
              <div
                className="relative h-28 overflow-hidden rounded-xl bg-cover bg-center"
                style={{
                  backgroundColor: bg.color,
                  backgroundImage: src
                    ? `url("${src}")`
                    : bg.color
                      ? undefined
                      : "linear-gradient(180deg, #263840 0%, #22353d 100%)",
                }}
              >
                {src && (
                  <div
                    className="absolute inset-0 bg-black"
                    style={{ opacity: (bg.overlay ?? 50) / 100 }}
                  />
                )}
                <span className="absolute inset-0 flex items-center justify-center text-sm text-zinc-100">
                  نمونه متن
                </span>
              </div>

              <ColorInput
                label="رنگ پس‌زمینه"
                value={bg.color}
                onChange={(color) => patch(key, { color: color ?? undefined })}
              />

              <div className="flex flex-col gap-1">
                <span className="text-sm">تصویر پس‌زمینه</span>
                <div className="flex items-center gap-3">
                  <label className="cursor-pointer text-sm text-primary-600 underline">
                    {uploading === key
                      ? "در حال بارگذاری..."
                      : src
                        ? "تغییر تصویر"
                        : "انتخاب تصویر"}
                    <input
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      disabled={uploading !== null}
                      onChange={(e) => {
                        handleFile(key, e.target.files?.[0]);
                        e.target.value = "";
                      }}
                    />
                  </label>
                  {src && (
                    <button
                      type="button"
                      className="text-xs text-gray-500 underline"
                      onClick={() =>
                        patch(key, { image: undefined, overlay: undefined })
                      }
                    >
                      حذف تصویر
                    </button>
                  )}
                </div>
              </div>

              {src && (
                <label className="flex flex-col gap-1 text-sm">
                  تیرگی روی تصویر: {bg.overlay ?? 50}٪
                  <input
                    type="range"
                    min={0}
                    max={90}
                    step={10}
                    value={bg.overlay ?? 50}
                    onChange={(e) => patch(key, { overlay: Number(e.target.value) })}
                  />
                </label>
              )}

              <div className="flex flex-col gap-2 border-t border-gray-100 pt-3">
                <p className="text-sm font-medium text-gray-700">چیدمان و فاصله‌ها</p>

                <div className="flex flex-col gap-1">
                  <span className="text-sm">عرض محتوا</span>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {WIDTHS.map((w) => (
                      <button
                        key={w.label}
                        type="button"
                        title={w.value ? `${w.value}px` : "عرض پیش‌فرض همین صفحه"}
                        onClick={() => patchLayout(key, { maxWidth: w.value })}
                        className={`rounded-lg border px-2.5 py-1 text-xs ${
                          layout.maxWidth === w.value && !customWidth
                            ? "border-primary-500 bg-primary-50 text-primary-700"
                            : "border-gray-200 text-gray-600 hover:border-gray-300"
                        }`}
                      >
                        {w.label}
                      </button>
                    ))}
                    <input
                      type="number"
                      min={320}
                      max={2400}
                      dir="ltr"
                      aria-label="عرض سفارشی (پیکسل)"
                      placeholder="سفارشی px"
                      value={customWidth ? layout.maxWidth : ""}
                      onChange={(e) =>
                        patchLayout(key, {
                          maxWidth: e.target.value === "" ? undefined : Number(e.target.value),
                        })
                      }
                      className={`w-24 rounded-lg border px-2 py-1 text-xs ${
                        customWidth ? "border-primary-500" : "border-gray-200"
                      }`}
                    />
                  </div>
                </div>

                <span className="text-sm">
                  فاصله‌ها · {device === "mobile" ? "موبایل" : "دسکتاپ (۷۶۸ پیکسل به بالا)"}
                </span>
                <SpacingBox
                  withGap
                  values={toSpacing(layout, device)}
                  placeholders={inherited(key)}
                  onChange={(v) => setSpacing(key, v)}
                />
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export default withNoSSR(PageBackgrounds);
