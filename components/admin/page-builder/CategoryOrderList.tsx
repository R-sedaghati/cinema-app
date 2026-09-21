/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, GripVertical } from "lucide-react";

export interface ICategoryOrderItem {
  id: number;
  faName: string;
  image?: string | null;
}

interface Props {
  /** Rows in their current display order. */
  items: ICategoryOrderItem[];
  /** Called with the full id list in its new order. */
  onReorder: (nextIds: number[]) => void;
  isSaving?: boolean;
}

/** Moves `from` to `to`, using the same drop-index convention as `SectionList`. */
const moved = (items: ICategoryOrderItem[], from: number, to: number) => {
  const next = [...items];
  const [item] = next.splice(from, 1);
  next.splice(from < to ? to - 1 : to, 0, item);
  return next;
};

/**
 * Drag- (or arrow-) to-reorder list of the registration form's first-step categories.
 * Reordering writes each category's `priority`, so the list is the direct-manipulation
 * counterpart of the «اولویت» number input on the category edit page.
 */
export function CategoryOrderList({ items, onReorder, isSaving }: Props) {
  const [dragging, setDragging] = useState<number | null>(null);
  const [dropIndex, setDropIndex] = useState<number | null>(null);

  const move = (fromId: number, to: number) => {
    const from = items.findIndex((item) => item.id === fromId);
    if (from === -1 || from === to || from + 1 === to) return;
    onReorder(moved(items, from, to).map((item) => item.id));
  };

  // Arrow buttons are the keyboard path to the same action; `to` follows the drop-index
  // convention above, hence the +2 when moving down.
  const nudge = (index: number, direction: "up" | "down") =>
    onReorder(
      moved(items, index, direction === "up" ? index - 1 : index + 2).map(
        (item) => item.id,
      ),
    );

  if (items.length === 0) {
    return <p className="text-sm text-gray-500">دسته‌بندی‌ای برای مرتب‌سازی نیست.</p>;
  }

  return (
    <div className={isSaving ? "opacity-60" : undefined}>
      {items.map((item, index) => (
        <div
          key={item.id}
          draggable={dragging === item.id}
          onDragOver={(e) => {
            if (dragging === null) return;
            e.preventDefault();
            const box = e.currentTarget.getBoundingClientRect();
            setDropIndex(e.clientY < box.top + box.height / 2 ? index : index + 1);
          }}
          onDrop={(e) => {
            e.preventDefault();
            if (dragging !== null && dropIndex !== null) move(dragging, dropIndex);
            setDragging(null);
            setDropIndex(null);
          }}
          onDragEnd={() => {
            setDragging(null);
            setDropIndex(null);
          }}
          className={`mb-2 flex items-center gap-2 rounded-xl border border-gray-200 p-2 ${
            dropIndex === index ? "border-t-2 border-t-primary-500" : ""
          }`}
        >
          <button
            type="button"
            aria-label="جابه‌جایی"
            className="cursor-grab text-gray-400"
            onMouseDown={() => setDragging(item.id)}
            onMouseUp={() => setDragging(null)}
          >
            <GripVertical size={18} />
          </button>

          {item.image ? (
            <img
              src={item.image}
              alt=""
              width={32}
              height={32}
              className="h-8 w-8 shrink-0 rounded-md object-cover"
            />
          ) : (
            <div className="h-8 w-8 shrink-0 rounded-md bg-gray-100" />
          )}

          <span className="flex-1 text-sm font-medium">{item.faName}</span>

          <button
            type="button"
            aria-label="جابه‌جایی به بالا"
            disabled={index === 0 || isSaving}
            onClick={() => nudge(index, "up")}
            className="text-gray-500 hover:text-gray-800 disabled:opacity-30"
          >
            <ChevronUp size={18} />
          </button>
          <button
            type="button"
            aria-label="جابه‌جایی به پایین"
            disabled={index === items.length - 1 || isSaving}
            onClick={() => nudge(index, "down")}
            className="text-gray-500 hover:text-gray-800 disabled:opacity-30"
          >
            <ChevronDown size={18} />
          </button>
        </div>
      ))}
    </div>
  );
}
