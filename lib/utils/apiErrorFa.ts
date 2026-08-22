/**
 * Backend error strings are English; the panel is Persian-only.
 * Map what we know, and never let a Latin-alphabet message reach a toast.
 */

const GENERIC = "خطایی در ارتباط با سرور رخ داده است.";

const EXACT: Record<string, string> = {
  Unauthorized: "دسترسی شما منقضی شده است. دوباره وارد شوید.",
  Forbidden: "اجازه دسترسی به این بخش را ندارید.",
  "Not Found": "موردی با این مشخصات پیدا نشد.",
  "Internal Server Error": "خطای داخلی سرور. کمی بعد دوباره تلاش کنید.",
  "Network Error": "ارتباط با سرور برقرار نشد. اینترنت خود را بررسی کنید.",
  "Invalid credentials": "نام کاربری یا رمز عبور اشتباه است.",
};

// ponytail: substring stems, not a full i18n layer — backend messages are few and stable.
const STEMS: [RegExp, string][] = [
  [/should not be empty|is required|may not be blank/i, "پر کردن همه فیلدهای الزامی ضروری است."],
  [/must be (a )?(number|integer)/i, "مقدار عددی نامعتبر است."],
  [/must be (a )?(url|string)|invalid/i, "مقدار وارد شده معتبر نیست."],
  [/already exists|duplicate/i, "این مورد از قبل ثبت شده است."],
  [/too large|file size/i, "حجم فایل بیش از حد مجاز است."],
  [/timeout/i, "پاسخی از سرور دریافت نشد. دوباره تلاش کنید."],
  [/unauthor/i, "دسترسی شما منقضی شده است. دوباره وارد شوید."],
  [/not found/i, "موردی با این مشخصات پیدا نشد."],
];

export function apiErrorFa(raw?: string | null): string {
  if (!raw) return GENERIC;

  const message = raw.trim();

  if (EXACT[message]) return EXACT[message];

  for (const [pattern, fa] of STEMS) {
    if (pattern.test(message)) return fa;
  }

  // Persian text from the backend passes through; anything with Latin letters does not.
  return /[A-Za-z]/.test(message) ? GENERIC : message;
}
