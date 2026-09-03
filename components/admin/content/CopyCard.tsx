"use client";

import { Button, Card, Divider, Input, Textarea } from "@dgshahr/ui-kit";
import { useEffect, useState } from "react";

type CopyRegistry = Record<string, { admin: string; value: string; group?: string }>;

interface Props {
  title: string;
  /** Flat key → {admin label, default value, optional group} registry. */
  registry: CopyRegistry;
  /** Group order for registries that use groups; omit for a flat grid. */
  groups?: readonly string[];
  /** The site-content request has resolved — `stored` may still be absent. */
  ready: boolean;
  stored?: Record<string, string> | null;
  isPending: boolean;
  onSave: (values: Record<string, string>) => void;
}

export default function CopyCard({
  title,
  registry,
  groups,
  ready,
  stored,
  isPending,
  onSave,
}: Props) {
  const [values, setValues] = useState<Record<string, string> | null>(null);
  const [search, setSearch] = useState("");

  // Local until saved, so seed once the site-content request lands.
  useEffect(() => {
    if (ready && !values) setValues({ ...(stored ?? {}) });
  }, [ready, stored, values]);

  if (!values) return null;

  const set = (key: string, value: string) =>
    setValues((prev) => ({ ...prev, [key]: value }));

  /** Matches the panel label, the default text, the saved value, and the key itself. */
  const matches = (key: string) => {
    const term = search.trim();
    if (!term) return true;

    return [key, registry[key].admin, registry[key].value, values[key] ?? ""]
      .join(" ")
      .toLowerCase()
      .includes(term.toLowerCase());
  };

  const visibleKeys = Object.keys(registry).filter(matches);

  /** Multi-line defaults get a textarea; everything else a single-line input. */
  const isLong = (key: string) =>
    registry[key].value.includes("\n") || registry[key].value.length > 60;

  const renderField = (key: string) =>
    isLong(key) ? (
      <Textarea
        key={key}
        labelContent={registry[key].admin}
        placeholder={registry[key].value}
        rows={3}
        value={values[key] ?? ""}
        onChange={(e) => set(key, e.target.value)}
      />
    ) : (
      <Input
        key={key}
        labelContent={registry[key].admin}
        placeholder={registry[key].value}
        value={values[key] ?? ""}
        onChange={(e) => set(key, e.target.value)}
      />
    );

  return (
    <Card>
      <div className="flex flex-col gap-4">
        <p className="font-h3-bold text-error-500">{title}</p>

        <p className="text-xs text-gray-500">
          خالی گذاشتن هر فیلد یعنی استفاده از متن پیش‌فرض (همان متنی که به عنوان
          راهنما داخل کادر می‌بینید).
        </p>

        <Input
          placeholder="جستجو در متن‌ها…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {visibleKeys.length === 0 && (
          <p className="text-sm text-gray-500">متنی با این عبارت پیدا نشد.</p>
        )}

        {groups ? (
          groups.map((group) => {
            const groupKeys = visibleKeys.filter((key) => registry[key].group === group);
            // A search that matches nothing in this group hides the whole section.
            if (groupKeys.length === 0) return null;

            return (
              <div key={group} className="flex flex-col gap-3">
                <Divider color="gray" size="thin" type="horizontal" />
                <p className="font-h6-bold">{group}</p>

                <div className="grid md:grid-cols-2 gap-2">{groupKeys.map(renderField)}</div>
              </div>
            );
          })
        ) : (
          <div className="grid md:grid-cols-2 gap-2">
            {visibleKeys.map(renderField)}
          </div>
        )}

        <div className="flex justify-end">
          <Button
            color="error"
            isLoading={isPending}
            disabled={isPending}
            onClick={() => onSave(values)}
          >
            ثبت تغییرات
          </Button>
        </div>
      </div>
    </Card>
  );
}
