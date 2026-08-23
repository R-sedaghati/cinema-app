"use client";

import { X } from "lucide-react";
import { Chip } from "@dgshahr/ui-kit";
import { SelectFilter } from "./SelectFilter";
import { RangeFilter } from "./RangeFilter";
import type { RangeValue } from "@/lib/hooks/useArtistSearchParams";
import type { IArtistFilterDescriptor } from "@/lib/services/landing/type";
import { useLandingCopy } from "@/lib/hooks/useLandingCopy";

export function ArtistFilterBar({
  descriptors,
  isPending,
  selections,
  ranges,
  activeFilterCount,
  onSelectionChange,
  onRangeChange,
  onClear,
}: Readonly<{
  descriptors: IArtistFilterDescriptor[];
  isPending: boolean;
  selections: Record<string, string[]>;
  ranges: Record<string, RangeValue>;
  activeFilterCount: number;
  onSelectionChange: (key: string, values: string[]) => void;
  onRangeChange: (key: string, bound: "min" | "max", value: string) => void;
  onClear: () => void;
}>) {
  const copy = useLandingCopy();

  if (isPending) return null;

  if (descriptors.length === 0) {
    return (
      <p className="text-sm text-zinc-500">
        {copy("artistsNoFilters")}
      </p>
    );
  }

  return (
    <div className="flex flex-wrap justify-center gap-2">
      {descriptors.map((descriptor) =>
        descriptor.kind === "select" ? (
          <SelectFilter
            key={descriptor.key}
            descriptor={descriptor}
            values={selections[descriptor.key] ?? []}
            onChange={(values) => onSelectionChange(descriptor.key, values)}
          />
        ) : (
          <RangeFilter
            key={descriptor.key}
            descriptor={descriptor}
            value={ranges[descriptor.key] ?? {}}
            onChange={(bound, value) => onRangeChange(descriptor.key, bound, value)}
          />
        ),
      )}

      {activeFilterCount > 0 && (
        <Chip
          clickable
          type="button"
          label={copy("artistsClearFilters")}
          leftIcon={<X size={14} />}
          onClick={onClear}
        />
      )}
    </div>
  );
}
