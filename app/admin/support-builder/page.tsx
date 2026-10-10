"use client";

import { Button, Card } from "@dgshahr/ui-kit";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import { ImagePlus, Plus, Trash2, X } from "lucide-react";
import {
  useAdminSiteContent,
  useAdminSiteContentUpdate,
  useAdminUploadBannerImage,
} from "@/lib/services/admin/hook";
import type { ISiteContent, ISiteContentContactForm } from "@/lib/services/admin/type";
import { SUPPORT_SECTIONS, type SupportSectionKey } from "@/lib/constants/supportSections";
import { contactFormOf } from "@/lib/constants/contactForm";
import {
  orderedSections,
  withStoragePaths,
  type IResolvedSection,
} from "@/lib/utils/resolveSections";
import Input from "@/components/common/Input";
import Textarea from "@/components/common/Textarea";
import { SectionList } from "@/components/admin/page-builder/SectionList";
import { SupportSections } from "@/components/support/SupportSections";
import withNoSSR from "@/lib/utils/withNoSSR";

type Support = ISiteContent["support"];
type SupportItem = Support["items"][number];

const EMPTY_ITEM: SupportItem = { title: "", detail: "", footerText: "", buttonValue: "" };

function SupportBuilder() {
  const queryClient = useQueryClient();
  const { data } = useAdminSiteContent();
  const { mutate: save, isPending } = useAdminSiteContentUpdate();

  const [sections, setSections] = useState<IResolvedSection<SupportSectionKey>[]>([]);
  const [support, setSupport] = useState<Support>({ title: "", description: "", items: [] });
  const [form, setForm] = useState<ISiteContentContactForm | null>(null);
  const [dirty, setDirty] = useState(false);
  const { mutate: upload } = useAdminUploadBannerImage();
  const [uploading, setUploading] = useState<number | null>(null);

  // Seed from the server once it arrives; later refetches must not stomp edits.
  useEffect(() => {
    if (!data?.result || dirty) return;
    setSections(orderedSections(SUPPORT_SECTIONS, data.result.supportSections));
    setSupport(data.result.support ?? { title: "", description: "", items: [] });
    setForm(contactFormOf(data.result.contactForm));
  }, [data, dirty]);

  const editSupport = (change: Partial<Support>) => {
    setSupport((prev) => ({ ...prev, ...change }));
    setDirty(true);
  };
  const editItem = (index: number, change: Partial<SupportItem>) =>
    editSupport({ items: support.items.map((item, i) => (i === index ? { ...item, ...change } : item)) });
  const editForm = (change: Partial<ISiteContentContactForm>) => {
    setForm((prev) => (prev ? { ...prev, ...change } : prev));
    setDirty(true);
  };

  const handleImage = (index: number, file?: File) => {
    if (!file) return;
    setUploading(index);
    upload(file, {
      // Hold the public URL so the preview can load it; the backend strips it to a path on save.
      onSuccess: (res) => editItem(index, { image: res.url ?? res.path }),
      onSettled: () => setUploading(null),
      // The admin axios interceptor already toasts the failure.
    });
  };

  const handleSave = () => {
    save(
      {
        // Re-resolve so half-typed sizes (<40px) are dropped, not sent.
        supportSections: withStoragePaths(orderedSections(SUPPORT_SECTIONS, sections)),
        support,
        ...(form && { contactForm: form }),
      },
      {
        onSuccess: () => {
          setDirty(false);
          queryClient.invalidateQueries({ queryKey: ["adminSiteContent"] });
          toast.success("صفحه پشتیبانی ذخیره شد");
        },
        // The admin axios interceptor already toasts the failure.
      },
    );
  };

  const renderExtra = (key: SupportSectionKey) => {
    if (key === "intro") {
      return (
        <>
          <Input
            labelContent="عنوان صفحه"
            placeholder="مرکز پشتیبانی"
            value={support.title}
            onChange={(e) => editSupport({ title: e.target.value })}
          />
          <Textarea
            labelContent="توضیحات"
            rows={3}
            value={support.description}
            onChange={(e) => editSupport({ description: e.target.value })}
          />
        </>
      );
    }

    if (key === "cards") {
      return (
        <>
          {support.items.map((item, index) => (
            <div key={index} className="flex flex-col gap-2 rounded-lg border border-gray-200 p-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-700">کارت {index + 1}</p>
                <button
                  type="button"
                  aria-label={`حذف کارت ${index + 1}`}
                  className="text-gray-400 hover:text-error-500"
                  onClick={() => editSupport({ items: support.items.filter((_, i) => i !== index) })}
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="flex items-center gap-2">
                {item.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.image} alt="" className="h-12 w-16 rounded object-contain bg-zinc-900" />
                )}
                <label className="flex cursor-pointer items-center gap-1 text-sm text-primary-600">
                  <ImagePlus size={16} />
                  {uploading === index ? "در حال بارگذاری..." : item.image ? "تغییر تصویر" : "تصویر کارت (خالی = آیکون پیش‌فرض)"}
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    disabled={uploading !== null}
                    onChange={(e) => {
                      handleImage(index, e.target.files?.[0]);
                      e.target.value = "";
                    }}
                  />
                </label>
                {item.image && (
                  <button
                    type="button"
                    aria-label="حذف تصویر"
                    className="text-gray-400 hover:text-error-500"
                    onClick={() => editItem(index, { image: undefined })}
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
              <Input labelContent="عنوان" value={item.title} onChange={(e) => editItem(index, { title: e.target.value })} />
              <Textarea
                labelContent="توضیحات"
                rows={2}
                value={item.detail}
                onChange={(e) => editItem(index, { detail: e.target.value })}
              />
              <Input
                labelContent="متن پایین کارت"
                value={item.footerText}
                onChange={(e) => editItem(index, { footerText: e.target.value })}
              />
              <Input
                labelContent="متن دکمه (خالی = بدون دکمه)"
                value={item.buttonValue}
                onChange={(e) => editItem(index, { buttonValue: e.target.value })}
              />
            </div>
          ))}
          <button
            type="button"
            className="flex items-center gap-1 self-start text-sm text-primary-600"
            onClick={() => editSupport({ items: [...support.items, { ...EMPTY_ITEM }] })}
          >
            <Plus size={16} /> افزودن کارت
          </button>
        </>
      );
    }

    return (
      <>
        <Input
          labelContent="عنوان فرم"
          value={form?.title ?? ""}
          onChange={(e) => editForm({ title: e.target.value })}
        />
        <Input
          labelContent="متن دکمه ارسال"
          value={form?.submitLabel ?? ""}
          onChange={(e) => editForm({ submitLabel: e.target.value })}
        />
        <Link href="/admin/content-management" className="text-sm text-primary-600 underline">
          مدیریت فیلدهای فرم تماس
        </Link>
      </>
    );
  };

  return (
    <div className="flex flex-col gap-5 p-4 md:p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-bold">صفحه‌ساز صفحه پشتیبانی</h1>
          <p className="text-sm text-gray-500 mt-1">
            ترتیب، چیدمان، متن‌ها و ظاهر بخش‌های صفحه پشتیبانی را تغییر دهید.
            پیش‌نمایش سمت چپ زنده است.
          </p>
        </div>
        <Button onClick={handleSave} disabled={!dirty || isPending}>
          {isPending ? "در حال ذخیره..." : "ذخیره"}
        </Button>
      </div>

      <div className="grid gap-5 lg:grid-cols-[380px_1fr] items-start">
        <Card className="flex flex-col gap-2 p-3">
          <SectionList
            catalog={SUPPORT_SECTIONS}
            sections={sections}
            onChange={(next) => {
              setSections(next);
              setDirty(true);
            }}
            renderExtra={renderExtra}
          />
        </Card>

        <Card className="min-w-0 p-3">
          <p className="mb-2 text-sm text-gray-500">پیش‌نمایش</p>
          {/* pointer-events-none: the real form submits — the preview must never. */}
          <div
            dir="rtl"
            className="pointer-events-none select-none overflow-hidden rounded-2xl bg-zinc-950 text-zinc-100"
          >
            <SupportSections
              sections={sections.filter((s) => !s.hidden)}
              support={support}
              contactForm={form}
            />
          </div>
        </Card>
      </div>
    </div>
  );
}

export default withNoSSR(SupportBuilder);
