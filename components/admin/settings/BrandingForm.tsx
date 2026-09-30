"use client";
/* eslint-disable @next/next/no-img-element */

import { Button, Card, Divider } from "@dgshahr/ui-kit";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import {
  useAdminSiteContent,
  useAdminSiteContentUpdate,
  useAdminUploadBrandImage,
} from "@/lib/services/admin/hook";
import { toStoragePath } from "@/lib/utils/toStoragePath";

type Slot = "logo" | "favicon";

const SLOTS: { key: Slot; label: string; fallback: string }[] = [
  { key: "logo", label: "لوگو (هدر، فوتر و پنل ادمین)", fallback: "/assets/images/logo.svg" },
  { key: "favicon", label: "آیکون تب مرورگر (favicon)", fallback: "/favicon-default.ico" },
];

const TYPES = ["image/png", "image/svg+xml", "image/webp", "image/jpeg", "image/x-icon", "image/vnd.microsoft.icon"];
const MAX_BYTES = 1024 * 1024;

/** Admin-uploaded logo and favicon, stored on site content. Empty = shipped files. */
const BrandingForm = () => {
  const queryClient = useQueryClient();
  const { data, isPending: isLoading } = useAdminSiteContent();
  const { mutate, isPending } = useAdminSiteContentUpdate();
  const { mutate: upload } = useAdminUploadBrandImage();

  // Public URLs; converted to storage paths on save.
  const [branding, setBranding] = useState<Partial<Record<Slot, string>>>({});
  const [uploading, setUploading] = useState<Slot | null>(null);

  const saved = data?.result?.branding;
  useEffect(() => {
    if (saved) setBranding(saved);
  }, [saved]);

  const handleFile = (key: Slot, file?: File) => {
    if (!file) return;
    if (!TYPES.includes(file.type)) return toast.error("فرمت مجاز: PNG، SVG، WEBP، JPG، ICO");
    if (file.size > MAX_BYTES) return toast.error("حداکثر حجم ۱ مگابایت است");

    setUploading(key);
    upload(file, {
      onSuccess: (res) => setBranding((b) => ({ ...b, [key]: res.url ?? res.path })),
      onError: () => toast.error("خطا در آپلود"),
      onSettled: () => setUploading(null),
    });
  };

  const handleSubmit = () => {
    const payload = Object.fromEntries(
      Object.entries(branding).filter(([, v]) => v).map(([k, v]) => [k, toStoragePath(v!)]),
    );
    mutate(
      { branding: payload },
      {
        onSuccess: (response) => {
          queryClient.setQueryData(["adminSiteContent"], response);
          queryClient.invalidateQueries({ queryKey: ["userSiteContent"] });
          toast.success("با موفقیت تغییر کرد");
        },
        onError: () => toast.error("خطا در ذخیره‌سازی"),
      },
    );
  };

  return (
    <Card>
      <div className="flex flex-col gap-5">
        <p className="font-h3-bold text-error-500">لوگو و آیکون سایت</p>
        <Divider color="gray" size="thin" type="horizontal" />

        <div className="flex flex-col md:flex-row gap-6">
          {SLOTS.map(({ key, label, fallback }) => (
            <div key={key} className="flex flex-col gap-2 w-full md:w-1/3">
              <p className="font-p2-medium">{label}</p>
              <img
                src={branding[key] || fallback}
                alt={label}
                className="h-20 w-20 object-contain rounded border border-gray-200 bg-gray-50 p-1"
              />
              <input
                type="file"
                accept={TYPES.join(",")}
                disabled={isLoading || uploading !== null}
                onChange={(e) => {
                  handleFile(key, e.target.files?.[0]);
                  e.target.value = "";
                }}
              />
              {uploading === key && <span className="text-sm">در حال آپلود…</span>}
              {branding[key] && (
                <button
                  type="button"
                  className="text-sm text-error-500 self-start"
                  onClick={() => setBranding((b) => ({ ...b, [key]: undefined }))}
                >
                  بازگشت به پیش‌فرض
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-end">
          <Button
            color="error"
            disabled={isPending || isLoading || uploading !== null}
            isLoading={isPending}
            onClick={handleSubmit}
          >
            ذخیره
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default BrandingForm;
