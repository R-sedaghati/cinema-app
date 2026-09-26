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
import withNoSSR from "@/lib/utils/withNoSSR";

const KEYS = Object.keys(PAGE_BACKGROUNDS) as PageBackgroundKey[];

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
  const [dirty, setDirty] = useState(false);

  // Seed from the server once it arrives; later refetches must not stomp edits.
  useEffect(() => {
    if (!data?.result || dirty) return;
    setBackgrounds({ ...(data.result.pageBackgrounds ?? {}) });
  }, [data, dirty]);

  const patch = (key: string, change: Partial<IPageBackground>) => {
    setBackgrounds((prev) => ({ ...prev, [key]: { ...prev[key], ...change } }));
    setDirty(true);
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

    save(
      { pageBackgrounds },
      {
        onSuccess: () => {
          setDirty(false);
          queryClient.invalidateQueries({ queryKey: ["adminSiteContent"] });
          toast.success("پس‌زمینه صفحات ذخیره شد");
        },
      },
    );
  };

  return (
    <div className="flex flex-col gap-5 p-4 md:p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-bold">پس‌زمینه صفحات</h1>
          <p className="text-sm text-gray-500 mt-1">
            برای هر صفحه رنگ یا تصویر پس‌زمینه انتخاب کنید. صفحه‌هایی که تنظیم
            نشده‌اند از «همه صفحات» و در نبود آن از پس‌زمینه پیش‌فرض سایت استفاده
            می‌کنند.
          </p>
        </div>
        <Button onClick={handleSave} disabled={!dirty || isPending || uploading !== null}>
          {isPending ? "در حال ذخیره..." : "ذخیره"}
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {KEYS.map((key) => {
          const bg = backgrounds[key] ?? {};
          const src = bg.image && (previews[key] ?? bg.image);

          return (
            <Card key={key} className="flex flex-col gap-3 p-3">
              <p className="text-sm font-medium">{PAGE_BACKGROUNDS[key]}</p>

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
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export default withNoSSR(PageBackgrounds);
