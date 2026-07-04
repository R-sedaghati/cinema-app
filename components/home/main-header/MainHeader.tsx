"use client";

import Button from "@/components/common/Button";
import useLoginDrawerStore from "@/lib/stores/useLoginDrawerStore";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const MainHeader = () => {
  const router = useRouter();
  const { open } = useLoginDrawerStore();

  return (
    <div className="flex items-center flex-col mt-10 space-y-4">
      <h1 className="text-5xl text-center leading-16 font-h1-regular bg-linear-to-r from-white from-30%  to-zinc-700 bg-clip-text text-transparent">
        استعداد ها رو یکجا ببین٬ <br /> درست انتخاب کن
      </h1>
      <p>
        از ثبت رزومه تا دیده شدن و دریافت درخواست همکاری٬ همه در{" "}
        <span className="text-error-400">سینما آرشیو</span>
      </p>
      <div className="flex gap-2">
        <Button variant="outline" size="small" className="rounded-full!">
          ورود / ثبت نام هنرمند
        </Button>
        <Button
          onClick={() => router.push("/artists")}
          leftIcon={<ChevronLeft />}
          size="small"
          className="bg-error-500 rounded-full!"
        >
          مشاهده هنرمندان
        </Button>
      </div>
    </div>
  );
};

export default MainHeader;
