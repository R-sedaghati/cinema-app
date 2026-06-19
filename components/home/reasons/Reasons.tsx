import Image from "next/image";

const reasonsCardItems = [
  {
    id: 1,
    image: "./reasons-profile.svg",
    title: "پروفایل استاندارد",
    detail:
      "اطلاعات رزومه و نمونه‌کارها در یک قالب مشخص ثبت می‌شود تا مقایسه و تصمیم‌گیری راحت‌تر و دقیق‌تر باشد.",
  },
  {
    id: 2,
    image: "./reasons-search.svg",
    title: "جستجو و فیلتر حرفه‌ای",
    detail:
      "با فیلترهای دقیق و مرتب‌سازی هوشمند، سریع‌تر به گزینه‌های مناسب پروژه‌ات می‌رسی.",
  },
  {
    id: 3,
    image: "./reasons-relation.svg",
    title: "ارتباط امن با تایید درخواست",
    detail:
      "ارتباط‌ها فقط از مسیر درخواست و تایید انجام می‌شود تا حریم خصوصی حفظ و از مزاحمت/اسپم جلوگیری شود.",
  },
];
const Reasons = () => {
  return (
    <div className="flex flex-col justify-center items-center gap-10">
      <h3 className="font-h1-bold">چرا سینما آرشیو؟</h3>
      <div className="flex flex-wrap justify-center items-center gap-10">
        {reasonsCardItems.map((item) => (
          <div
            key={item.id}
            className="w-73 min-h-109 flex bg-secondary-black flex-col justify-between items-center gap-8 border border-error-500/30 shadow-card rounded-4xl p-8"
          >
            <Image src={item.image} alt={item.title} width={216} height={160} />
            <h5 className="font-h3-bold h-7.5">{item.title}</h5>
            <p className="font-p1-regular flex-1 text-zinc-400">
              {item.detail}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reasons;
