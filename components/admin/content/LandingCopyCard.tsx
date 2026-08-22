"use client";

import { LANDING_COPY, LANDING_COPY_GROUPS } from "@/lib/constants/landingCopy";
import type { LandingCopyKey } from "@/lib/constants/landingCopy";
import { Button, Card, Divider, Input, Textarea } from "@dgshahr/ui-kit";
import { useEffect, useState } from "react";

/** Multi-line defaults get a textarea; everything else a single-line input. */
const isLong = (key: LandingCopyKey) =>
  LANDING_COPY[key].value.includes("\n") || LANDING_COPY[key].value.length > 60;

interface Props {
  /** The site-content request has resolved — `stored` may still be absent. */
  ready: boolean;
  stored?: Record<string, string> | null;
  isPending: boolean;
  onSave: (values: Record<string, string>) => void;
}

export default function LandingCopyCard({ ready, stored, isPending, onSave }: Props) {
  const [values, setValues] = useState<Record<string, string> | null>(null);

  // Local until saved, so seed once the site-content request lands.
  useEffect(() => {
    if (ready && !values) setValues({ ...(stored ?? {}) });
  }, [ready, stored, values]);

  if (!values) return null;

  const set = (key: LandingCopyKey, value: string) =>
    setValues((prev) => ({ ...prev, [key]: value }));

  return (
    <Card>
      <div className="flex flex-col gap-4">
        <p className="font-h3-bold text-error-500">متن‌های صفحات سایت</p>

        <p className="text-xs text-gray-500">
          خالی گذاشتن هر فیلد یعنی استفاده از متن پیش‌فرض (همان متنی که به عنوان
          راهنما داخل کادر می‌بینید).
        </p>

        {LANDING_COPY_GROUPS.map((group) => (
          <div key={group} className="flex flex-col gap-3">
            <Divider color="gray" size="thin" type="horizontal" />
            <p className="font-h6-bold">{group}</p>

            <div className="grid md:grid-cols-2 gap-2">
              {(Object.keys(LANDING_COPY) as LandingCopyKey[])
                .filter((key) => LANDING_COPY[key].group === group)
                .map((key) =>
                  isLong(key) ? (
                    <Textarea
                      key={key}
                      labelContent={LANDING_COPY[key].admin}
                      placeholder={LANDING_COPY[key].value}
                      rows={3}
                      value={values[key] ?? ""}
                      onChange={(e) => set(key, e.target.value)}
                    />
                  ) : (
                    <Input
                      key={key}
                      labelContent={LANDING_COPY[key].admin}
                      placeholder={LANDING_COPY[key].value}
                      value={values[key] ?? ""}
                      onChange={(e) => set(key, e.target.value)}
                    />
                  ),
                )}
            </div>
          </div>
        ))}

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
