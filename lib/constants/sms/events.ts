import type { SmsMode, SmsRecipient } from "@/lib/services/admin/type";

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
};
