"use client";

import { Button, Card } from "@dgshahr/ui-kit";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowDown, ArrowUp, Eye, EyeOff, FileUp, ImagePlus, Plus, Trash2, X } from "lucide-react";
import {
  useAdminSiteContent,
  useAdminSiteContentUpdate,
  useAdminUploadBannerImage,
  useAdminUploadFile,
} from "@/lib/services/admin/hook";
import type {
  DownloadAlign,
  DownloadElementType,
  IDownloadElement,
  IDownloadPage,
  IDownloadSection,
} from "@/lib/services/admin/type";
import { DOWNLOAD_ICONS } from "@/lib/constants/downloadIcons";
import {
  BUTTON_VARIANTS,
  IMAGE_VARIANTS,
  SECTION_VARIANTS,
  TEXT_VARIANTS,
  type IDownloadVariant,
} from "@/lib/constants/downloadVariants";
import { DownloadSections } from "@/components/download/DownloadSections";
import Input from "@/components/common/Input";
import Textarea from "@/components/common/Textarea";
import ColorInput from "@/components/admin/ColorInput";
import FontSizeInput from "@/components/admin/FontSizeInput";
import withNoSSR from "@/lib/utils/withNoSSR";

const DEVICES = [
  { label: "موبایل", width: 390 },
  { label: "تبلت", width: 768 },
  { label: "دسکتاپ", width: 1280 },
];

const ALIGNS: { value: DownloadAlign; label: string }[] = [
  { value: "start", label: "راست" },
  { value: "center", label: "وسط" },
  { value: "end", label: "چپ" },
];

const WEIGHTS = [300, 400, 500, 600, 700, 800, 900];

const ELEMENT_LABELS: Record<DownloadElementType, string> = {
  heading: "تیتر",
  text: "متن",
  image: "تصویر",
  button: "دکمه",
};

const newElement = (type: DownloadElementType): IDownloadElement => {
  const id = crypto.randomUUID();
  switch (type) {
    case "heading":
      return { id, type, text: "دانلود اپلیکیشن" };
    case "text":
      return { id, type, text: "" };
    case "image":
      return { id, type, image: "" };
    case "button":
      return { id, type, label: "دانلود", icon: "download" };
  }
};

const newSection = (): IDownloadSection => ({ id: crypto.randomUUID(), layout: "column", elements: [] });

/** Swaps item `i` with its neighbour; out-of-range moves are no-ops. */
const move = <T,>(list: T[], i: number, dir: -1 | 1): T[] => {
  const j = i + dir;
  if (j < 0 || j >= list.length) return list;
  const next = [...list];
  [next[i], next[j]] = [next[j], next[i]];
  return next;
};

/** Px number field; empty = default (`undefined`). */
function NumField({
  label,
  value,
  onChange,
  min = 0,
  max = 2000,
}: {
  label: string;
  value?: number;
  onChange: (value: number | undefined) => void;
  min?: number;
  max?: number;
}) {
  return (
    <Input
      type="number"
      min={min}
      max={max}
      labelContent={label}
      placeholder="پیش‌فرض"
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value === "" ? undefined : Number(e.target.value))}
    />
  );
}

function AlignPicker({
  label,
  value,
  onChange,
}: {
  label: string;
  value?: DownloadAlign;
  onChange: (value: DownloadAlign | undefined) => void;
}) {
  return (
    <div className="col-span-2 flex flex-col gap-1">
      <span className="text-sm">{label}</span>
      <div className="flex gap-2">
        {ALIGNS.map((a) => (
          <button
            key={a.value}
            type="button"
            onClick={() => onChange(value === a.value ? undefined : a.value)}
            className={`rounded-lg border px-3 py-1 text-sm ${value === a.value
                ? "border-primary-500 bg-primary-50 text-primary-700"
                : "border-gray-200 text-gray-600 hover:border-gray-300"
              }`}
          >
            {a.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/** Preset-look chips; picking the first (default) entry clears the key. */
function VariantPicker({
  catalog,
  value,
  onChange,
}: {
  catalog: Record<string, IDownloadVariant>;
  value?: string;
  onChange: (value: string | undefined) => void;
}) {
  const [first] = Object.keys(catalog);
  const current = value && catalog[value] ? value : first;
  return (
    <div className="col-span-2 flex flex-col gap-1">
      <span className="text-sm">طرح</span>
      <div className="flex flex-wrap gap-1">
        {Object.entries(catalog).map(([key, { label }]) => (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key === first ? undefined : key)}
            className={`rounded-lg border px-2.5 py-1 text-xs ${current === key
                ? "border-primary-500 bg-primary-50 text-primary-700"
                : "border-gray-200 text-gray-600 hover:border-gray-300"
              }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

/** Upload button holding a public URL (for the preview); the backend strips it to a path on save. */
function UploadField({
  label,
  value,
  onChange,
  kind = "image",
}: {
  label: string;
  value?: string;
  onChange: (url: string | undefined) => void;
  kind?: "image" | "file";
}) {
  const image = useAdminUploadBannerImage();
  const file = useAdminUploadFile();
  const { mutate: upload, isPending } = kind === "image" ? image : file;

  return (
    <div className="col-span-2 flex items-center gap-2">
      {value && kind === "image" && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={value} alt="" className="h-12 w-16 rounded bg-zinc-900 object-contain" />
      )}
      {value && kind === "file" && (
        <a href={value} className="max-w-40 truncate text-xs text-gray-500 underline" dir="ltr">
          {value.split("/").pop()}
        </a>
      )}
      <label className="flex cursor-pointer items-center gap-1 text-sm text-primary-600">
        {kind === "image" ? <ImagePlus size={16} /> : <FileUp size={16} />}
        {isPending ? "در حال بارگذاری..." : value ? `تغییر ${label}` : label}
        <input
          type="file"
          accept={kind === "image" ? "image/*" : ".apk,.aab,.ipa"}
          hidden
          disabled={isPending}
          onChange={(e) => {
            const picked = e.target.files?.[0];
            e.target.value = "";
            if (!picked) return;
            // The admin axios interceptor already toasts the failure.
            upload(picked, { onSuccess: (res) => onChange(res.url ?? res.path) });
          }}
        />
      </label>
      {value && (
        <button
          type="button"
          aria-label={`حذف ${label}`}
          className="text-gray-400 hover:text-error-500"
          onClick={() => onChange(undefined)}
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}

function Toolbar({
  title,
  onUp,
  onDown,
  onDelete,
  hidden,
  onToggleHidden,
}: {
  title: string;
  onUp: () => void;
  onDown: () => void;
  onDelete: () => void;
  hidden?: boolean;
  onToggleHidden?: () => void;
}) {
  // Inside <summary>: stop clicks from also toggling the <details>.
  const act = (fn: () => void) => (e: React.MouseEvent) => {
    e.preventDefault();
    fn();
  };
  return (
    <summary className="flex cursor-pointer items-center gap-2 text-sm font-medium text-gray-700">
      <span className={`flex-1 ${hidden ? "text-gray-400 line-through" : ""}`}>{title}</span>
      {onToggleHidden && (
        <button type="button" aria-label={hidden ? "نمایش" : "پنهان"} className="text-gray-400" onClick={act(onToggleHidden)}>
          {hidden ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      )}
      <button type="button" aria-label="بالا" className="text-gray-400" onClick={act(onUp)}>
        <ArrowUp size={16} />
      </button>
      <button type="button" aria-label="پایین" className="text-gray-400" onClick={act(onDown)}>
        <ArrowDown size={16} />
      </button>
      <button type="button" aria-label="حذف" className="text-gray-400 hover:text-error-500" onClick={act(onDelete)}>
        <Trash2 size={16} />
      </button>
    </summary>
  );
}

function ElementFields({
  element,
  onChange,
}: {
  element: IDownloadElement;
  onChange: (change: Record<string, unknown>) => void;
}) {
  switch (element.type) {
    case "heading":
    case "text":
      return (
        <div className="grid grid-cols-2 gap-2">
          <VariantPicker catalog={TEXT_VARIANTS} value={element.variant} onChange={(variant) => onChange({ variant })} />
          <div className="col-span-2">
            <Textarea
              labelContent="متن"
              rows={element.type === "heading" ? 2 : 4}
              value={element.text}
              onChange={(e) => onChange({ text: e.target.value })}
            />
          </div>
          <div className="col-span-2">
            <FontSizeInput
              value={element.fontSize}
              defaultSize={element.type === "heading" ? "30" : "16"}
              onChange={(v) => onChange({ fontSize: v ?? undefined })}
            />
          </div>
          <ColorInput value={element.color} onChange={(c) => onChange({ color: c ?? undefined })} />
          <label className="flex flex-col gap-1 text-sm">
            ضخامت فونت
            <select
              className="h-10 rounded-lg border border-gray-300 bg-white px-2"
              value={element.weight ?? ""}
              onChange={(e) => onChange({ weight: e.target.value ? Number(e.target.value) : undefined })}
            >
              <option value="">پیش‌فرض</option>
              {WEIGHTS.map((w) => (
                <option key={w} value={w}>
                  {w}
                </option>
              ))}
            </select>
          </label>
          <AlignPicker label="چینش متن" value={element.align} onChange={(align) => onChange({ align })} />
        </div>
      );
    case "image":
      return (
        <div className="grid grid-cols-2 gap-2">
          <VariantPicker catalog={IMAGE_VARIANTS} value={element.variant} onChange={(variant) => onChange({ variant })} />
          <UploadField label="تصویر" value={element.image || undefined} onChange={(image) => onChange({ image: image ?? "" })} />
          {!element.image && <p className="col-span-2 text-xs text-error-500">بدون تصویر، این المان ذخیره نمی‌شود.</p>}
          <NumField label="عرض (px)" min={16} value={element.width} onChange={(width) => onChange({ width })} />
          <NumField label="گردی گوشه" max={200} value={element.radius} onChange={(radius) => onChange({ radius })} />
          <div className="col-span-2">
            <Input
              labelContent="لینک (اختیاری)"
              dir="ltr"
              placeholder="https://..."
              value={element.href ?? ""}
              onChange={(e) => onChange({ href: e.target.value || undefined })}
            />
          </div>
        </div>
      );
    case "button":
      return (
        <div className="grid grid-cols-2 gap-2">
          <VariantPicker catalog={BUTTON_VARIANTS} value={element.variant} onChange={(variant) => onChange({ variant })} />
          <div className="col-span-2">
            <Input labelContent="متن دکمه" value={element.label} onChange={(e) => onChange({ label: e.target.value })} />
          </div>
          <div className="col-span-2 flex flex-col gap-1">
            <span className="text-sm">آیکون</span>
            <div className="flex flex-wrap gap-1">
              <button
                type="button"
                onClick={() => onChange({ icon: undefined })}
                className={`rounded-lg border px-2 py-1 text-xs ${!element.icon ? "border-primary-500 bg-primary-50" : "border-gray-200"}`}
              >
                بدون
              </button>
              {Object.entries(DOWNLOAD_ICONS).map(([key, { label, Icon }]) => (
                <button
                  key={key}
                  type="button"
                  title={label}
                  aria-label={label}
                  onClick={() => onChange({ icon: key })}
                  className={`rounded-lg border p-1.5 ${element.icon === key ? "border-primary-500 bg-primary-50 text-primary-700" : "border-gray-200 text-gray-600"}`}
                >
                  <Icon size={18} />
                </button>
              ))}
            </div>
          </div>
          <UploadField
            label="آیکون تصویری (لوگوی بازار، مایکت…؛ جای آیکون بالا)"
            value={element.iconImage}
            onChange={(iconImage) => onChange({ iconImage })}
          />
          <div className="col-span-2">
            <Input
              labelContent="لینک"
              dir="ltr"
              placeholder="https://cafebazaar.ir/app/..."
              value={element.href ?? ""}
              onChange={(e) => onChange({ href: e.target.value || undefined })}
            />
          </div>
          <UploadField
            kind="file"
            label="فایل اپ (apk) — به جای لینک"
            value={element.file}
            onChange={(file) => onChange({ file })}
          />
          <div className="col-span-2">
            <FontSizeInput
              value={element.fontSize}
              defaultSize="16"
              onChange={(v) => onChange({ fontSize: v ?? undefined })}
            />
          </div>
          <ColorInput value={element.color} onChange={(c) => onChange({ color: c ?? undefined })} />
          <ColorInput label="رنگ پس‌زمینه" value={element.background} onChange={(c) => onChange({ background: c ?? undefined })} />
          <ColorInput label="رنگ حاشیه" value={element.borderColor} onChange={(c) => onChange({ borderColor: c ?? undefined })} />
          <NumField label="ضخامت حاشیه" max={20} value={element.borderWidth} onChange={(borderWidth) => onChange({ borderWidth })} />
          <NumField label="گردی گوشه" max={200} value={element.radius} onChange={(radius) => onChange({ radius })} />
          <NumField label="فاصله داخلی افقی" max={200} value={element.paddingX} onChange={(paddingX) => onChange({ paddingX })} />
          <NumField label="فاصله داخلی عمودی" max={200} value={element.paddingY} onChange={(paddingY) => onChange({ paddingY })} />
          <label className="col-span-2 flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={element.fullWidth ?? false}
              onChange={(e) => onChange({ fullWidth: e.target.checked || undefined })}
            />
            تمام‌عرض
          </label>
        </div>
      );
  }
}

function SectionFields({
  section,
  onChange,
}: {
  section: IDownloadSection;
  onChange: (change: Partial<IDownloadSection>) => void;
}) {
  return (
    <fieldset className="grid grid-cols-2 gap-2 rounded-lg border border-gray-100 p-2">
      <legend className="px-1 text-sm text-gray-600">ظاهر بخش</legend>
      <VariantPicker catalog={SECTION_VARIANTS} value={section.variant} onChange={(variant) => onChange({ variant })} />
      <div className="col-span-2 flex flex-col gap-1">
        <span className="text-sm">چیدمان المان‌ها</span>
        <div className="flex gap-2">
          {(
            [
              ["column", "زیر هم"],
              ["row", "کنار هم"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => onChange({ layout: value })}
              className={`rounded-lg border px-3 py-1 text-sm ${section.layout === value
                  ? "border-primary-500 bg-primary-50 text-primary-700"
                  : "border-gray-200 text-gray-600"
                }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <AlignPicker label="تراز" value={section.align} onChange={(align) => onChange({ align })} />
      <ColorInput label="رنگ پس‌زمینه" value={section.background} onChange={(c) => onChange({ background: c ?? undefined })} />
      <ColorInput label="رنگ حاشیه" value={section.borderColor} onChange={(c) => onChange({ borderColor: c ?? undefined })} />
      <NumField label="ضخامت حاشیه" max={20} value={section.borderWidth} onChange={(borderWidth) => onChange({ borderWidth })} />
      <NumField label="گردی گوشه" max={200} value={section.radius} onChange={(radius) => onChange({ radius })} />
      <NumField label="فاصله داخلی عمودی" max={200} value={section.paddingY} onChange={(paddingY) => onChange({ paddingY })} />
      <NumField label="فاصله داخلی افقی" max={200} value={section.paddingX} onChange={(paddingX) => onChange({ paddingX })} />
      <NumField label="فاصله بین المان‌ها" max={200} value={section.gap} onChange={(gap) => onChange({ gap })} />
      <NumField label="حداکثر عرض" min={320} max={2400} value={section.maxWidth} onChange={(maxWidth) => onChange({ maxWidth })} />
      <UploadField
        label="تصویر پس‌زمینه"
        value={section.backgroundImage}
        onChange={(backgroundImage) => onChange({ backgroundImage })}
      />
      {section.backgroundImage && (
        <NumField
          label="تیرگی روی تصویر (٪)"
          max={90}
          value={section.backgroundOverlay}
          onChange={(backgroundOverlay) => onChange({ backgroundOverlay })}
        />
      )}
    </fieldset>
  );
}

function DownloadBuilder() {
  const queryClient = useQueryClient();
  const { data } = useAdminSiteContent();
  const { mutate: save, isPending } = useAdminSiteContentUpdate();

  const [sections, setSections] = useState<IDownloadSection[]>([]);
  const [dirty, setDirty] = useState(false);
  const [device, setDevice] = useState(DEVICES[0].width);

  // Seed from the server once it arrives; later refetches must not stomp edits.
  useEffect(() => {
    if (!data?.result || dirty) return;
    setSections(data.result.downloadPage?.sections ?? []);
  }, [data, dirty]);

  const update = (next: IDownloadSection[]) => {
    setSections(next);
    setDirty(true);
  };
  const editSection = (si: number, change: Partial<IDownloadSection>) =>
    update(sections.map((s, i) => (i === si ? { ...s, ...change } : s)));
  const editElements = (si: number, fn: (elements: IDownloadElement[]) => IDownloadElement[]) =>
    editSection(si, { elements: fn(sections[si].elements) });

  const handleSave = () => {
    const downloadPage: IDownloadPage = { sections };
    save(
      { downloadPage },
      {
        onSuccess: () => {
          setDirty(false);
          queryClient.invalidateQueries({ queryKey: ["adminSiteContent"] });
          toast.success("صفحه دانلود ذخیره شد");
        },
        // The admin axios interceptor already toasts the failure.
      },
    );
  };

  return (
    <div className="flex flex-col gap-5 p-4 md:p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-bold">صفحه‌ساز صفحه دانلود اپ</h1>
          <p className="mt-1 text-sm text-gray-500">
            بخش بسازید و در هر بخش تیتر، متن، تصویر و دکمه اضافه کنید. صفحه در{" "}
            <a href="/download" target="_blank" className="text-primary-600 underline" dir="ltr">
              /download
            </a>{" "}
            نمایش داده می‌شود. پیش‌نمایش سمت چپ زنده است.
          </p>
        </div>
        <Button onClick={handleSave} disabled={!dirty || isPending}>
          {isPending ? "در حال ذخیره..." : "ذخیره"}
        </Button>
      </div>

      <div className="grid items-start gap-5 lg:grid-cols-[400px_1fr]">
        <Card className="flex flex-col gap-3 p-3">
          {sections.map((section, si) => (
            <details key={section.id} className="flex flex-col gap-2 rounded-lg border border-gray-200 p-2" open>
              <Toolbar
                title={`بخش ${si + 1}`}
                hidden={section.hidden}
                onToggleHidden={() => editSection(si, { hidden: !section.hidden || undefined })}
                onUp={() => update(move(sections, si, -1))}
                onDown={() => update(move(sections, si, 1))}
                onDelete={() => update(sections.filter((_, i) => i !== si))}
              />
              <div className="mt-2 flex flex-col gap-2">
                <SectionFields section={section} onChange={(change) => editSection(si, change)} />

                {section.elements.map((element, ei) => (
                  <details key={element.id} className="rounded-lg border border-gray-100 bg-gray-50 p-2">
                    <Toolbar
                      title={`${ELEMENT_LABELS[element.type]}${"text" in element && element.text ? ` — ${element.text.slice(0, 24)}` : "label" in element ? ` — ${element.label}` : ""}`}
                      onUp={() => editElements(si, (els) => move(els, ei, -1))}
                      onDown={() => editElements(si, (els) => move(els, ei, 1))}
                      onDelete={() => editElements(si, (els) => els.filter((_, i) => i !== ei))}
                    />
                    <div className="mt-2">
                      <ElementFields
                        element={element}
                        onChange={(change) =>
                          editElements(si, (els) =>
                            els.map((e, i) => (i === ei ? ({ ...e, ...change } as IDownloadElement) : e)),
                          )
                        }
                      />
                    </div>
                  </details>
                ))}

                <div className="flex flex-wrap gap-2">
                  {(Object.keys(ELEMENT_LABELS) as DownloadElementType[]).map((type) => (
                    <button
                      key={type}
                      type="button"
                      className="flex items-center gap-1 rounded-lg border border-dashed border-gray-300 px-2 py-1 text-xs text-primary-600"
                      onClick={() => editElements(si, (els) => [...els, newElement(type)])}
                    >
                      <Plus size={14} /> {ELEMENT_LABELS[type]}
                    </button>
                  ))}
                </div>
              </div>
            </details>
          ))}

          <button
            type="button"
            className="flex items-center gap-1 self-start text-sm text-primary-600"
            onClick={() => update([...sections, newSection()])}
          >
            <Plus size={16} /> افزودن بخش
          </button>
        </Card>

        <Card className="flex min-w-0 flex-col gap-3 p-3">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm text-gray-500">پیش‌نمایش</p>
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
          <div className="overflow-x-auto rounded-2xl bg-zinc-950">
            {/* pointer-events-none: the real buttons navigate/download — the preview must stay put. */}
            <div
              dir="rtl"
              style={{ width: device }}
              className="pointer-events-none mx-auto select-none text-zinc-100"
            >
              <DownloadSections page={{ sections }} />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default withNoSSR(DownloadBuilder);
