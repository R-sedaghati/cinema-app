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
  [ESmsEvent.SUPPORT_REPLY]: {
    label: "پاسخ تیکت پشتیبانی",
    description: "زمانی که ادمین به تیکت پشتیبانی کاربر پاسخ می‌دهد ارسال می‌شود.",
  },
  [ESmsEvent.RESUME_REQUEST_APPROVED]: {
    label: "تایید درخواست مشاهده رزومه",
    description: "زمانی که ادمین درخواست مشاهده رزومه یک هنرمند را تایید می‌کند، برای درخواست‌دهنده ارسال می‌شود.",
  },
  [ESmsEvent.ADMIN_REGISTRATION]: {
    label: "اعلان ادمین: ثبت‌نام جدید",
    description:
      "به شماره‌های ادمین (تنظیمات اطلاع‌رسانی) هنگام ثبت یا پرداخت ثبت‌نام هنرمند ارسال می‌شود. متن پیش‌فرض {message} همان جمله‌ی ساخته‌شده توسط سیستم است.",
  },
  [ESmsEvent.ADMIN_TRANSACTION]: {
    label: "اعلان ادمین: تراکنش",
    description:
      "به شماره‌های ادمین هنگام تکمیل پرداخت ارسال می‌شود. متن پیش‌فرض {message} همان جمله‌ی ساخته‌شده توسط سیستم است.",
  },
  [ESmsEvent.ADMIN_SUPPORT_TICKET]: {
    label: "اعلان ادمین: تیکت جدید",
    description:
      "به شماره‌های ادمین هنگام ثبت تیکت پشتیبانی ارسال می‌شود. متن پیش‌فرض {message} همان جمله‌ی ساخته‌شده توسط سیستم است.",
  },
  [ESmsEvent.ADMIN_RESUME_REQUEST]: {
    label: "اعلان ادمین: درخواست رزومه",
    description:
      "به شماره‌های ادمین هنگام ثبت درخواست مشاهده رزومه ارسال می‌شود. متن پیش‌فرض {message} همان جمله‌ی ساخته‌شده توسط سیستم است.",
  },
  [ESmsEvent.CRM_NOTE]: {
    label: "پیامک یادداشت CRM",
    description:
      "وقتی ادمین در یادداشت‌های CRM کانال «پیامک» را انتخاب می‌کند برای هنرمند ارسال می‌شود. {message} متنی است که ادمین نوشته؛ متن پیش‌فرض عیناً همان را می‌فرستد. (اگر این قالب غیرفعال باشد، همان متن نوشته‌شده ارسال می‌شود.)",
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
  ESmsEvent.SUPPORT_REPLY,
  ESmsEvent.RESUME_REQUEST_APPROVED,
  ESmsEvent.ADMIN_REGISTRATION,
  ESmsEvent.ADMIN_TRANSACTION,
  ESmsEvent.ADMIN_SUPPORT_TICKET,
  ESmsEvent.ADMIN_RESUME_REQUEST,
  ESmsEvent.CRM_NOTE,
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
  nextStep: "درخواست شما در حال بررسی است.",
  subject: "مشکل در پرداخت",
  ticketId: "۴۲",
  artistCode: "۱۰۲۳",
  message: "ثبت‌نام هنرمند (#۱۲۳) پرداخت شد و در انتظار بررسی است.",
  link: "/admin/artist-registration/123",
};
