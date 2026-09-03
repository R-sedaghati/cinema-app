"use client";

import { useEffect, useRef, useState } from "react";
import { Button, Drawer, Switch, Textarea } from "@dgshahr/ui-kit";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import { SMS_EVENT, SMS_VARIABLE_SAMPLE } from "@/lib/constants/sms/events";
import {
  useAdminNotificationSettings,
  useAdminSmsTemplateTest,
  useAdminSmsTemplateUpdate,
} from "@/lib/services/admin/hook";
import { ISmsTemplate } from "@/lib/services/admin/type";
import {
  findUnknownVariables,
  renderSmsTemplate,
} from "@/lib/utils/smsTemplate";
import getDrawerPosition from "@/lib/utils/getDrawerPosition";
import getDrawerWidth from "@/lib/utils/getDrawerWidth";

const MAX_LENGTH = 500;

interface SmsTemplateDrawerProps {
  open: boolean;
  onClose: () => void;
  template: ISmsTemplate | null;
}

const SmsTemplateDrawer = ({
  open,
  onClose,
  template,
}: SmsTemplateDrawerProps) => {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useAdminSmsTemplateUpdate();
  const { mutate: sendTest, isPending: isTesting } = useAdminSmsTemplateTest();
  // The test goes to the admin numbers, never to an applicant — so a half-written
  // draft can never reach a real user.
  const { data: notificationSettings } = useAdminNotificationSettings();

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [body, setBody] = useState("");
  const [isActive, setIsActive] = useState(false);

  // Re-seed whenever a different template is opened.
  useEffect(() => {
    if (!template) return;
    setBody(template.body);
    setIsActive(template.isActive);
  }, [template]);

  if (!template) return null;

  const variables = template.variables ?? [];
  const unknown = findUnknownVariables(body, variables);
  const tooLong = body.length > MAX_LENGTH;
  const isEmpty = !body.trim();

  // The panel mirrors the server's 400 conditions so the admin sees them while typing.
  const canSave = !isEmpty && !tooLong && unknown.length === 0;

  const adminPhones = (notificationSettings?.result?.phones ?? []).filter(Boolean);

  const insertVariable = (name: string) => {
    const field = textareaRef.current;
    const token = `{${name}}`;

    if (!field) {
      setBody((previous) => previous + token);
      return;
    }

    const { selectionStart, selectionEnd } = field;
    setBody(
      (previous) =>
        previous.slice(0, selectionStart) + token + previous.slice(selectionEnd),
    );

    // Put the caret after the inserted token once React has re-rendered the value.
    requestAnimationFrame(() => {
      const caret = selectionStart + token.length;
      field.focus();
      field.setSelectionRange(caret, caret);
    });
  };

  const handleTest = () => {
    // Send the draft, not the stored body — testing before committing is the whole point.
    sendTest(
      { event: template.event, payload: { body: body.trim() } },
      {
        onSuccess: (response) => {
          const { ok, sentTo, message } = response.result;
          if (ok) {
            toast.success(`پیامک آزمایشی به ${sentTo} شماره ارسال شد`);
          } else {
            toast.error(message || "ارسال پیامک آزمایشی ناموفق بود");
          }
        },
        onError: () => toast.error("ارسال پیامک آزمایشی ناموفق بود"),
      },
    );
  };

  const handleSave = () => {
    mutate(
      { event: template.event, payload: { body: body.trim(), isActive } },
      {
        onSuccess: () => {
          toast.success("متن پیامک ذخیره شد");
          queryClient.invalidateQueries({ queryKey: ["smsTemplateList"] });
          onClose();
        },
        onError: () => toast.error("خطا در ذخیره متن پیامک"),
      },
    );
  };

  return (
    <Drawer
      header={{
        title: "ویرایش پیامک خودکار",
        haveCloseIcon: true,
      }}
      width={getDrawerWidth(700)}
      position={getDrawerPosition()}
      open={open}
      onClose={onClose}
    >
      <div className="flex flex-col gap-6 ss02">
        <div className="flex flex-col gap-1">
          <p className="font-p1-medium">{SMS_EVENT[template.event]?.label}</p>
          <p className="font-p2-regular text-gray-500">
            {SMS_EVENT[template.event]?.description}
          </p>
        </div>

        <Switch
          label="ارسال این پیامک فعال باشد"
          checked={isActive}
          onChange={(checked: boolean) => setIsActive(checked)}
        />

        {variables.length > 0 && (
          <div className="flex flex-col gap-2">
            <p className="font-p2-medium">
              افزودن متغیر (در متن پیامک با مقدار واقعی جایگزین می‌شود)
            </p>
            <div className="flex flex-wrap gap-2">
              {variables.map((name) => (
                <Button
                  key={name}
                  onClick={() => insertVariable(name)}
                  variant="outline"
                  color="error"
                >
                  {`{${name}}`}
                </Button>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-1">
          <Textarea
            ref={textareaRef}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="متن پیامک"
          />
          <p
            className={
              tooLong
                ? "font-p2-regular text-error-500 self-start"
                : "font-p2-regular text-gray-500 self-start"
            }
          >
            {`${body.length}/${MAX_LENGTH}`}
          </p>
        </div>

        {unknown.length > 0 && (
          <p className="font-p2-regular text-error-500">
            {`متغیر${unknown.length > 1 ? "های" : ""} ${unknown
              .map((name) => `{${name}}`)
              .join("، ")} برای این رویداد تعریف نشده و جایگزین نمی‌شود.`}
          </p>
        )}

        <div className="flex flex-col gap-2">
          <p className="font-p2-medium">پیش‌نمایش</p>
          <p className="p-3 rounded-lg border border-gray-200 font-p1-regular whitespace-pre-wrap">
            {renderSmsTemplate(body, SMS_VARIABLE_SAMPLE) || "—"}
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <Button
            onClick={handleTest}
            isLoading={isTesting}
            disabled={isTesting || !canSave || adminPhones.length === 0}
            variant="outline"
            color="error"
          >
            {adminPhones.length > 0
              ? `ارسال آزمایشی به ${adminPhones.length} شماره ادمین`
              : "ارسال آزمایشی"}
          </Button>
          <p className="font-p2-regular text-gray-500">
            {adminPhones.length > 0
              ? "متن فعلی (حتی ذخیره‌نشده) با مقادیر نمونه به شماره‌های ادمین در تنظیمات اطلاع‌رسانی ارسال می‌شود."
              : "برای ارسال آزمایشی، ابتدا در «تنظیمات» شماره ادمین ثبت کنید."}
          </p>
        </div>

        <Button
          onClick={handleSave}
          isLoading={isPending}
          disabled={isPending || !canSave}
          variant="primary"
          color="error"
        >
          ذخیره
        </Button>
      </div>
    </Drawer>
  );
};

export default SmsTemplateDrawer;
