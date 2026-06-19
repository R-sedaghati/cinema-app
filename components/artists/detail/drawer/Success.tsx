import Button from "@/components/common/Button";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import React from "react";

const Success = () => {
  return (
    <div className="w-full max-w-xl text-center space-y-6">
      {/* Success Icon */}
      <div className="flex justify-center">
        <Image
          src="/check_circle_line.svg"
          alt="موفق"
          width={112}
          height={112}
        />
      </div>

      <div className="flex justify-center">
        <div className="bg-emerald-600 text-white px-8 py-2 rounded-full text-base font-medium shadow-lg">
          درخواست شما با موفقیت ثبت شد
        </div>
      </div>

      {/* Description */}
      <p className="text-zinc-300 leading-8 text-sm max-w-md mx-auto">
        برای دیدن وضعیت درخواست و پروفایل هنرمند، به پروفایل خود و بخش
        «درخواست‌های ارتباط با هنرمندان» بروید.
      </p>

      {/* Tracking Code */}
      <div className="text-zinc-400 text-sm">
        شماره پیگیری:
        <span className="text-zinc-100 font-semibold mr-2">۱۲۳۴۶۵۹۸</span>
      </div>

      {/* CTA Button */}
      <div>
        <Button
          isFullWidth
          className="rounded-full!"
          leftIcon={<ChevronLeft />}
        >
          رفتن به پروفایل
        </Button>
      </div>
    </div>
  );
};

export default Success;
