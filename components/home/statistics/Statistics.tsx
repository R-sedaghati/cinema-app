"use client";

import Button from "@/components/common/Button";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const statisticsItems = [
  {
    id: 1,
    statistics: (
      <p>
        <span className="text-error-500">%</span>۹۰
      </p>
    ),
    title: "رضایت هنرمندها",
  },
  {
    id: 2,
    statistics: (
      <p>
        ۲۰۰۰<span className="text-error-500">+</span>
      </p>
    ),
    title: "پروفایل کاربری فعال",
  },
  {
    id: 3,
    statistics: (
      <p>
        <span className="text-error-500">%</span>۳۵
      </p>
    ),
    title: "کاریابی هنرمندها",
  },
  {
    id: 4,
    statistics: (
      <p>
        ۵<span className="text-error-500">+</span>
      </p>
    ),
    title: "سال تجربه کاری",
  },
];

const StatisticsSection = () => {
  const router = useRouter();
  return (
    <div className="flex relative flex-col md:flex-row gap-10 justify-between items-center">
      <div className="flex flex-1 flex-col gap-8 text-zinc-100">
        <h5 className="font-h1-bold text-[32px]">
          شفاف، قابل‌اعتماد، قابل‌پیگیری
        </h5>
        <h6 className="font-medium text-xl">
          پروفایل‌های استاندارد، جستجوی دقیق و مسیر ارتباط کنترل‌شده؛ همه‌چیز
          برای انتخاب بهتر و سریع‌تر آماده است.
        </h6>
        <Button
          onClick={() => router.push("/artists")}
          leftIcon={<ChevronLeft />}
          size="small"
          className="bg-error-500 rounded-full!"
        >
          مشاهده هنرمندان
        </Button>
      </div>
      <div className="flex-1 place-items-center gap-16 grid grid-cols-2 grid-rows-2">
        {statisticsItems.map((item) => (
          <div key={item.id} className="">
            <div className="text-6xl font-extrabold">{item.statistics}</div>
            <p className="font-medium text-xl">{item.title}</p>
          </div>
        ))}
      </div>

      <div
        className="w-170 h-170 rounded-full absolute opacity-20 -top-44 -right-96 -z-1
        bg-radial-primary"
      />
      <div
        className="w-170 h-170 rounded-full absolute opacity-20 -top-100 -left-110 -z-1
        bg-radial-primary"
      />
    </div>
  );
};

export default StatisticsSection;
