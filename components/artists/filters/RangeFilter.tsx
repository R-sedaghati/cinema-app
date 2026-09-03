"use client";

import { useEffect, useRef, useState } from "react";
import useDebounce from "@/lib/hooks/useDebounce";
import type { RangeValue } from "@/lib/hooks/useArtistSearchParams";
import type { IArtistFilterDescriptor } from "@/lib/services/landing/type";
import { useLandingCopy } from "@/lib/hooks/useLandingCopy";

export function RangeFilter({
  descriptor,
  value,
  onChange,
}: Readonly<{
  descriptor: Extract<IArtistFilterDescriptor, { kind: "range" }>;
  value: RangeValue;
  onChange: (bound: "min" | "max", value: string) => void;
}>) {
  const copy = useLandingCopy();
  // Local draft so typing doesn't push a URL entry per keystroke.
  const [draft, setDraft] = useState(value);
  const debounced = useDebounce(draft, 600);
  // What this component last wrote to the URL — anything else means someone else did.
  const pushed = useRef(value);

  // "حذف فیلترها" or a back-navigation changed the URL under us: adopt it and drop
  // the stale draft, otherwise the commit effect below writes the old bounds back.
  useEffect(() => {
    if (value.min !== pushed.current.min || value.max !== pushed.current.max) {
      pushed.current = value;
      setDraft(value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value.min, value.max]);

  useEffect(() => {
    if ((debounced.min ?? "") !== (value.min ?? "")) {
      pushed.current = { ...pushed.current, min: debounced.min };
      onChange("min", debounced.min ?? "");
    }
    if ((debounced.max ?? "") !== (value.max ?? "")) {
      pushed.current = { ...pushed.current, max: debounced.max };
      onChange("max", debounced.max ?? "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced]);

  return (
    <div className="flex items-center gap-2 rounded-full border border-zinc-800 px-3 py-1">
      <span className="text-sm text-zinc-400 text-nowrap">{descriptor.label}</span>
      <input
        type="number"
        inputMode="numeric"
        aria-label={copy("ariaRangeFrom", { label: descriptor.label })}
        min={descriptor.min}
        max={descriptor.max}
        placeholder={String(descriptor.min)}
        value={draft.min ?? ""}
        onChange={(e) => setDraft((prev) => ({ ...prev, min: e.target.value }))}
        className="w-14 bg-transparent text-sm text-zinc-100 outline-none"
      />
      <span className="text-zinc-600">{copy("artistsRangeTo")}</span>
      <input
        type="number"
        inputMode="numeric"
        aria-label={copy("ariaRangeTo", { label: descriptor.label })}
        min={descriptor.min}
        max={descriptor.max}
        placeholder={String(descriptor.max)}
        value={draft.max ?? ""}
        onChange={(e) => setDraft((prev) => ({ ...prev, max: e.target.value }))}
        className="w-14 bg-transparent text-sm text-zinc-100 outline-none"
      />
    </div>
  );
}
