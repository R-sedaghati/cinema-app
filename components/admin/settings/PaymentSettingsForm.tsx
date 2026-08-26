"use client";

import { Button, Card, Divider, Input } from "@dgshahr/ui-kit";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import {
  useAdminPaymentSettings,
  useAdminPaymentSettingsUpdate,
  useAdminPaymentSettingsTest,
} from "@/lib/services/admin/hook";
import type { ISepEndpoints } from "@/lib/services/admin/type";

/**
 * SEP (سامان) gateway settings.
 *
 * The server only ever returns the terminal ID masked, so the field is seeded with the
 * mask and the mask is what gets sent back when the admin does not retype it — the
 * server reads that as "unchanged". Clearing the field clears the stored terminal.
 *
 * There is no sandbox toggle: SEP's test environment is a separate terminal ID against
 * the same host, so testing means entering the test terminal here.
 */

const ENDPOINTS: { key: keyof ISepEndpoints; label: string; hint: string }[] = [
  {
    key: "tokenUrl",
    label: "آدرس دریافت توکن",
    hint: "سرویسی که توکن پرداخت را صادر می‌کند (InitPayment).",
  },
  {
    key: "verifyUrl",
    label: "آدرس تأیید تراکنش",
    hint: "سرویس REST تأیید و برگشت تراکنش پس از بازگشت کاربر (VerifyTransaction).",
  },
  {
    key: "paymentUrl",
    label: "آدرس صفحه پرداخت",
    hint: "صفحه‌ای که کاربر برای پرداخت به آن منتقل می‌شود (OnlinePG).",
  },
];

const emptyEndpoints: ISepEndpoints = { tokenUrl: "", verifyUrl: "", paymentUrl: "" };

const PaymentSettingsForm = () => {
  const queryClient = useQueryClient();
  const { data, isPending: isLoading } = useAdminPaymentSettings();
  const { mutate, isPending } = useAdminPaymentSettingsUpdate();
  const { mutate: testConnection, isPending: isTesting } = useAdminPaymentSettingsTest();

  const setting = data?.result;

  const [terminalId, setTerminalId] = useState("");
  const [endpoints, setEndpoints] = useState<ISepEndpoints>(emptyEndpoints);
  const [isEditingKey, setIsEditingKey] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (!setting) return;

    // Don't clobber what the admin is in the middle of typing — this query refetches on
    // an interval, so an unguarded sync would overwrite the form mid-edit.
    if (!isEditingKey) setTerminalId(setting.terminalId ?? "");
    if (!isDirty) {
      setEndpoints({
        tokenUrl: setting.tokenUrl,
        verifyUrl: setting.verifyUrl,
        paymentUrl: setting.paymentUrl,
      });
    }
  }, [setting, isEditingKey, isDirty]);

  const editEndpoint = (key: keyof ISepEndpoints, value: string) => {
    setIsDirty(true);
    setEndpoints((previous) => ({ ...previous, [key]: value }));
  };

  const handleSubmit = () => {
    mutate(
      { terminalId, ...endpoints },
      {
        onSuccess: () => {
          toast.success("با موفقیت تغییر کرد");
          setIsEditingKey(false);
          setIsDirty(false);
          queryClient.invalidateQueries({ queryKey: ["adminPaymentSettings"] });
        },
        onError: () => toast.error("خطا در ذخیره‌سازی"),
      },
    );
  };

  const hasUnsavedEdits = isDirty || isEditingKey;

  const handleTest = () => {
    testConnection(undefined, {
      // A rejected terminal is a normal answer, not a request failure, so the result
      // arrives here rather than in onError.
      onSuccess: (response) => {
        const { ok, message } = response.result;
        if (ok) toast.success(message);
        else toast.error(message);
      },
      onError: () => toast.error("بررسی اتصال انجام نشد"),
    });
  };

  return (
    <Card>
      <div className="flex flex-col gap-5">
        <p className="font-h3-bold text-error-500">درگاه پرداخت سامان (سپ)</p>
        <Divider color="gray" size="thin" type="horizontal" />

        <div className="flex flex-col gap-3 border border-solid border-gray-300 rounded-xl p-3">
          <Input
            labelContent="شماره ترمینال سامان"
            placeholder="شماره ترمینال را وارد کنید"
            value={terminalId}
            disabled={isLoading}
            onFocus={() => {
              // The stored terminal is never sent to the browser, so editing starts blank.
              if (!isEditingKey) {
                setIsEditingKey(true);
                setTerminalId("");
              }
            }}
            onChange={(e) => setTerminalId(e.target.value)}
            hintMessage={
              setting?.usingEnvFallback
                ? "در حال حاضر از شماره ترمینال تنظیم‌شده روی سرور استفاده می‌شود. برای جایگزینی، شماره جدید را وارد کنید."
                : "برای تغییر، روی فیلد کلیک کرده و شماره جدید را وارد کنید. خالی گذاشتن یعنی استفاده از شماره تنظیم‌شده روی سرور."
            }
            wrapperClassName="w-full md:w-2/3"
          />

          <p className="font-p2-regular text-gray-500">
            برای تست، شماره ترمینال آزمایشی سامان را وارد کنید؛ درگاه سامان میزبان
            جداگانه‌ای برای حالت تست ندارد.
          </p>
        </div>

        <div className="flex flex-col gap-3 border border-solid border-gray-300 rounded-xl p-3">
          <p className="font-p1-bold">آدرس سرویس‌های درگاه</p>
          <p className="font-p2-regular text-gray-500">
            این آدرس‌ها به‌صورت پیش‌فرض تنظیم شده‌اند و فقط در صورت استفاده از محیط
            آزمایشی سامان نیاز به تغییر دارند. خالی گذاشتن هر فیلد یعنی بازگشت به مقدار
            پیش‌فرض.
          </p>

          {ENDPOINTS.map(({ key, label, hint }) => (
            <Input
              key={key}
              labelContent={label}
              placeholder={setting?.defaults[key] ?? ""}
              value={endpoints[key]}
              disabled={isLoading}
              onChange={(e) => editEndpoint(key, e.target.value)}
              hintMessage={
                setting && endpoints[key] !== setting.defaults[key]
                  ? `${hint} (تغییر یافته نسبت به مقدار پیش‌فرض)`
                  : hint
              }
              wrapperClassName="w-full"
            />
          ))}
        </div>

        <div className="flex justify-end gap-3">
          {/* The check runs against what is stored, not what is typed, so offering it
              mid-edit would report on settings the admin has already replaced. */}
          <Button
            color="gray"
            variant="outline"
            disabled={isTesting || isLoading || hasUnsavedEdits}
            isLoading={isTesting}
            onClick={handleTest}
          >
            {hasUnsavedEdits ? "ابتدا ذخیره کنید" : "بررسی اتصال"}
          </Button>
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

export default PaymentSettingsForm;
