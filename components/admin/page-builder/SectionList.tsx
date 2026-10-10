"use client";

import React, { useState } from "react";
import { ChevronDown, Eye, EyeOff, GripVertical } from "lucide-react";
import Input from "@/components/common/Input";
import type { IResolvedSection, SizeKey } from "@/lib/utils/resolveSections";
import { VariantGlyph } from "./VariantGlyph";
import { SpacingBox } from "@/components/admin/SpacingBox";
import ColorInput from "@/components/admin/ColorInput";
import { useAdminUploadBannerImage } from "@/lib/services/admin/hook";
import type { IStyleField } from "@/lib/utils/sectionStyles";
import { StyleFields } from "./StyleFields";

/** The slice of a page's section catalog this list renders. */
export interface ISectionListEntry {
  admin: string;
  variants: { key: string; admin: string }[];
  hasCards?: boolean;
  styles?: IStyleField[];
}

interface ISizeField {
  key: SizeKey;
  label: string;
  hint: string;
}

const SECTION_SIZES: ISizeField[] = [
  { key: "width", label: "عرض ثابت بخش", hint: "دقیقاً همین عرض؛ در صفحه باریک‌تر جمع می‌شود" },
  { key: "height", label: "ارتفاع ثابت بخش", hint: "دقیقاً همین ارتفاع؛ اضافه بریده می‌شود" },
  { key: "maxWidth", label: "عرض بیشینه بخش", hint: "پهن‌تر از این نمی‌شود؛ بیش از عرض صفحه اثری ندارد" },
  { key: "minHeight", label: "حداقل ارتفاع بخش", hint: "کوتاه‌تر از این نمی‌شود؛ با محتوا بلندتر می‌شود" },
];
const CARD_SIZES: ISizeField[] = [
  { key: "cardWidth", label: "عرض کارت", hint: "عرض ثابت هر کارت؛ در شبکه تعداد ستون را تعیین می‌کند" },
  { key: "cardHeight", label: "ارتفاع کارت", hint: "ارتفاع ثابت هر کارت؛ اضافه بریده می‌شود" },
];

interface Props<K extends string> {
  catalog: Record<K, ISectionListEntry>;
  /** Rows to render, in order — may be one screen's subset of a larger config. */
  sections: IResolvedSection<K>[];
  /** Called with the reordered/edited rows, in the same subset. */
  onChange: (next: IResolvedSection<K>[]) => void;
  /** Extra controls inside a section's expanded panel (copy fields, links). */
  renderExtra?: (key: K) => React.ReactNode;
}

/**
 * Drag-to-reorder / hide / pick-a-variant list, shared by the home page-builder
 * and the artist-registration builder.
 */
export function SectionList<K extends string>({
  catalog,
  sections,
  onChange,
  renderExtra,
}: Props<K>) {
  const [expanded, setExpanded] = useState<K | null>(null);
  const [dragging, setDragging] = useState<string | null>(null);
  const [dropIndex, setDropIndex] = useState<number | null>(null);
  const { mutate: upload } = useAdminUploadBannerImage();
  const [uploading, setUploading] = useState<string | null>(null);

  const move = (fromKey: string, to: number) => {
    const from = sections.findIndex((s) => s.key === fromKey);
    if (from === -1 || from === to || from + 1 === to) return;
    const next = [...sections];
    const [item] = next.splice(from, 1);
    next.splice(from < to ? to - 1 : to, 0, item);
    onChange(next);
  };

  const patch = (key: string, change: Partial<IResolvedSection<K>>) =>
    onChange(sections.map((s) => (s.key === key ? { ...s, ...change } : s)));

  const handleFile = (key: string, file?: File) => {
    if (!file) return;
    setUploading(key);
    upload(file, {
      // Hold the public URL so the thumbnail and live preview can load it;
      // `withStoragePaths` turns it back into a path on save.
      onSuccess: (res) => patch(key, { backgroundImage: res.url ?? res.path }),
      onSettled: () => setUploading(null),
      // The admin axios interceptor already toasts the failure.
    });
  };

  return (
    <>
      {sections.map((section, index) => {
        const meta = catalog[section.key];
        if (!meta) return null;

        return (
          <div
            key={section.key}
            draggable={dragging === section.key}
            onDragOver={(e) => {
              if (!dragging) return;
              e.preventDefault();
              const box = e.currentTarget.getBoundingClientRect();
              setDropIndex(e.clientY < box.top + box.height / 2 ? index : index + 1);
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
                onClick={() => patch(section.key, { hidden: !section.hidden })}
                className="text-gray-500 hover:text-gray-800"
              >
                {section.hidden ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>

              <button
                type="button"
                aria-label="ویرایش بخش"
                onClick={() =>
                  setExpanded(expanded === section.key ? null : section.key)
                }
                className="text-gray-500 hover:text-gray-800"
              >
                <ChevronDown
                  size={18}
                  className={expanded === section.key ? "rotate-180" : ""}
                />
              </button>
            </div>

            {expanded === section.key && (
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
                            onChange={() => patch(section.key, { variant: v.key })}
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

                <fieldset className="flex flex-col gap-2">
                  <legend className="text-sm text-gray-600">
                    اندازه (پیکسل ۴۰ تا ۲۰۰۰، خالی = پیش‌فرض)
                  </legend>
                  <div className="grid grid-cols-2 gap-2">
                    {[...SECTION_SIZES, ...(meta.hasCards ? CARD_SIZES : [])].map(
                      ({ key, label, hint }) => (
                        <Input
                          key={key}
                          type="number"
                          min={40}
                          max={2000}
                          labelContent={label}
                          hintMessage={hint}
                          placeholder="پیش‌فرض"
                          value={section[key] ?? ""}
                          onChange={(e) =>
                            patch(section.key, {
                              [key]: e.target.value === "" ? undefined : Number(e.target.value),
                            })
                          }
                        />
                      ),
                    )}
                  </div>
                </fieldset>

                <fieldset className="flex flex-col gap-2">
                  <legend className="text-sm text-gray-600">فاصله داخلی بخش</legend>
                  <SpacingBox
                    values={{
                      top: section.paddingTop,
                      bottom: section.paddingBottom,
                      sides: section.paddingX,
                    }}
                    onChange={(v) =>
                      patch(section.key, {
                        paddingTop: v.top,
                        paddingBottom: v.bottom,
                        paddingX: v.sides,
                      })
                    }
                  />
                </fieldset>

                <ColorInput
                  label="رنگ پس‌زمینه بخش"
                  value={section.background}
                  onChange={(color) => patch(section.key, { background: color ?? undefined })}
                />

                <div className="flex flex-col gap-2">
                  <span className="text-sm">تصویر پس‌زمینه بخش</span>
                  <div className="flex items-center gap-3">
                    {section.backgroundImage && (
                      <div
                        className="relative h-12 w-20 overflow-hidden rounded-lg bg-cover bg-center"
                        style={{
                          backgroundImage: `url("${section.backgroundImage}")`,
                        }}
                      >
                        <div
                          className="absolute inset-0 bg-black"
                          style={{ opacity: (section.backgroundOverlay ?? 50) / 100 }}
                        />
                      </div>
                    )}
                    <label className="cursor-pointer text-sm text-primary-600 underline">
                      {uploading === section.key
                        ? "در حال بارگذاری..."
                        : section.backgroundImage
                          ? "تغییر تصویر"
                          : "انتخاب تصویر"}
                      <input
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        disabled={uploading !== null}
                        onChange={(e) => {
                          handleFile(section.key, e.target.files?.[0]);
                          e.target.value = "";
                        }}
                      />
                    </label>
                    {section.backgroundImage && (
                      <button
                        type="button"
                        className="text-xs text-gray-500 underline"
                        onClick={() =>
                          patch(section.key, { backgroundImage: undefined, backgroundOverlay: undefined })
                        }
                      >
                        حذف تصویر
                      </button>
                    )}
                  </div>
                  {section.backgroundImage && (
                    <label className="flex flex-col gap-1 text-sm">
                      تیرگی روی تصویر: {section.backgroundOverlay ?? 50}٪
                      <input
                        type="range"
                        min={0}
                        max={90}
                        step={10}
                        value={section.backgroundOverlay ?? 50}
                        onChange={(e) =>
                          patch(section.key, { backgroundOverlay: Number(e.target.value) })
                        }
                      />
                    </label>
                  )}
                </div>

                {meta.styles && (
                  <StyleFields
                    fields={meta.styles}
                    values={section.styles}
                    onChange={(styles) => patch(section.key, { styles })}
                  />
                )}

                {renderExtra?.(section.key)}
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}
