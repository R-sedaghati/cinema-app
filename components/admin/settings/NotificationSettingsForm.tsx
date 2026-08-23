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

  useEffect(() => {
    // The query refetches every 30s — don't clobber a half-typed number.
    if (!setting || isDirty) return;

    setPhones(setting.phones ?? []);
    setEvents(setting.events ?? []);
  }, [setting, isDirty]);

  const patchPhone = (index: number, value: string) => {
    setIsDirty(true);
    setPhones((previous) =>
      previous.map((phone, i) => (i === index ? value : phone)),
    );
  };

  const removePhone = (index: number) => {
    setIsDirty(true);
    setPhones((previous) => previous.filter((_, i) => i !== index));
  };

  const addPhone = () => {
    setIsDirty(true);
    setPhones((previous) => [...previous, ""]);
  };

  const toggleEvent = (event: NotificationEvent) => {
    setIsDirty(true);
    setEvents((previous) =>
      previous.includes(event)
        ? previous.filter((item) => item !== event)
        : [...previous, event],
    );
  };

  const handleSubmit = () => {
    const normalized = [
      ...new Set(
        phones.map((phone) => toEnglishDigits(phone).trim()).filter(Boolean),
      ),
    ];

    if (!normalized.every(FIELD_VALIDATION_PRESETS.MOBILE.test)) {
      toast.error(FIELD_VALIDATION_PRESETS.MOBILE.message);
      return;
    }

    mutate(
      { phones: normalized, events },
      {
        onSuccess: () => {
          toast.success("با موفقیت تغییر کرد");
          setIsDirty(false);
          queryClient.invalidateQueries({
            queryKey: ["adminNotificationSettings"],
          });
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
            <div key={index} className="flex items-end gap-2">
              <Input
                placeholder="09xxxxxxxxx"
                value={phone}
                disabled={isLoading}
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

        <div className="flex justify-end">
          <Button
            color="error"
            disabled={isPending || isLoading}
            isLoading={isPending}
            onClick={handleSubmit}
          >
            ذخیره
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default NotificationSettingsForm;
