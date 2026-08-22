"use client";

import { Button, Card, Divider, Input, Switch } from "@dgshahr/ui-kit";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import {
  useAdminPaymentSettings,
  useAdminPaymentSettingsUpdate,
} from "@/lib/services/admin/hook";

/**
 * Zarinpal credentials.
 *
 * The server only ever returns the merchant key masked, so the field is seeded with the
 * mask and the mask is what gets sent back when the admin does not retype the key —
 * the server reads that as "unchanged". Clearing the field clears the stored key.
 */
const PaymentSettingsForm = () => {
  const queryClient = useQueryClient();
  const { data, isPending: isLoading } = useAdminPaymentSettings();
  const { mutate, isPending } = useAdminPaymentSettingsUpdate();

  const setting = data?.result;

  const [merchantId, setMerchantId] = useState("");
  const [sandbox, setSandbox] = useState(false);
  const [isEditingKey, setIsEditingKey] = useState(false);

  useEffect(() => {
    if (!setting) return;

    // Don't clobber what the admin is in the middle of typing.
    if (!isEditingKey) setMerchantId(setting.merchantId ?? "");
    setSandbox(setting.sandbox);
  }, [setting, isEditingKey]);

  const handleSubmit = () => {
    mutate(
      { merchantId, sandbox },
      {
        onSuccess: () => {
          toast.success("با موفقیت تغییر کرد");
          setIsEditingKey(false);
          queryClient.invalidateQueries({ queryKey: ["adminPaymentSettings"] });
        },
        onError: () => toast.error("خطا در ذخیره‌سازی"),
      },
    );
  };

  return (
    <Card>
      <div className="flex flex-col gap-5">
        <p className="font-h3-bold text-error-500">درگاه پرداخت زرین‌پال</p>
        <Divider color="gray" size="thin" type="horizontal" />

        <div className="flex flex-col gap-3 border border-solid border-gray-300 rounded-xl p-3">
          <Input
            labelContent="مرچنت کد زرین‌پال"
            placeholder="مرچنت کد را وارد کنید"
            value={merchantId}
            disabled={isLoading}
            onFocus={() => {
              // The stored key is never sent to the browser, so editing starts blank.
              if (!isEditingKey) {
                setIsEditingKey(true);
                setMerchantId("");
              }
            }}
            onChange={(e) => setMerchantId(e.target.value)}
            hintMessage={
              setting?.usingEnvFallback
                ? "در حال حاضر از مرچنت کد تنظیم‌شده روی سرور استفاده می‌شود. برای جایگزینی، کد جدید را وارد کنید."
                : "برای تغییر، روی فیلد کلیک کرده و کد جدید را وارد کنید. خالی گذاشتن یعنی استفاده از کد تنظیم‌شده روی سرور."
            }
            wrapperClassName="w-full md:w-2/3"
          />

          <Switch
            label="حالت تست (Sandbox)"
            checked={sandbox}
            onChange={() => setSandbox((previous) => !previous)}
          />
          <p className="font-p2-regular text-gray-500">
            در حالت تست هیچ پرداخت واقعی انجام نمی‌شود و کاربر به درگاه آزمایشی
            زرین‌پال منتقل می‌شود.
          </p>
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

export default PaymentSettingsForm;
