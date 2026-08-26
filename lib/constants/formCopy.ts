/**
 * Every fixed string of the artist-registration flow, with its default Persian
 * text and the label the admin sees for it in the form builder.
 *
 * `value` is the default; an admin can override any key site-wide from the
 * content-management panel (stored in `SiteContent.form`, resolved by
 * `useFormCopy` in `lib/hooks/useFormCopy.ts`). Adding a new editable string =
 * adding a key here. `{name}` placeholders are substituted by `makeCopy`.
 */
export const FORM_COPY = {
  backHome: { admin: "لینک بازگشت به صفحه اصلی", value: "بازگشت به صفحه اصلی" },
  categoryPrompt: {
    admin: "متن انتخاب زمینه فعالیت",
    value: "لطفاً زمینه فعالیت خود را مشخص نمایید:",
  },
  categoryStepTitle: { admin: "عنوان مرحله زمینه فعالیت", value: "زمینه فعالیت" },
  alreadyRegistered: {
    admin: "برچسب دسته‌بندی ثبت‌شده",
    value: "قبلاً ثبت‌نام کرده‌اید",
  },
  duplicateErrorToast: {
    admin: "پیام خطای فرم تکراری",
    value: "شما قبلاً در این دسته‌بندی فرم ثبت کرده‌اید.",
  },
  formTitle: { admin: "عنوان فرم ({category})", value: "فرم حوزه {category}" },
  stepCounter: { admin: "شمارنده مرحله ({n} و {total})", value: "مرحله {n} از {total}" },
  finalStepLabel: { admin: "زیرعنوان مرحله پایانی", value: "مرحله پایانی" },
  paymentStepTitle: { admin: "عنوان مرحله پرداخت", value: "پرداخت" },

  nextLabel: { admin: "دکمه مرحله بعد", value: "مرحله بعد" },
  prevLabel: { admin: "دکمه مرحله قبل", value: "مرحله قبل" },

  reviewTitle: { admin: "عنوان صفحه بازبینی (ویرایش)", value: "بررسی و ثبت تغییرات فرم" },
  booleanYes: { admin: "نمایش مقدار بله", value: "بله" },
  booleanNo: { admin: "نمایش مقدار خیر", value: "خیر" },
  emptyValue: { admin: "نمایش مقدار خالی", value: "-" },

  paymentTitle: {
    admin: "عنوان باکس پرداخت",
    value: "هزینه پرداخت ثبت‌نام نهایی در سایت آرشیو هنر",
  },
  paymentNote: {
    admin: "توضیح باکس پرداخت",
    value: "هزینه یکبار برای همیشه در این دسته بندی میباشد",
  },
  amountLabel: { admin: "برچسب مبلغ", value: "مبلغ قابل پرداخت" },
  currency: { admin: "واحد پول", value: "تومان" },
  labelFree: { admin: "نمایش رایگان", value: "رایگان" },
  paymentFreeTitle: {
    admin: "عنوان باکس رایگان",
    value: "ثبت‌نام در این دسته‌بندی رایگان است",
  },
  submitLabel: { admin: "دکمه پرداخت نهایی", value: "پرداخت و ثبت‌نام نهایی" },
  freeSubmitLabel: { admin: "دکمه ثبت (رایگان)", value: "ادامه" },
  editSubmitLabel: { admin: "دکمه ثبت تغییرات", value: "ثبت تغییرات" },
  editSuccessToast: { admin: "پیام موفقیت ویرایش", value: "فرم با موفقیت ویرایش شد" },
  editErrorToast: { admin: "پیام خطای ویرایش", value: "خطا در ویرایش فرم" },

  successCta: { admin: "دکمه صفحه پرداخت موفق", value: "مشاهده پروفایل" },
  failCta: { admin: "دکمه صفحه پرداخت ناموفق", value: "تلاش دوباره" },
  homeCta: { admin: "دکمه صفحه اصلی (نتیجه پرداخت)", value: "صفحه اصلی" },

  requiredMessage: { admin: "خطای فیلد الزامی ({label})", value: "{label} الزامی است" },
  minMessage: { admin: "خطای حداقل مقدار ({label}, {min})", value: "{label} باید حداقل {min} باشد" },
  maxMessage: { admin: "خطای حداکثر مقدار ({label}, {max})", value: "{label} باید حداکثر {max} باشد" },
  minLengthMessage: {
    admin: "خطای حداقل طول ({label}, {n})",
    value: "{label} باید حداقل {n} کاراکتر باشد",
  },
  maxLengthMessage: {
    admin: "خطای حداکثر طول ({label}, {n})",
    value: "{label} باید حداکثر {n} کاراکتر باشد",
  },
  invalidMessage: { admin: "خطای مقدار نامعتبر ({label})", value: "{label} نامعتبر است" },
} as const;

export type FormCopyKey = keyof typeof FORM_COPY;
