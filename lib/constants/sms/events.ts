import {
  ESmsEvent,
  type SmsMode,
  type SmsRecipient,
  type SmsSource,
} from "@/lib/services/admin/type";

/** The record each group of pickable fields belongs to, in the order the picker lists them. */
export const SMS_SOURCE_LABEL: Record<SmsSource, string> = {
  form: "فرم ثبت‌نام هنرمند (پاسخ‌ها)",
  request: "درخواست هنرمند",
  profile: "پروفایل کاربر",
  user: "حساب کاربر",
  ticket: "تیکت پشتیبانی",
  contact: "درخواست مشاهده رزومه",
  contactForm: "فرم درخواست رزومه (پاسخ‌ها)",
  artist: "هنرمندِ مورد درخواست",
  payment: "پرداخت",
};

export const SMS_RECIPIENT_LABEL: Record<SmsRecipient, string> = {
  APPLICANT: "شخص مربوط (کاربر/هنرمند)",
  ADMINS: "شماره‌های مدیران (تنظیمات)",
  CUSTOM: "شماره‌های دلخواه",
};

export const SMS_RECIPIENT_SHORT: Record<SmsRecipient, string> = {
  APPLICANT: "کاربر",
  ADMINS: "مدیران",
  CUSTOM: "دلخواه",
};

export const SMS_MODE_LABEL: Record<SmsMode, string> = {
  TEXT: "متن آزاد",
  PATTERN: "الگوی ملی پیامک",
};
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
  [ESmsEvent.SUBSCRIPTION_REMINDER]: {
    label: "یادآوری تمدید اشتراک",
    description:
      "۳۰، ۷ و ۳ روز پیش از پایان اشتراک سالانه برای هنرمند ارسال می‌شود (بین ساعت ۱۰ تا ۲۰). {daysLeft} تعداد روزهای باقی‌مانده و {expiresAt} تاریخ پایان است.",
  },
  [ESmsEvent.SUBSCRIPTION_EXPIRED]: {
    label: "پایان اشتراک",
    description:
      "روز پایان اشتراک سالانه برای هنرمند ارسال می‌شود (بین ساعت ۱۰ تا ۲۰). {expiresAt} تاریخ پایان است.",
  },
  [ESmsEvent.SUBSCRIPTION_EXPIRED_FOLLOWUP]: {
    label: "پیگیری پایان اشتراک",
    description:
      "یک هفته بعد از پایان اشتراک، اگر هنرمند تمدید نکرده باشد، ارسال می‌شود (بین ساعت ۱۰ تا ۲۰). {expiresAt} تاریخ پایان است.",
  },
  [ESmsEvent.ADMIN_REGISTRATION]: {
    label: "اعلان ادمین: ثبت‌نام جدید",
    description:
      "به شماره‌های ادمین (در صورت روشن بودن «ثبت‌نام هنرمند جدید» در تنظیمات) وقتی کاربر تازه‌ای بعد از ورود نام و نام خانوادگی‌اش را برای اولین بار تکمیل می‌کند ارسال می‌شود. {fullName} نام کاربر است؛ {message} جمله‌ی «کاربر جدید با نام … در سایت ثبت‌نام کرد».",
  },
  [ESmsEvent.ADMIN_FORM_SUBMITTED]: {
    label: "اعلان ادمین: ثبت فرم",
    description:
      "به شماره‌های ادمین هنگام ثبت فرم هنرمند و پرداخت ثبت‌نام ارسال می‌شود. متن پیش‌فرض {message} همان جمله‌ی ساخته‌شده توسط سیستم است؛ {fullName}، {phone} و {requestId} هم قابل استفاده‌اند.",
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
  ESmsEvent.SUBSCRIPTION_REMINDER,
  ESmsEvent.SUBSCRIPTION_EXPIRED,
  ESmsEvent.SUBSCRIPTION_EXPIRED_FOLLOWUP,
  ESmsEvent.ADMIN_FORM_SUBMITTED,
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
  phone: "09120000000",
  categoryName: "بازیگر",
  reason: "تصویر پروفایل کیفیت کافی ندارد",
  amount: "۵۰۰٬۰۰۰ تومان",
  trackingCode: "۱۲۳۴۵۶",
  nextStep: "درخواست شما در حال بررسی است.",
  subject: "مشکل در پرداخت",
  ticketId: "۴۲",
  artistCode: "۱۰۲۳",
  artistId: "123",
  requestId: "123",
  oldStatus: "در انتظار پرداخت",
  newStatus: "در انتظار تایید ادمین",
  statusChange: "در انتظار پرداخت,در انتظار تایید ادمین",
  message: "ثبت‌نام هنرمند (#۱۲۳) پرداخت شد و در انتظار بررسی است.",
  link: "/admin/artist-registration/123",
  daysLeft: "۷",
  expiresAt: "۱۴۰۶/۰۸/۱۱",
};
