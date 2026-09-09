"use client";

import React, { useState } from "react";
import { ChevronDown, Eye, EyeOff, GripVertical } from "lucide-react";
import type { IResolvedSection } from "@/lib/utils/resolveSections";
import { VariantGlyph } from "./VariantGlyph";

/** The slice of a page's section catalog this list renders. */
export interface ISectionListEntry {
  admin: string;
  variants: { key: string; admin: string }[];
}

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

                {renderExtra?.(section.key)}
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}
