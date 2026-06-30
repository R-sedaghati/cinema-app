export type Gender = "زن" | "مرد" | "سایر";

export type ArtistCategory =
  | "بازیگری"
  | "کارگردانی"
  | "تصویر بردار"
  | "صدابردار"
  | "صحنه و لباس"
  | "گریم"
  | "مجریگری"
  | "خوانندگی"
  | "دوبلوری"
  | "خبرنگاری"
  | "تهیه کنندگی"
  | "هنرجو"
  | "پشتیبانی";

export type ArtistWork = {
  id: string;
  title: string;
  year?: number;
};

export type Artist = {
  id: string;
  fullName: string;
  category: ArtistCategory;
  gender: Gender;
  city: string;
  about: string;
  skills: string[];
  photoWorks: ArtistWork[];
  videoWorks: ArtistWork[];
};

export interface CategoryItem {
  title: string;
  image: string;
  id: number;
}

export const artistCategories: CategoryItem[] = [
  { title: "خوانندگی", image: "./cat-8.svg", id: 1 },
  { title: "بازیگری", image: "./cat-13.svg", id: 2 },
  { title: "کارگردانی", image: "./cat-4.svg", id: 3 },
  { title: "تصویربرداری", image: "./cat-11.svg", id: 4 },
  { title: "صدابرداری", image: "./cat-5.svg", id: 5 },
  { title: "گریم", image: "./cat-3.svg", id: 6 },
  { title: "مجری‌گری", image: "./cat-2.svg", id: 7 },
  { title: "دوبلوری", image: "./cat-7.svg", id: 8 },
  { title: "صحنه و لباس", image: "./cat-6.svg", id: 9 },
  { title: "پشتیبانی", image: "./cat-12.svg", id: 10 },
  { title: "تهیه‌کنندگی", image: "./cat-10.svg", id: 11 },
  { title: "خبرنگاری", image: "./cat-9.svg", id: 12 },
  { title: "اجاره لوکیشن", image: "./cat-1.svg", id: 13 },
  { title: "تجهیزات و ملزومات", image: "./cat-1.svg", id: 14 },
  { title: "اجاره خودرو", image: "./cat-1.svg", id: 15 },
  { title: "مدلینگ", image: "./cat-1.svg", id: 109 },
];

export const artistsMock: Artist[] = [
  {
    id: "a1",
    fullName: "مهسا رضایی",
    category: "بازیگری",
    gender: "زن",
    city: "تهران",
    about:
      "مهسا رضایی بازیگر سینما و تئاتر با تمرکز روی نقش‌های درام و اجتماعی. تجربه همکاری در پروژه‌های کوتاه و بلند و علاقه‌مند به نقش‌های چالشی.",
    skills: ["بداهه‌پردازی", "فن بیان", "لهجه", "بازی جلوی دوربین"],
    photoWorks: [
      { id: "p1", title: "استیل‌های پشت صحنه", year: 1402 },
      { id: "p2", title: "عکاسی پرتره سینمایی", year: 1401 },
      { id: "p3", title: "سکانس‌های منتخب (استوری‌بورد)", year: 1403 },
    ],
    videoWorks: [
      { id: "v1", title: "شوریل بازیگری ۱", year: 1403 },
      { id: "v2", title: "سکانس منتخب (درام)", year: 1402 },
      { id: "v3", title: "تست بازیگری", year: 1401 },
    ],
  },
  {
    id: "a2",
    fullName: "آرمان کاظمی",
    category: "کارگردانی",
    gender: "مرد",
    city: "اصفهان",
    about:
      "کارگردان و نویسنده با علاقه به روایت‌های مینیمال و سینمای مستقل. تجربه ساخت فیلم کوتاه، تیزر و پروژه‌های تبلیغاتی.",
    skills: ["کارگردانی", "فیلم‌نامه‌نویسی", "استوری‌بورد", "کار با بازیگر"],
    photoWorks: [
      { id: "p1", title: "استوری‌بورد پروژه کوتاه", year: 1402 },
      { id: "p2", title: "عکس‌های لوکیشن", year: 1401 },
    ],
    videoWorks: [
      { id: "v1", title: "فیلم کوتاه: یک قاب", year: 1401 },
      { id: "v2", title: "تیزر تبلیغاتی", year: 1402 },
    ],
  },
  {
    id: "a3",
    fullName: "نیما شریفی",
    category: "تصویر بردار",
    gender: "مرد",
    city: "شیراز",
    about:
      "فیلم‌بردار با تجربه نورپردازی و تصویربرداری پروژه‌های داستانی و مستند. حساس به جزئیات نور و حرکت دوربین.",
    skills: ["نورپردازی", "حرکت دوربین", "رنگ", "لنز و قاب‌بندی"],
    photoWorks: [
      { id: "p1", title: "فریم‌های منتخب پروژه مستند", year: 1400 },
      { id: "p2", title: "پروژه داستانی - قاب‌های شب", year: 1402 },
    ],
    videoWorks: [
      { id: "v1", title: "ریِل تصویربرداری", year: 1403 },
      { id: "v2", title: "پروژه مستند: شهر", year: 1400 },
    ],
  },
  {
    id: "a4",
    fullName: "لیلا صادقی",
    category: "تهیه کنندگی",
    gender: "زن",
    city: "مشهد",
    about:
      "تدوین‌گر با تمرکز روی ریتم، احساس و روایت. تجربه تدوین ویدیوهای داستانی، مصاحبه و پشت‌صحنه.",
    skills: ["تدوین", "کالرسازی پایه", "طراحی ریتم", "صداگذاری اولیه"],
    photoWorks: [
      { id: "p1", title: "قبل/بعد تدوین", year: 1402 },
      { id: "p2", title: "چارت روایت (نمونه)", year: 1401 },
    ],
    videoWorks: [
      { id: "v1", title: "نمونه تدوین مصاحبه", year: 1402 },
      { id: "v2", title: "نمونه تدوین داستانی", year: 1403 },
    ],
  },
  {
    id: "a5",
    fullName: "سارا نادری",
    category: "صدابردار",
    gender: "زن",
    city: "کرج",
    about:
      "صدابردار صحنه و تدوین صدای پایه با تجربه پروژه‌های کوتاه. علاقه‌مند به کیفیت ضبط، کاهش نویز و ثبت جزئیات صدا.",
    skills: ["صدابرداری صحنه", "کاهش نویز", "سینک صدا", "میکس ساده"],
    photoWorks: [
      { id: "p1", title: "پشت صحنه ضبط صدا", year: 1401 },
      { id: "p2", title: "چیدمان میکروفن‌ها", year: 1402 },
    ],
    videoWorks: [
      { id: "v1", title: "نمونه صدای صحنه", year: 1402 },
      { id: "v2", title: "قبل/بعد کاهش نویز", year: 1403 },
    ],
  },
  {
    id: "a6",
    fullName: "کیان موسوی",
    category: "خبرنگاری",
    gender: "مرد",
    city: "تبریز",
    about:
      "طراح صحنه و دستیار هنری با تجربه طراحی و اجرای لوکیشن‌های داخلی. علاقه‌مند به فضاسازی با جزئیات و رنگ.",
    skills: ["طراحی صحنه", "پالت رنگ", "هماهنگی اجرا", "چیدمان"],
    photoWorks: [
      { id: "p1", title: "اسکچ‌های طراحی صحنه", year: 1401 },
      { id: "p2", title: "مودبرد پروژه", year: 1402 },
      { id: "p3", title: "قبل/بعد اجرای دکور", year: 1403 },
    ],
    videoWorks: [
      { id: "v1", title: "تور لوکیشن (نمونه)", year: 1403 },
      { id: "v2", title: "پشت صحنه دکور", year: 1402 },
    ],
  },
];

export const citiesMock = Array.from(new Set(artistsMock.map((a) => a.city)));
