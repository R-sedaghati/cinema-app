"use client";

import { Button, Card } from "@dgshahr/ui-kit";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import {
  useAdminSiteContent,
  useAdminSiteContentUpdate,
} from "@/lib/services/admin/hook";
import { SITE_STYLE_AREAS } from "@/lib/constants/siteStyles";
import { StyleFields } from "@/components/admin/page-builder/StyleFields";
import withNoSSR from "@/lib/utils/withNoSSR";

type Styles = Record<string, Record<string, string>>;

/** Font size/color per text element, per area of the public site. */
function SiteStylesPage() {
  const queryClient = useQueryClient();
  const { data } = useAdminSiteContent();
  const { mutate: save, isPending } = useAdminSiteContentUpdate();
  const [styles, setStyles] = useState<Styles>({});
  const [dirty, setDirty] = useState(false);
  const [open, setOpen] = useState<string | null>(null);

  // Seed once from the server; later refetches must not stomp edits.
  useEffect(() => {
    if (!data?.result || dirty) return;
    setStyles({ ...(data.result.siteStyles ?? {}) });
  }, [data, dirty]);

  const setArea = (area: string, next: Record<string, string> | undefined) => {
    setStyles((prev) => {
      const copy = { ...prev };
      if (next) copy[area] = next;
      else delete copy[area];
      return copy;
    });
    setDirty(true);
  };

  const handleSave = () =>
    save(
      { siteStyles: styles },
      {
        onSuccess: () => {
          setDirty(false);
          queryClient.invalidateQueries({ queryKey: ["adminSiteContent"] });
          toast.success("ظاهر متن‌ها ذخیره شد");
        },
        // The admin axios interceptor already toasts the failure.
      },
    );

  return (
    <div className="flex flex-col gap-5 p-4 md:p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-bold">اندازه و رنگ متن‌های سایت</h1>
          <p className="mt-1 text-sm text-gray-500">
            برای هر بخش سایت، اندازه فونت (موبایل و دسکتاپ) و رنگ هر نوع متن را تعیین کنید.
            خالی = ظاهر پیش‌فرض. متن‌های صفحه اصلی در{" "}
            <Link href="/admin/page-builder" className="text-primary-600 underline">صفحه‌ساز</Link>{" "}
            و هر متن جداگانه در{" "}
            <Link href="/admin/content-management" className="text-primary-600 underline">مدیریت محتوا</Link>{" "}
            تنظیم می‌شود و بر این تنظیمات اولویت دارد.
          </p>
        </div>
        <Button onClick={handleSave} disabled={!dirty || isPending}>
          {isPending ? "در حال ذخیره..." : "ذخیره"}
        </Button>
      </div>

      <div className="flex max-w-3xl flex-col gap-3">
        {Object.entries(SITE_STYLE_AREAS).map(([area, meta]) => {
          const count = Object.keys(styles[area] ?? {}).length;
          return (
            <Card key={area} className="p-0">
              <button
                type="button"
                onClick={() => setOpen(open === area ? null : area)}
                className="flex w-full items-center gap-2 p-3 text-right"
              >
                <span className="flex-1 text-sm font-medium">{meta.admin}</span>
                {count > 0 && (
                  <span className="rounded-full bg-primary-50 px-2 py-0.5 text-xs text-primary-700">
                    {count.toLocaleString("fa-IR")} تنظیم
                  </span>
                )}
                <ChevronDown size={18} className={open === area ? "rotate-180" : ""} />
              </button>
              {open === area && (
                <div className="border-t border-gray-100 p-3">
                  <StyleFields
                    fields={meta.fields}
                    values={styles[area]}
                    onChange={(next) => setArea(area, next)}
                  />
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export default withNoSSR(SiteStylesPage);
