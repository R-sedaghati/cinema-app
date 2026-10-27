import { normalizeFa } from "../utils/normalizeFa.ts";

export type SearchPage = { title: string; href: string; keywords: string[] };

// ponytail: static list matched client-side; move to the backend only if admins need to edit it.
export const SEARCH_PAGES: SearchPage[] = [
  { title: "ثبت رزومه", href: "/artist-registration", keywords: ["ثبت نام", "ثبت‌نام", "فرم", "رزومه", "عضویت"] },
  { title: "هنرمندان", href: "/artists", keywords: ["بازیگر", "جستجو", "هنرمند"] },
  { title: "آموزش‌ها", href: "/tutorials", keywords: ["آموزش", "ویدیو", "راهنما"] },
  { title: "سوالات متداول", href: "/faq", keywords: ["سوال", "پرسش", "faq"] },
  { title: "پشتیبانی", href: "/support", keywords: ["تیکت", "تماس", "پشتیبانی"] },
  { title: "درباره ما", href: "/about", keywords: ["درباره", "ما"] },
  { title: "قوانین و حریم خصوصی", href: "/terms", keywords: ["قوانین", "حریم خصوصی", "شرایط"] },
  { title: "دانلود اپلیکیشن", href: "/download", keywords: ["دانلود", "اپ", "اندروید", "app"] },
];

export const matchPages = (query: string): SearchPage[] => {
  const q = normalizeFa(query).toLowerCase();
  if (q.length < 2) return [];

  return SEARCH_PAGES.filter((page) =>
    [page.title, ...page.keywords].some((text) =>
      normalizeFa(text).toLowerCase().includes(q),
    ),
  );
};
