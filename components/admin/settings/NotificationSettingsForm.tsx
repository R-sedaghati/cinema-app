"use client";

import { Button, Card, Divider, Input, Switch } from "@dgshahr/ui-kit";
import { Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import {
  useAdminNotificationSettings,
  useAdminNotificationSettingsUpdate,
} from "@/lib/services/admin/hook";
import type { NotificationEvent } from "@/lib/services/admin/type";
import {
  FIELD_VALIDATION_PRESETS,
  toEnglishDigits,
} from "@/lib/utils/fieldValidationPresets";

const EVENT_LABELS: Record<NotificationEvent, string> = {
  REGISTRATION: "ثبت‌نام هنرمند جدید",
  TRANSACTION: "تراکنش‌های مالی",
  SUPPORT_TICKET: "پیام جدید پشتیبانی",
};

const EVENT_ORDER: NotificationEvent[] = [
  "REGISTRATION",
  "TRANSACTION",
  "SUPPORT_TICKET",
];

/**
 * Admin phone numbers that receive an SMS when one of the events below happens.
 * The toggles are global — every stored number gets every enabled event.
 */
const NotificationSettingsForm = () => {
  const queryClient = useQueryClient();
  const { data, isPending: isLoading } = useAdminNotificationSettings();
  const { mutate, isPending } = useAdminNotificationSettingsUpdate();

  const setting = data?.result;

  const [phones, setPhones] = useState<string[]>([]);
  const [events, setEvents] = useState<NotificationEvent[]>([]);
  const [isDirty, setIsDirty] = useState(false);
  const [invalidIndexes, setInvalidIndexes] = useState<Set<number>>(new Set());
  /** Second click arms the save that would wipe every number. */
  const [isConfirmingClear, setIsConfirmingClear] = useState(false);

  useEffect(() => {
    // The query refetches every 30s — don't clobber a half-typed number.
    if (!setting || isDirty) return;

    setPhones(setting.phones ?? []);
    setEvents(setting.events ?? []);
  }, [setting, isDirty]);

  // Any edit invalidates a pending "yes, wipe them all" confirmation.
  const markDirty = () => {
    setIsDirty(true);
    setIsConfirmingClear(false);
  };

  const patchPhone = (index: number, value: string) => {
    markDirty();
    setInvalidIndexes((previous) => {
      if (!previous.has(index)) return previous;
      const next = new Set(previous);
      next.delete(index);
      return next;
    });
    setPhones((previous) =>
      previous.map((phone, i) => (i === index ? value : phone)),
    );
  };

  const removePhone = (index: number) => {
    markDirty();
    // The flags are keyed by position, so a removal shifts them — drop the lot
    // rather than re-index; the next save recomputes them anyway.
    setInvalidIndexes(new Set());
    setPhones((previous) => previous.filter((_, i) => i !== index));
  };

  const addPhone = () => {
    markDirty();
    setPhones((previous) => [...previous, ""]);
  };

  const toggleEvent = (event: NotificationEvent) => {
    markDirty();
    setEvents((previous) =>
      previous.includes(event)
        ? previous.filter((item) => item !== event)
        : [...previous, event],
    );
  };

  const handleSubmit = () => {
    const trimmed = phones.map((phone) => toEnglishDigits(phone).trim());

    const invalid = new Set<number>();
    trimmed.forEach((phone, index) => {
      if (phone && !FIELD_VALIDATION_PRESETS.MOBILE.test(phone))
        invalid.add(index);
    });

    if (invalid.size > 0) {
      setInvalidIndexes(invalid);
      toast.error(FIELD_VALIDATION_PRESETS.MOBILE.message);
      return;
    }

    setInvalidIndexes(new Set());

    const normalized = [...new Set(trimmed.filter(Boolean))];

    // Saving an empty list turns admin SMS off entirely — make that a two-step.
    if (
      normalized.length === 0 &&
      (setting?.phones?.length ?? 0) > 0 &&
      !isConfirmingClear
    ) {
      setIsConfirmingClear(true);
      return;
    }

    // Blank and duplicate rows are dropped on save — show that in the form too,
    // instead of leaving ghost rows behind.
    setPhones(normalized);

    mutate(
      { phones: normalized, events },
      {
        // The PATCH echoes the stored settings, so seed the cache with them rather
        // than invalidating: an invalidated refetch lands *after* isDirty clears and
        // the effect above would briefly repaint the form from the stale entry.
        onSuccess: (response) => {
          queryClient.setQueryData(["adminNotificationSettings"], response);
          toast.success("با موفقیت تغییر کرد");
          setIsDirty(false);
          setIsConfirmingClear(false);
        },
        onError: () => toast.error("خطا در ذخیره‌سازی"),
      },
    );
  };

  return (
    <Card>
      <div className="flex flex-col gap-5">
        <p className="font-h3-bold text-error-500">اطلاع‌رسانی پیامکی مدیران</p>
        <Divider color="gray" size="thin" type="horizontal" />

        <div className="flex flex-col gap-3 border border-solid border-gray-300 rounded-xl p-3">
          <p className="font-p2-medium">شماره موبایل مدیران</p>

          {phones.length === 0 ? (
            <p className="font-p2-regular text-gray-500">
              هیچ شماره‌ای ثبت نشده است؛ پیامکی ارسال نمی‌شود.
            </p>
          ) : null}

          {phones.map((phone, index) => (
            <div key={index} className="flex items-start gap-2">
              <Input
                placeholder="09xxxxxxxxx"
                value={phone}
                disabled={isLoading}
                isError={invalidIndexes.has(index)}
                errorMessage={
                  invalidIndexes.has(index)
                    ? FIELD_VALIDATION_PRESETS.MOBILE.message
                    : undefined
                }
                onChange={(e) => patchPhone(index, e.target.value)}
                wrapperClassName="w-full md:w-2/3"
              />
              <Button
                variant="text"
                size="small"
                color="error"
                onClick={() => removePhone(index)}
              >
                <Trash2 size={18} />
              </Button>
            </div>
          ))}

          <div>
            <Button variant="text" size="small" onClick={addPhone}>
              <Plus size={18} />
              افزودن شماره
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-3 border border-solid border-gray-300 rounded-xl p-3">
          <p className="font-p2-medium">پیامک برای کدام رویدادها ارسال شود؟</p>

          {EVENT_ORDER.map((event) => (
            <Switch
              key={event}
              label={EVENT_LABELS[event]}
              checked={events.includes(event)}
              onChange={() => toggleEvent(event)}
            />
          ))}
        </div>

        <div className="flex flex-col items-end gap-2">
          {isConfirmingClear ? (
            <p className="font-p2-regular text-error-500">
              با این ذخیره همه شماره‌ها حذف می‌شوند و دیگر هیچ پیامکی برای مدیران
              ارسال نمی‌شود.
            </p>
          ) : null}

          <Button
            color="error"
            disabled={isPending || isLoading}
            isLoading={isPending}
            onClick={handleSubmit}
          >
            {isConfirmingClear ? "حذف همه شماره‌ها و غیرفعال کردن پیامک" : "ذخیره"}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default NotificationSettingsForm;
