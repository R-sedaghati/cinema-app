"use client";

import { X } from "lucide-react";
import { Chip } from "@dgshahr/ui-kit";
import type { IUserCategoryResponse } from "@/lib/services/landing/type";
import { useLandingCopy } from "@/lib/hooks/useLandingCopy";

/**
 * The selected id may be a child, so the parent has to be found by scanning children too —
 * otherwise picking a sub-speciality hides its siblings and blanks the parent's label.
 */
export function CategoryChips({
  categories,
  categoryId,
  onSelect,
}: Readonly<{
  categories: IUserCategoryResponse[];
  categoryId: number;
  onSelect: (id: number | null) => void;
}>) {
  const copy = useLandingCopy();
  const parent = categories.find(
    (item) =>
      item.id === categoryId ||
      item.children?.some((child) => child.id === categoryId),
  );

  return (
    <div className="flex flex-wrap justify-center gap-2 mt-5">
      <Chip
        clickable
        type="button"
        label={parent?.faName ?? copy("artistsCategoryLabel")}
        filled
        leftIcon={<X size={14} />}
        onClick={() => onSelect(null)}
      />

      {parent?.children?.map((child) => (
        <Chip
          clickable
          type="button"
          key={child.id}
          label={child.faName}
          filled={categoryId === child.id}
          // Clicking the active child steps back up to the parent.
          onClick={() => onSelect(categoryId === child.id ? parent.id : child.id)}
        />
      ))}
    </div>
  );
}
