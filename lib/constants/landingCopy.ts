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

  // --- سربرگ و منو ---
  brandName: { group: "سربرگ و منو", admin: "نام سایت", value: "آرشیو هنر" },
  navHome: { group: "سربرگ و منو", admin: "منو: خانه", value: "خانه" },
  navArtists: { group: "سربرگ و منو", admin: "منو: جستجوی هنرمندان", value: "جستجوی هنرمندان" },
  navForms: { group: "سربرگ و منو", admin: "منو: فرم‌های درخواست", value: "فرم‌های درخواست" },
  navSupport: { group: "سربرگ و منو", admin: "منو: پشتیبانی", value: "پشتیبانی" },
  navFaq: { group: "سربرگ و منو", admin: "منو: سوالات متداول", value: "سوالات متداول" },
  navAbout: { group: "سربرگ و منو", admin: "منو: درباره ما", value: "درباره ما" },
  navProfile: { group: "سربرگ و منو", admin: "دکمه پروفایل", value: "پروفایل" },
  navLogin: { group: "سربرگ و منو", admin: "دکمه ورود/ثبت‌نام", value: "ورود / ثبت‌نام کاربر" },
  navMobileSearch: { group: "سربرگ و منو", admin: "منوی پایین موبایل: جستجو", value: "جستجو" },
  navMobileForms: { group: "سربرگ و منو", admin: "منوی پایین موبایل: فرم‌ها", value: "فرم‌ها" },
  navMobileLogin: { group: "سربرگ و منو", admin: "منوی پایین موبایل: ورود", value: "ورود" },

  // --- پابرگ سایت ---
  footerPhoneLabel: { group: "پابرگ سایت", admin: "برچسب تلفن پشتیبانی", value: "تلفن پشتیبانی" },
  footerArtists: { group: "پابرگ سایت", admin: "لینک جستجوی هنرمندان", value: "جستجوی هنرمندان" },
  footerAbout: { group: "پابرگ سایت", admin: "لینک درباره ما", value: "درباره ما" },
  footerContact: { group: "پابرگ سایت", admin: "لینک تماس با ما", value: "تماس با ما" },
  footerFaq: { group: "پابرگ سایت", admin: "لینک سوالات متداول", value: "سوالات متداول" },
  footerSupport: { group: "پابرگ سایت", admin: "لینک پشتیبانی", value: "پشتیبانی" },
  footerTerms: { group: "پابرگ سایت", admin: "لینک قوانین و حریم خصوصی", value: "قوانین و حریم خصوصی" },
  footerAppDownload: { group: "پابرگ سایت", admin: "عنوان دریافت اپلیکیشن", value: "دریافت اپلیکیشن" },

  // --- ورود و ثبت‌نام کاربر ---
  loginTitle: { group: "ورود و ثبت‌نام", admin: "عنوان کشوی ورود", value: "ورود یا ثبت‌نام" },
  loginPhoneLabel: { group: "ورود و ثبت‌نام", admin: "برچسب شماره موبایل", value: "شماره موبایل را وارد کنید" },
  loginPhonePlaceholder: { group: "ورود و ثبت‌نام", admin: "راهنمای کادر شماره موبایل", value: "۰۹**  ***  ****" },
  loginPhoneError: { group: "ورود و ثبت‌نام", admin: "خطای شماره موبایل", value: "شماره موبایل اشتباه است." },
  loginPhoneCta: { group: "ورود و ثبت‌نام", admin: "دکمه دریافت کد", value: "دریافت کد" },
  loginOtpSent: { group: "ورود و ثبت‌نام", admin: "پیام ارسال کد", value: "کد ورود ارسال شد" },
  loginOtpPrefix: { group: "ورود و ثبت‌نام", admin: "متن قبل از شماره در مرحله کد", value: "کد پیامک شده به شماره" },
  loginOtpSuffix: { group: "ورود و ثبت‌نام", admin: "متن بعد از شماره در مرحله کد", value: "را وارد کنید." },
  loginOtpChangeNumber: { group: "ورود و ثبت‌نام", admin: "دکمه تغییر شماره", value: "تغییر شماره موبایل" },
  loginOtpResend: { group: "ورود و ثبت‌نام", admin: "دکمه ارسال مجدد کد", value: "ارسال مجدد کد" },
  loginOtpCountdown: { group: "ورود و ثبت‌نام", admin: "متن شمارش معکوس", value: "تا ارسال مجدد کد" },
  loginOtpSubmit: { group: "ورود و ثبت‌نام", admin: "دکمه ورود", value: "ورود" },
  loginOtpWrong: { group: "ورود و ثبت‌نام", admin: "خطای کد اشتباه", value: "کد وارد شده اشتباه است." },
  loginSuccess: { group: "ورود و ثبت‌نام", admin: "پیام ورود موفق", value: "با موفقیت وارد شدید" },
  loginTermsPrefix: { group: "ورود و ثبت‌نام", admin: "متن قوانین ـ بخش اول", value: "ورود شما به منزله پذیرش" },
  loginTermsLink: { group: "ورود و ثبت‌نام", admin: "متن لینک قوانین", value: "قوانین و مقررات" },
  loginTermsSuffix: { group: "ورود و ثبت‌نام", admin: "متن قوانین ـ بخش دوم", value: "می‌باشد" },
  completeProfileTitle: { group: "ورود و ثبت‌نام", admin: "عنوان تکمیل پروفایل", value: "تکمیل پروفایل" },
  completeProfileDesc: {
    group: "ورود و ثبت‌نام",
    admin: "توضیح تکمیل پروفایل",
    value: "برای استفاده کامل از سایت، لطفاً نام و نام خانوادگی خود را وارد کنید.",
  },
  completeProfileSuccess: { group: "ورود و ثبت‌نام", admin: "پیام تکمیل پروفایل", value: "پروفایل با موفقیت تکمیل شد" },

  // --- فیلدهای مشترک ---
  fieldFirstName: { group: "فیلدهای مشترک", admin: "برچسب نام", value: "نام" },
  fieldFirstNamePlaceholder: { group: "فیلدهای مشترک", admin: "راهنمای نام", value: "نام خود را وارد کنید" },
  fieldLastName: { group: "فیلدهای مشترک", admin: "برچسب نام خانوادگی", value: "نام خانوادگی" },
  fieldLastNamePlaceholder: { group: "فیلدهای مشترک", admin: "راهنمای نام خانوادگی", value: "نام خانوادگی خود را وارد کنید" },
  fieldEmail: { group: "فیلدهای مشترک", admin: "برچسب ایمیل", value: "ایمیل" },
  fieldEmailPlaceholder: { group: "فیلدهای مشترک", admin: "راهنمای ایمیل", value: "ایمیل خود را وارد کنید." },
  fieldPhone: { group: "فیلدهای مشترک", admin: "برچسب شماره موبایل", value: "شماره موبایل" },
  actionSave: { group: "فیلدهای مشترک", admin: "دکمه ذخیره", value: "ذخیره" },
  actionCancel: { group: "فیلدهای مشترک", admin: "دکمه انصراف", value: "انصراف" },
  actionBack: { group: "فیلدهای مشترک", admin: "دکمه بازگشت", value: "بازگشت" },
  actionEdit: { group: "فیلدهای مشترک", admin: "دکمه ویرایش", value: "ویرایش" },
  labelLoading: { group: "فیلدهای مشترک", admin: "متن در حال بارگذاری", value: "در حال بارگذاری..." },
  labelFree: { group: "فیلدهای مشترک", admin: "متن رایگان", value: "رایگان" },
  labelCurrency: { group: "فیلدهای مشترک", admin: "واحد پول", value: "تومان" },
  labelGenderMan: { group: "فیلدهای مشترک", admin: "جنسیت مرد", value: "مرد" },
  labelGenderWoman: { group: "فیلدهای مشترک", admin: "جنسیت زن", value: "زن" },
  saveSuccess: { group: "فیلدهای مشترک", admin: "پیام ذخیره موفق", value: "با موفقیت تغییر کرد" },

  // --- جستجوی هنرمندان (فیلترها) ---
  artistsCount: { group: "صفحه جستجوی هنرمندان", admin: "متن تعداد نتایج ({count} = عدد)", value: "{count} هنرمند یافت شد" },
  artistsNoFilters: {
    group: "صفحه جستجوی هنرمندان",
    admin: "متن نبودن فیلتر برای دسته‌بندی",
    value: "برای این دسته‌بندی فیلتری تعریف نشده است.",
  },
  artistsClearFilters: { group: "صفحه جستجوی هنرمندان", admin: "دکمه حذف فیلترها", value: "حذف فیلترها" },
  artistsCategoryLabel: { group: "صفحه جستجوی هنرمندان", admin: "برچسب پیش‌فرض دسته‌بندی", value: "دسته‌بندی" },
  artistsRangeTo: { group: "صفحه جستجوی هنرمندان", admin: "واژه «تا» در بازه‌ها", value: "تا" },
  artistsCardCta: { group: "صفحه جستجوی هنرمندان", admin: "دکمه کارت هنرمند", value: "مشاهده پروفایل" },

  // --- صفحه هنرمند ---
  artistAboutTitle: { group: "صفحه هنرمند", admin: "عنوان بخش درباره", value: "درباره من" },
  artistPhotosTitle: { group: "صفحه هنرمند", admin: "عنوان نمونه‌کار تصویری", value: "نمونه کارهای تصویری" },
  artistVideosTitle: { group: "صفحه هنرمند", admin: "عنوان نمونه‌کار ویدیویی", value: "نمونه کارهای ویدیویی" },
  artistProvince: { group: "صفحه هنرمند", admin: "برچسب استان", value: "استان" },
  artistCategory: { group: "صفحه هنرمند", admin: "برچسب دسته‌بندی", value: "دسته‌بندی" },
  artistGender: { group: "صفحه هنرمند", admin: "برچسب جنسیت", value: "جنسیت" },
  artistAccent: { group: "صفحه هنرمند", admin: "برچسب لهجه", value: "لهجه" },
  artistContactTitle: { group: "صفحه هنرمند", admin: "عنوان اطلاعات تماس", value: "اطلاعات تماس" },
  artistContactPhone: { group: "صفحه هنرمند", admin: "برچسب شماره تماس", value: "شماره تماس" },
  artistContactEmail: { group: "صفحه هنرمند", admin: "برچسب ایمیل", value: "ایمیل" },
  artistContactAddress: { group: "صفحه هنرمند", admin: "برچسب آدرس", value: "آدرس" },
  artistContactPostalCode: { group: "صفحه هنرمند", admin: "برچسب کد پستی", value: "کد پستی" },
  artistContactCta: { group: "صفحه هنرمند", admin: "دکمه مشاهده اطلاعات تماس", value: "مشاهده اطلاعات تماس" },
  artistShareCta: { group: "صفحه هنرمند", admin: "دکمه اشتراک گذاری", value: "اشتراک گذاری" },
  artistLoginFirst: {
    group: "صفحه هنرمند",
    admin: "پیام نیاز به ورود",
    value: "برای مشاهده اطلاعات تماس ابتدا وارد شوید.",
  },
  artistWorkPhoto: { group: "صفحه هنرمند", admin: "برچسب نمونه تصویری", value: "نمونه تصویری" },
  artistWorkVideo: { group: "صفحه هنرمند", admin: "برچسب نمونه ویدیویی", value: "نمونه ویدیویی" },
  artistWorkYear: { group: "صفحه هنرمند", admin: "برچسب سال نمونه‌کار ({year} = سال)", value: "سال {year}" },

  // --- درخواست مشاهده اطلاعات تماس ---
  callFormFreeDesc: {
    group: "درخواست اطلاعات تماس",
    admin: "توضیح فرم (رایگان)",
    value: "برای مشاهده اطلاعات تماس هنرمند، فرم اطلاعات را پر کنید تا درخواست مشاهده شما ثبت گردد.",
  },
  callFormPaidDesc: {
    group: "درخواست اطلاعات تماس",
    admin: "توضیح فرم (پرداختی)",
    value: "برای مشاهده اطلاعات تماس هنرمند، بعد از پرکردن فرم اطلاعات، هزینه خدمات سایت را پرداخت کنید تا درخواست مشاهده شما ثبت گردد.",
  },
  callNameLabel: { group: "درخواست اطلاعات تماس", admin: "برچسب نام و نام خانوادگی", value: "نام و نام خانوادگی" },
  callNamePlaceholder: {
    group: "درخواست اطلاعات تماس",
    admin: "راهنمای نام و نام خانوادگی",
    value: "نام و نام خانوادگی خود را وارد کنید.",
  },
  callNameError: { group: "درخواست اطلاعات تماس", admin: "خطای نام خالی", value: "نام و نام خانوادگی را وارد کنید." },
  callAmountLabel: { group: "درخواست اطلاعات تماس", admin: "برچسب مبلغ", value: "مبلغ قابل پرداخت" },
  callSubmittingFree: { group: "درخواست اطلاعات تماس", admin: "متن در حال ثبت", value: "در حال ثبت درخواست..." },
  callSubmittingPaid: { group: "درخواست اطلاعات تماس", admin: "متن در حال انتقال به درگاه", value: "در حال انتقال به درگاه..." },
  callSubmitFree: { group: "درخواست اطلاعات تماس", admin: "دکمه ثبت (رایگان)", value: "مشاهده اطلاعات تماس" },
  callSubmitPaid: { group: "درخواست اطلاعات تماس", admin: "دکمه ثبت (پرداختی)", value: "پرداخت و ثبت درخواست" },
  callSuccessTitle: { group: "درخواست اطلاعات تماس", admin: "عنوان موفقیت", value: "درخواست شما با موفقیت ثبت شد" },
  callSuccessDesc: {
    group: "درخواست اطلاعات تماس",
    admin: "توضیح موفقیت",
    value: "برای دیدن وضعیت درخواست و پروفایل هنرمند، به پروفایل خود و بخش «درخواست‌های ارتباط با هنرمندان» بروید.",
  },
  callSuccessTracking: { group: "درخواست اطلاعات تماس", admin: "برچسب شماره پیگیری", value: "شماره پیگیری:" },
  callSuccessCta: { group: "درخواست اطلاعات تماس", admin: "دکمه رفتن به پروفایل", value: "رفتن به پروفایل" },

  // --- پروفایل کاربر ---
  profileOverviewTitle: { group: "پروفایل کاربر", admin: "عنوان ویرایش پروفایل", value: "ویرایش پروفایل" },
  profileOverviewCta: { group: "پروفایل کاربر", admin: "دکمه به‌روزرسانی پروفایل", value: "به‌روزرسانی پروفایل" },
  profileFormsTitle: { group: "پروفایل کاربر", admin: "عنوان لیست فرم‌ها", value: "لیست فرم‌ها" },
  profileFormsEmpty: { group: "پروفایل کاربر", admin: "متن نبودن فرم", value: "هیچ فرمی ثبت نشده است." },
  profileFormsTracking: { group: "پروفایل کاربر", admin: "برچسب کد پیگیری فرم", value: "کد پیگیری:" },
  profileFormEdit: { group: "پروفایل کاربر", admin: "دکمه ویرایش فرم", value: "ویرایش فرم" },
  profileFormView: { group: "پروفایل کاربر", admin: "دکمه مشاهده فرم", value: "مشاهده فرم" },
  profileFormsColName: { group: "پروفایل کاربر", admin: "ستون نام فرم", value: "نام فرم" },
  profileFormsColDate: { group: "پروفایل کاربر", admin: "ستون تاریخ ارسال", value: "تاریخ ارسال" },
  profileColStatus: { group: "پروفایل کاربر", admin: "ستون وضعیت", value: "وضعیت" },
  profileColActions: { group: "پروفایل کاربر", admin: "ستون عملیات", value: "عملیات" },
  profileRequestsTitle: { group: "پروفایل کاربر", admin: "عنوان درخواست‌های ارتباط", value: "درخواست‌های ارتباط با هنرمندان" },
  profileRequestsTabTitle: { group: "پروفایل کاربر", admin: "عنوان تب درخواست‌ها", value: "درخواست‌های ارتباط" },
  profileRequestsColArtist: { group: "پروفایل کاربر", admin: "ستون هنرمند", value: "هنرمند" },
  profileRequestsColTracking: { group: "پروفایل کاربر", admin: "ستون شماره پیگیری", value: "شماره پیگیری" },
  profileRequestsColAmount: { group: "پروفایل کاربر", admin: "ستون مبلغ", value: "مبلغ" },
  profileRequestsViewArtist: { group: "پروفایل کاربر", admin: "دکمه مشاهده پروفایل هنرمند", value: "مشاهده پروفایل هنرمند" },
  profilePaymentsTitle: { group: "پروفایل کاربر", admin: "عنوان تاریخچه پرداخت‌ها", value: "تاریخچه پرداخت‌ها" },
  profilePaymentsEmpty: { group: "پروفایل کاربر", admin: "متن نبودن پرداخت", value: "هنوز پرداختی ثبت نشده است." },
  profilePaymentItemLabel: {
    group: "پروفایل کاربر",
    admin: "عنوان ردیف پرداخت ({artist} = نام هنرمند)",
    value: "مشاهده اطلاعات تماس پروفایل: {artist}",
  },
  profileWalletTitle: { group: "پروفایل کاربر", admin: "عنوان کیف پول", value: "کیف پول" },
  profileWalletBalance: { group: "پروفایل کاربر", admin: "برچسب موجودی", value: "موجودی کیف پول" },
  profileWalletNote: {
    group: "پروفایل کاربر",
    admin: "توضیح کیف پول",
    value: "اگر درخواست ثبت‌نام شما رد شود یا نیاز به اصلاح داشته باشد، هزینه پرداختی به کیف پول شما برمی‌گردد و در پرداخت بعدی به‌صورت خودکار کسر می‌شود.",
  },
  profileWalletEmpty: { group: "پروفایل کاربر", admin: "متن نبودن تراکنش", value: "هنوز تراکنشی ثبت نشده است." },
  profileSupportTitle: { group: "پروفایل کاربر", admin: "عنوان پشتیبانی", value: "پشتیبانی" },
  profileSupportDesc: {
    group: "پروفایل کاربر",
    admin: "توضیح بخش پشتیبانی پروفایل",
    value: "این بخش می‌تواند برای نمایش تیکت‌های پشتیبانی و پیام‌های شما با تیم پشتیبانی استفاده شود. در حال حاضر فقط نمای کلی صفحه پیاده‌سازی شده است.",
  },
  profileLogoutTitle: { group: "پروفایل کاربر", admin: "عنوان خروج از حساب", value: "خروج از حساب" },
  profileLogoutSuccess: { group: "پروفایل کاربر", admin: "پیام خروج موفق", value: "با موفقیت خارج شدید" },

  // --- وضعیت پرداخت ---
  paymentPending: { group: "وضعیت پرداخت", admin: "در انتظار پرداخت", value: "در انتظار پرداخت" },
  paymentCompleted: { group: "وضعیت پرداخت", admin: "پرداخت شده", value: "پرداخت شده" },
  paymentFailed: { group: "وضعیت پرداخت", admin: "ناموفق", value: "ناموفق" },
  paymentCanceled: { group: "وضعیت پرداخت", admin: "لغو شده", value: "لغو شده" },

  // --- آموزش‌ها ---
  tutorialsTitle: { group: "آموزش‌ها", admin: "عنوان صفحه آموزش‌ها", value: "آموزش‌ها" },
  tutorialsEmpty: { group: "آموزش‌ها", admin: "متن نبودن آموزش", value: "تا این لحظه آموزشی ثبت نشده است." },
  tutorialsSectionTitle: { group: "آموزش‌ها", admin: "عنوان بخش آموزش‌ها در صفحه اول", value: "آموزش‌ها" },
  tutorialsSectionCta: { group: "آموزش‌ها", admin: "لینک «همه» بخش آموزش‌ها", value: "همه" },

  // --- نتیجه ثبت‌نام هنرمند ---
  regResultSuccessTitle: { group: "نتیجه ثبت‌نام", admin: "عنوان موفق", value: "ثبت‌نام شما با موفقیت انجام شد" },
  regResultSuccessDesc: {
    group: "نتیجه ثبت‌نام",
    admin: "توضیح موفق",
    value: "درخواست شما ثبت شد و پس از بررسی کارشناسان نتیجه به شما اطلاع داده می‌شود.",
  },
  regResultFailTitle: { group: "نتیجه ثبت‌نام", admin: "عنوان ناموفق", value: "پرداخت ناموفق بود" },
  regResultFailDesc: {
    group: "نتیجه ثبت‌نام",
    admin: "توضیح ناموفق",
    value: "مبلغی از حساب شما کسر نشده است. می‌توانید دوباره تلاش کنید.",
  },

  // --- ورود اجباری پیش از فرم ثبت‌نام ---
  regAuthGateTitle: { group: "نتیجه ثبت‌نام", admin: "عنوان نیاز به ورود", value: "برای ثبت‌نام ابتدا وارد شوید" },
  regAuthGateDesc: {
    group: "نتیجه ثبت‌نام",
    admin: "توضیح نیاز به ورود",
    value: "فرم ثبت‌نام و پرداخت به حساب کاربری شما گره خورده است. پس از ورود، فرم را تکمیل کنید.",
  },
  regAuthGateCta: { group: "نتیجه ثبت‌نام", admin: "دکمه ورود", value: "ورود / ثبت‌نام" },

  // --- فرم تماس با ما ---
  contactRequiredError: { group: "فرم تماس با ما", admin: "خطای فیلد الزامی ({field} = نام فیلد)", value: "{field} الزامی است" },
  contactSubmitSuccess: { group: "فرم تماس با ما", admin: "پیام ارسال موفق", value: "درخواست شما با موفقیت ارسال شد." },
  contactSubmitError: { group: "فرم تماس با ما", admin: "پیام ارسال ناموفق", value: "ارسال درخواست با خطا مواجه شد." },
} as const;

export type LandingCopyKey = keyof typeof LANDING_COPY;

/** Panel groups in display order, derived from the registry itself. */
export const LANDING_COPY_GROUPS = [
  ...new Set(Object.values(LANDING_COPY).map((entry) => entry.group)),
];
