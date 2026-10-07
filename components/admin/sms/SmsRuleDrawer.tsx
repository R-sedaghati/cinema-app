"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Button, Drawer, Switch } from "@dgshahr/ui-kit";
import { ArrowDown, ArrowUp, Trash2, X } from "lucide-react";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import Input from "@/components/common/Input";
import Textarea from "@/components/common/Textarea";
import {
  SMS_MODE_LABEL,
  SMS_RECIPIENT_LABEL,
  SMS_VARIABLE_SAMPLE,
} from "@/lib/constants/sms/events";
import {
  useAdminNotificationSettings,
  useAdminSmsRuleCreate,
  useAdminSmsRuleDelete,
  useAdminSmsRuleTest,
  useAdminSmsRuleUpdate,
} from "@/lib/services/admin/hook";
import {
  ISmsRule,
  ISmsTrigger,
  SmsMode,
  SmsRecipient,
} from "@/lib/services/admin/type";
import { findUnknownVariables, renderSmsTemplate } from "@/lib/utils/smsTemplate";
import getDrawerPosition from "@/lib/utils/getDrawerPosition";
import getDrawerWidth from "@/lib/utils/getDrawerWidth";

const MAX_LENGTH = 500;

const fieldClass =
  "h-11 w-full rounded-lg border border-gray-300 bg-transparent px-3 text-sm outline-none focus:border-error-500";

interface Props {
  open: boolean;
  onClose: () => void;
  triggers: ISmsTrigger[];
  /** The rule being edited; `null` opens the form to add a new one. */
  rule: ISmsRule | null;
  /** Trigger preselected when adding from a trigger's own «افزودن». */
  presetTrigger?: string | null;
}

const SmsRuleDrawer = ({ open, onClose, triggers, rule, presetTrigger }: Props) => {
  const queryClient = useQueryClient();
  const { mutate: create, isPending: isCreating } = useAdminSmsRuleCreate();
  const { mutate: update, isPending: isUpdating } = useAdminSmsRuleUpdate();
  const { mutate: remove, isPending: isDeleting } = useAdminSmsRuleDelete();
  const { mutate: sendTest, isPending: isTesting } = useAdminSmsRuleTest();
  // The test goes to the admin numbers, never to an applicant.
  const { data: notificationSettings } = useAdminNotificationSettings();

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [triggerKey, setTriggerKey] = useState("");
  const [name, setName] = useState("");
  const [recipient, setRecipient] = useState<SmsRecipient>("APPLICANT");
  const [customPhones, setCustomPhones] = useState("");
  const [mode, setMode] = useState<SmsMode>("TEXT");
  const [body, setBody] = useState("");
  const [patternBodyId, setPatternBodyId] = useState("");
  const [patternVariables, setPatternVariables] = useState<string[]>([]);
  const [isActive, setIsActive] = useState(true);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const trigger = triggers.find((t) => t.key === triggerKey);
  const isEdit = Boolean(rule);

  // Re-seed whenever a different rule — or a new one — is opened.
  useEffect(() => {
    if (!open) return;
    setConfirmingDelete(false);

    if (rule) {
      setTriggerKey(rule.trigger);
      setName(rule.name);
      setRecipient(rule.recipient);
      setCustomPhones((rule.customPhones ?? []).join("\n"));
      setMode(rule.mode);
      setBody(rule.body);
      setPatternBodyId(rule.patternBodyId ?? "");
      setPatternVariables(rule.patternVariables ?? []);
      setIsActive(rule.isActive);
      return;
    }

    const first = triggers.find((t) => t.key === presetTrigger) ?? triggers[0];
    setTriggerKey(first?.key ?? "");
    setName("");
    setRecipient(first?.defaultRecipient ?? "APPLICANT");
    setCustomPhones("");
    setMode("TEXT");
    setBody(first?.defaultBody ?? "");
    setPatternBodyId("");
    setPatternVariables([]);
    setIsActive(true);
  }, [open, rule, presetTrigger, triggers]);

  const groups = useMemo(() => {
    const byGroup = new Map<string, ISmsTrigger[]>();
    triggers.forEach((t) => byGroup.set(t.group, [...(byGroup.get(t.group) ?? []), t]));
    return [...byGroup.entries()];
  }, [triggers]);

  if (!trigger) return null;

  const variables = trigger.variables;
  const unknown = findUnknownVariables(body, variables);
  const tooLong = body.length > MAX_LENGTH;
  const phoneList = customPhones.split(/[\s,،;]+/).filter(Boolean);
  const phonesMissing = recipient === "CUSTOM" && phoneList.length === 0;
  const patternInvalid = mode === "PATTERN" && !/^\d+$/.test(patternBodyId.trim());
  const canSave =
    Boolean(body.trim()) && !tooLong && unknown.length === 0 && !phonesMissing && !patternInvalid;

  // With no saved order the server fills the slots from the text's placeholders.
  const textSlots = [...new Set([...body.matchAll(/\{(\w+)\}/g)].map((m) => m[1]))];
  const adminPhones = (notificationSettings?.result?.phones ?? []).filter(Boolean);

  const payload = () => ({
    trigger: triggerKey,
    name: name.trim(),
    recipient,
    customPhones: recipient === "CUSTOM" ? phoneList : [],
    mode,
    body: body.trim(),
    patternBodyId: mode === "PATTERN" ? patternBodyId.trim() : null,
    patternVariables: mode === "PATTERN" ? patternVariables : [],
    isActive,
  });

  const changeTrigger = (key: string) => {
    const next = triggers.find((t) => t.key === key);
    if (!next) return;
    setTriggerKey(key);
    // A message not yet written follows the new place's standard text and recipient.
    if (!isEdit) {
      setRecipient(next.defaultRecipient);
      setBody(next.defaultBody);
    }
    setPatternVariables([]);
  };

  const insertVariable = (variable: string) => {
    const field = textareaRef.current;
    const token = `{${variable}}`;

    if (!field) {
      setBody((previous) => previous + token);
      return;
    }

    const { selectionStart, selectionEnd } = field;
    setBody((previous) => previous.slice(0, selectionStart) + token + previous.slice(selectionEnd));
    requestAnimationFrame(() => {
      const caret = selectionStart + token.length;
      field.focus();
      field.setSelectionRange(caret, caret);
    });
  };

  const moveSlot = (index: number, by: -1 | 1) =>
    setPatternVariables((previous) => {
      const next = [...previous];
      const target = index + by;
      if (target < 0 || target >= next.length) return previous;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });

  const done = (message: string) => {
    toast.success(message);
    queryClient.invalidateQueries({ queryKey: ["smsRuleList"] });
    onClose();
  };

  const handleSave = () => {
    const callbacks = {
      onError: (error: unknown) => {
        const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message;
        toast.error(message || "خطا در ذخیره پیامک");
      },
    };

    if (rule) {
      update({ id: rule.id, payload: payload() }, { ...callbacks, onSuccess: () => done("پیامک ذخیره شد") });
    } else {
      create(payload(), { ...callbacks, onSuccess: () => done("پیامک اضافه شد") });
    }
  };

  const handleDelete = () => {
    if (!rule) return;

    remove(rule.id, {
      onSuccess: () => done("پیامک حذف شد"),
      onError: () => toast.error("خطا در حذف پیامک"),
    });
  };

  const handleTest = () => {
    // The draft is tested, not the stored rule — testing before committing is the point.
    sendTest(payload(), {
      onSuccess: (response) => {
        const { ok, sentTo, message } = response.result;
        if (ok) toast.success(`پیامک آزمایشی به ${sentTo} شماره ارسال شد`);
        else toast.error(message || "ارسال پیامک آزمایشی ناموفق بود");
      },
      onError: () => toast.error("ارسال پیامک آزمایشی ناموفق بود"),
    });
  };

  return (
    <Drawer
      header={{ title: isEdit ? "ویرایش پیامک" : "افزودن پیامک", haveCloseIcon: true }}
      width={getDrawerWidth(700)}
      position={getDrawerPosition()}
      open={open}
      onClose={onClose}
    >
      <div className="flex flex-col gap-6 ss02">
        <div className="flex flex-col gap-2">
          <label className="font-p2-medium" htmlFor="sms-trigger">
            این پیامک چه زمانی ارسال شود؟
          </label>
          <select
            id="sms-trigger"
            className={fieldClass}
            value={triggerKey}
            onChange={(e) => changeTrigger(e.target.value)}
          >
            {groups.map(([group, items]) => (
              <optgroup key={group} label={group}>
                {items.map((t) => (
                  <option key={t.key} value={t.key}>
                    {t.label}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          <p className="font-p2-regular text-gray-500">{trigger.description}</p>
        </div>

        <Input
          labelContent="عنوان (برای شناسایی در لیست)"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={trigger.label}
        />

        <div className="flex flex-col gap-2">
          <label className="font-p2-medium" htmlFor="sms-recipient">
            به چه کسی ارسال شود؟
          </label>
          <select
            id="sms-recipient"
            className={fieldClass}
            value={recipient}
            onChange={(e) => setRecipient(e.target.value as SmsRecipient)}
          >
            {(Object.keys(SMS_RECIPIENT_LABEL) as SmsRecipient[]).map((r) => (
              <option key={r} value={r}>
                {SMS_RECIPIENT_LABEL[r]}
              </option>
            ))}
          </select>
          {recipient === "ADMINS" && (
            <p className="font-p2-regular text-gray-500">
              {adminPhones.length
                ? `شماره‌های ثبت‌شده در «تنظیمات»: ${adminPhones.length} شماره.`
                : "هنوز شماره‌ای در «تنظیمات» ثبت نشده است."}
              {trigger.adminOptIn && " این پیامک فقط وقتی ارسال می‌شود که رویداد مربوط در «تنظیمات» روشن باشد."}
            </p>
          )}
          {recipient === "CUSTOM" && (
            <>
              <Textarea
                value={customPhones}
                onChange={(e) => setCustomPhones(e.target.value)}
                placeholder="هر شماره در یک خط، مثلاً 09123456789"
              />
              {phonesMissing && (
                <p className="font-p2-regular text-error-500">حداقل یک شماره موبایل وارد کنید.</p>
              )}
            </>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <p className="font-p2-medium">نوع ارسال</p>
          <div className="flex gap-2">
            {(Object.keys(SMS_MODE_LABEL) as SmsMode[]).map((m) => (
              <Button
                key={m}
                onClick={() => setMode(m)}
                variant={mode === m ? "primary" : "outline"}
                color="error"
              >
                {SMS_MODE_LABEL[m]}
              </Button>
            ))}
          </div>
          <p className="font-p2-regular text-gray-500">
            {mode === "TEXT"
              ? "متن زیر مستقیماً به‌صورت پیامک عادی ارسال می‌شود."
              : "از الگوی تأییدشده در پنل ملی پیامک (متد SendByBaseNumber2) ارسال می‌شود؛ اگر ملی پیامک آن را نپذیرد، متن زیر ارسال می‌شود."}
          </p>
        </div>

        {variables.length > 0 && (
          <div className="flex flex-col gap-2">
            <p className="font-p2-medium">افزودن متغیر (در لحظه ارسال با مقدار واقعی جایگزین می‌شود)</p>
            <div className="flex flex-wrap gap-2">
              {variables.map((variable) => (
                <Button key={variable} onClick={() => insertVariable(variable)} variant="outline" color="error">
                  <span dir="ltr">{`{${variable}}`}</span>
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
          <p className={tooLong ? "font-p2-regular text-error-500 self-start" : "font-p2-regular text-gray-500 self-start"}>
            {`${body.length}/${MAX_LENGTH}`}
          </p>
        </div>

        {unknown.length > 0 && (
          <p className="font-p2-regular text-error-500">
            {`متغیر${unknown.length > 1 ? "های" : ""} ${unknown.map((n) => `{${n}}`).join("، ")} برای این محل ارسال تعریف نشده است.`}
          </p>
        )}

        <div className="flex flex-col gap-2">
          <p className="font-p2-medium">پیش‌نمایش</p>
          <p className="p-3 rounded-lg border border-gray-200 font-p1-regular whitespace-pre-wrap">
            {renderSmsTemplate(body, SMS_VARIABLE_SAMPLE) || "—"}
          </p>
        </div>

        {mode === "PATTERN" && (
          <div className="flex flex-col gap-3 rounded-lg border border-gray-200 p-3">
            <p className="font-p2-medium">الگوی ملی پیامک</p>
            <Input
              labelContent="شناسه الگو (bodyId)"
              type="text"
              inputMode="numeric"
              dir="ltr"
              value={patternBodyId}
              onChange={(e) => setPatternBodyId(e.target.value)}
              placeholder="مثلاً 552182"
            />
            {patternInvalid && <p className="font-p2-regular text-error-500">شناسه الگو باید فقط عدد باشد.</p>}

            {patternVariables.length === 0 && (
              <p className={textSlots.length ? "font-p2-regular text-gray-500" : "font-p2-regular text-error-500"}>
                {textSlots.length
                  ? `ترتیب متغیرها تعیین نشده؛ از ترتیب متن بالا استفاده می‌شود: ${textSlots
                      .map((n, i) => `{${i}} = {${n}}`)
                      .join(" ، ")}. اگر ترتیب الگوی شما فرق دارد، پایین‌تر خودتان تعیین کنید.`
                  : "هیچ متغیری انتخاب نشده است. اگر الگوی شما جای خالی ({0}) دارد، متغیرها را اضافه کنید؛ وگرنه ملی پیامک به‌جای مقدار، عنوان همان جای خالی را چاپ می‌کند."}
              </p>
            )}

            <p className="font-p2-medium">ترتیب متغیرها در الگو ({"{0};{1};…"}) — مطابق متن الگو در پنل</p>
            <div className="flex flex-wrap gap-2">
              {variables.map((variable) => (
                <Button
                  key={variable}
                  onClick={() => setPatternVariables((previous) => [...previous, variable])}
                  variant="outline"
                  color="error"
                >
                  <span dir="ltr">{`+ {${variable}}`}</span>
                </Button>
              ))}
            </div>
            {patternVariables.map((variable, index) => (
              <div key={`${variable}-${index}`} className="flex items-center gap-2">
                <span className="font-p2-regular w-10 text-gray-500" dir="ltr">{`{${index}}`}</span>
                <span className="font-p1-regular flex-1">{`{${variable}}`}</span>
                <Button variant="text" onClick={() => moveSlot(index, -1)} disabled={index === 0}>
                  <ArrowUp size={16} />
                </Button>
                <Button
                  variant="text"
                  onClick={() => moveSlot(index, 1)}
                  disabled={index === patternVariables.length - 1}
                >
                  <ArrowDown size={16} />
                </Button>
                <Button
                  variant="text"
                  onClick={() => setPatternVariables((previous) => previous.filter((_, i) => i !== index))}
                >
                  <X size={16} />
                </Button>
              </div>
            ))}
          </div>
        )}

        <Switch label="ارسال این پیامک فعال باشد" checked={isActive} onChange={(checked: boolean) => setIsActive(checked)} />

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
              ? "متن فعلی (حتی ذخیره‌نشده) با مقادیر نمونه فقط به شماره‌های مدیران در تنظیمات ارسال می‌شود، نه به کاربر."
              : "برای ارسال آزمایشی، ابتدا در «تنظیمات» شماره ادمین ثبت کنید."}
          </p>
        </div>

        <Button
          onClick={handleSave}
          isLoading={isCreating || isUpdating}
          disabled={isCreating || isUpdating || !canSave}
          variant="primary"
          color="error"
        >
          {isEdit ? "ذخیره" : "افزودن پیامک"}
        </Button>

        {isEdit && (
          <div className="flex flex-col gap-2">
            {confirmingDelete ? (
              <div className="flex gap-2">
                <Button onClick={handleDelete} isLoading={isDeleting} disabled={isDeleting} variant="primary" color="error">
                  بله، حذف شود
                </Button>
                <Button onClick={() => setConfirmingDelete(false)} variant="outline" color="error">
                  انصراف
                </Button>
              </div>
            ) : (
              <Button onClick={() => setConfirmingDelete(true)} variant="outline" color="error" rightIcon={<Trash2 />}>
                حذف این پیامک
              </Button>
            )}
            <p className="font-p2-regular text-gray-500">
              با حذف پیامک، دیگر در این مرحله ارسال نمی‌شود. اگر فقط می‌خواهید موقتاً متوقف شود، آن را غیرفعال کنید.
            </p>
          </div>
        )}
      </div>
    </Drawer>
  );
};

export default SmsRuleDrawer;
