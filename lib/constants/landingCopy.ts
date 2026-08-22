/**
 * Every fixed string of the public site that the admin may rewrite, with its
 * default Persian text, the label shown in the panel, and the panel group it
 * belongs to.
 *
 * Overrides live in `SiteContent.landing` and are resolved by `useLandingCopy`
 * (`lib/hooks/useLandingCopy.ts`). Adding a new editable string = adding a key
 * here. `{name}` placeholders are substituted at call time.
 *
 * Counts are fixed on purpose: the four statistics and the three "why" cards
 * have images/positions bound to their order, exactly like the about-page
 * benefit cards.
 */
export const LANDING_COPY = {
  // --- صفحه معرفی: هدر اصلی ---
  heroTitle: {
    group: "صفحه معرفی — سربرگ",
    admin: "عنوان اصلی (خط دوم با Enter)",
    value: "استعداد ها رو یکجا ببین٬\nدرست انتخاب کن",
  },
  heroSubtitle: {
    group: "صفحه معرفی — سربرگ",
    admin: "زیرعنوان",
    value: "از ثبت رزومه تا دیده شدن و دریافت درخواست همکاری٬ همه در سینما آرشیو",
  },
  heroPrimaryCta: {
    group: "صفحه معرفی — سربرگ",
    admin: "دکمه ورود/ثبت‌نام",
    value: "ورود / ثبت نام هنرمند",
  },
  heroSecondaryCta: {
    group: "صفحه معرفی — سربرگ",
    admin: "دکمه مشاهده هنرمندان",
    value: "مشاهده هنرمندان",
  },

  // --- صفحه معرفی: آمار ---
  statsTitle: {
    group: "صفحه معرفی — آمار",
    admin: "عنوان بخش آمار",
    value: "شفاف، قابل‌اعتماد، قابل‌پیگیری",
  },
  statsSubtitle: {
    group: "صفحه معرفی — آمار",
    admin: "توضیح بخش آمار",
    value:
      "پروفایل‌های استاندارد، جستجوی دقیق و مسیر ارتباط کنترل‌شده؛ همه‌چیز برای انتخاب بهتر و سریع‌تر آماده است.",
  },
  statsCta: { group: "صفحه معرفی — آمار", admin: "دکمه بخش آمار", value: "مشاهده هنرمندان" },
  stat1Value: { group: "صفحه معرفی — آمار", admin: "عدد آمار ۱", value: "۹۰٪" },
  stat1Label: { group: "صفحه معرفی — آمار", admin: "عنوان آمار ۱", value: "رضایت هنرمندها" },
  stat2Value: { group: "صفحه معرفی — آمار", admin: "عدد آمار ۲", value: "۲۰۰۰+" },
  stat2Label: { group: "صفحه معرفی — آمار", admin: "عنوان آمار ۲", value: "پروفایل کاربری فعال" },
  stat3Value: { group: "صفحه معرفی — آمار", admin: "عدد آمار ۳", value: "۳۵٪" },
  stat3Label: { group: "صفحه معرفی — آمار", admin: "عنوان آمار ۳", value: "کاریابی هنرمندها" },
  stat4Value: { group: "صفحه معرفی — آمار", admin: "عدد آمار ۴", value: "۵+" },
  stat4Label: { group: "صفحه معرفی — آمار", admin: "عنوان آمار ۴", value: "سال تجربه کاری" },

  // --- صفحه معرفی: باکس ثبت‌نام ---
  promoTitle: {
    group: "صفحه معرفی — باکس ثبت‌نام",
    admin: "عنوان باکس",
    value: "اگر عاشق یکی از شاخه‌های هنری هستی،",
  },
  promoSubtitle: {
    group: "صفحه معرفی — باکس ثبت‌نام",
    admin: "زیرعنوان باکس",
    value: "فرم رو پر کن و شانست رو برای ورود به دنیای حرفه‌ای هنر امتحان کن.",
  },
  promoCta: { group: "صفحه معرفی — باکس ثبت‌نام", admin: "دکمه باکس", value: "ثبت‌ نام هنرمند" },

  // --- صفحه معرفی: چرا سینما آرشیو ---
  reasonsTitle: {
    group: "صفحه معرفی — چرا سینما آرشیو",
    admin: "عنوان بخش",
    value: "چرا سینما آرشیو؟",
  },
  reason1Title: {
    group: "صفحه معرفی — چرا سینما آرشیو",
    admin: "عنوان کارت ۱",
    value: "پروفایل استاندارد",
  },
  reason1Detail: {
    group: "صفحه معرفی — چرا سینما آرشیو",
    admin: "متن کارت ۱",
    value:
      "اطلاعات رزومه و نمونه‌کارها در یک قالب مشخص ثبت می‌شود تا مقایسه و تصمیم‌گیری راحت‌تر و دقیق‌تر باشد.",
  },
  reason2Title: {
    group: "صفحه معرفی — چرا سینما آرشیو",
    admin: "عنوان کارت ۲",
    value: "جستجو و فیلتر حرفه‌ای",
  },
  reason2Detail: {
    group: "صفحه معرفی — چرا سینما آرشیو",
    admin: "متن کارت ۲",
    value:
      "با فیلترهای دقیق و مرتب‌سازی هوشمند، سریع‌تر به گزینه‌های مناسب پروژه‌ات می‌رسی.",
  },
  reason3Title: {
    group: "صفحه معرفی — چرا سینما آرشیو",
    admin: "عنوان کارت ۳",
    value: "ارتباط امن با تایید درخواست",
  },
  reason3Detail: {
    group: "صفحه معرفی — چرا سینما آرشیو",
    admin: "متن کارت ۳",
    value:
      "ارتباط‌ها فقط از مسیر درخواست و تایید انجام می‌شود تا حریم خصوصی حفظ و از مزاحمت/اسپم جلوگیری شود.",
  },

  // --- صفحه اول اپلیکیشن ---
  homeSearchPlaceholder: {
    group: "صفحه اول",
    admin: "متن راهنمای کادر جستجو",
    value: "جستجوی هنرمندان، دسته‌بندی‌ها...",
  },
  homeExploreKicker: { group: "صفحه اول", admin: "برچسب بالای عنوان", value: "کاوش" },
  homeExploreTitle: {
    group: "صفحه اول",
    admin: "عنوان صفحه اول",
    value: "هنرمندان سینما را کشف کنید",
  },
  homeAllLabel: { group: "صفحه اول", admin: "برچسب «همه» در فیلترها", value: "همه" },
  homeRegistrationTitle: { group: "صفحه اول", admin: "عنوان بخش ثبت‌نام", value: "ثبت‌نام هنرمند" },
  homeRegistrationCta: { group: "صفحه اول", admin: "لینک بخش ثبت‌نام", value: "شروع" },
  homeArtistsTitle: { group: "صفحه اول", admin: "عنوان بخش هنرمندان", value: "هنرمندان" },
  homeArtistsCta: { group: "صفحه اول", admin: "لینک بخش هنرمندان", value: "همه" },
  homeSupportTitle: { group: "صفحه اول", admin: "عنوان بخش پشتیبانی", value: "پشتیبانی" },
  homeSupportSubtitle: {
    group: "صفحه اول",
    admin: "توضیح بخش پشتیبانی",
    value: "با تیم ما در ارتباط باشید",
  },
  homeTutorialsTitle: { group: "صفحه اول", admin: "عنوان بخش آموزش", value: "راهنمای ویدیویی" },
  homeTutorialsSubtitle: {
    group: "صفحه اول",
    admin: "توضیح بخش آموزش",
    value: "آموزش استفاده از اپلیکیشن",
  },
  homeFaqTitle: { group: "صفحه اول", admin: "عنوان بخش سوالات", value: "سوالات متداول" },
  homeFaqSubtitle: {
    group: "صفحه اول",
    admin: "توضیح بخش سوالات",
    value: "پاسخ سوالات خود را پیدا کنید",
  },
  homeEmptyArtists: { group: "صفحه اول", admin: "متن نبودن هنرمند", value: "هنرمندی یافت نشد" },

  // --- صفحه جستجوی هنرمندان ---
  artistsTitle: {
    group: "صفحه جستجوی هنرمندان",
    admin: "عنوان صفحه",
    value: "هنرمند مورد نظرت رو پیدا کن",
  },
  artistsSubtitle: {
    group: "صفحه جستجوی هنرمندان",
    admin: "زیرعنوان صفحه",
    value: "دسته بندی رو سرچ کن یا انتخاب کن",
  },
  artistsSearchPlaceholder: {
    group: "صفحه جستجوی هنرمندان",
    admin: "متن راهنمای کادر جستجو",
    value: "مثلاً: کارگردان، تهران...",
  },
  artistsLoadMore: { group: "صفحه جستجوی هنرمندان", admin: "دکمه نمایش بیشتر", value: "نمایش بیشتر" },
  artistsLoading: { group: "صفحه جستجوی هنرمندان", admin: "متن در حال بارگذاری", value: "در حال بارگذاری..." },

  // --- عنوان صفحات ---
  aboutPageTitle: { group: "عنوان صفحات", admin: "عنوان صفحه درباره ما", value: "درباره آرشیو هنر" },
  faqPageTitle: { group: "عنوان صفحات", admin: "عنوان صفحه سوالات متداول", value: "سوالات متداول" },
} as const;

export type LandingCopyKey = keyof typeof LANDING_COPY;

/** Panel groups in display order, derived from the registry itself. */
export const LANDING_COPY_GROUPS = [
  ...new Set(Object.values(LANDING_COPY).map((entry) => entry.group)),
];
