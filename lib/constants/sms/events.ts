import { ESmsEvent } from "@/lib/services/admin/type";

/**
 * Panel copy for each automated-SMS event. The description says exactly when the
 * message fires, so an admin editing the text knows what the recipient just did.
 */
export const SMS_EVENT: Record<
  ESmsEvent,
  { label: string; description: string }
> = {
  [ESmsEvent.FORM_SUBMITTED]: {
    label: "ثبت فرم",
    description: "پس از تکمیل و ارسال فرم ثبت‌نام توسط هنرمند ارسال می‌شود.",
  },
  [ESmsEvent.NEED_REVISION]: {
    label: "نیاز به اصلاح",
    description:
      "زمانی که وضعیت درخواست به «نیاز به اصلاح» تغییر می‌کند ارسال می‌شود.",
  },
  [ESmsEvent.APPROVED]: {
    label: "تایید و انتشار",
    description: "زمانی که درخواست تایید و منتشر می‌شود ارسال می‌شود.",
  },
  [ESmsEvent.REJECTED]: {
    label: "رد درخواست",
    description: "زمانی که درخواست رد می‌شود ارسال می‌شود.",
  },
  [ESmsEvent.PAYMENT_SUCCESS]: {
    label: "پرداخت موفق",
    description: "پس از پرداخت موفق هزینه ثبت‌نام ارسال می‌شود.",
  },
  [ESmsEvent.PAYMENT_FAILED]: {
    label: "پرداخت ناموفق",
    description: "پس از پرداخت ناموفق یا لغو شده ارسال می‌شود.",
  },
};

/** Pipeline order — the list reads top to bottom as the applicant's journey. */
export const SMS_EVENT_ORDER: ESmsEvent[] = [
  ESmsEvent.FORM_SUBMITTED,
  ESmsEvent.PAYMENT_SUCCESS,
  ESmsEvent.PAYMENT_FAILED,
  ESmsEvent.NEED_REVISION,
  ESmsEvent.APPROVED,
  ESmsEvent.REJECTED,
];

/** Sample values used only for the drawer preview; never sent. */
export const SMS_VARIABLE_SAMPLE: Record<string, string> = {
  firstName: "علی",
  lastName: "رضایی",
  fullName: "علی رضایی",
  categoryName: "بازیگر",
  reason: "تصویر پروفایل کیفیت کافی ندارد",
  amount: "۵۰۰٬۰۰۰ تومان",
  trackingCode: "۱۲۳۴۵۶",
};
