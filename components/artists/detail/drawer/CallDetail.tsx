import Button from "@/components/common/Button";
import { Input } from "@dgshahr/ui-kit";
import React from "react";

const CallDetail = ({
  setOpenSuccess,
  setOpen,
}: {
  setOpenSuccess: (open: boolean) => void;
  setOpen: (open: boolean) => void;
}) => {
  return (
    <div className="w-full space-y-8">
      {/* Description */}
      <p className="text-zinc-300 leading-8 text-sm text-center">
        برای مشاهده اطلاعات تماس هنرمند، بعد از پرکردن فرم اطلاعات، هزینه خدمات
        سایت را پرداخت کنید تا درخواست مشاهده شما ثبت گردد.
      </p>
      <Input
        labelContent="نام و نام خانوادگی"
        required
        type="text"
        placeholder="نام و نام خانوادگی خود را وارد کنید."
      />
      <div className="border border-zinc-600 rounded-2xl p-6 flex justify-between items-center">
        <span className="text-zinc-400 text-sm">مبلغ قابل پرداخت</span>
        <span className="text-zinc-100 text-lg font-semibold">
          ۲,۰۰۰,۰۰۰ تومان
        </span>
      </div>
      <div className="flex gap-4">
        <Button isFullWidth className="flex-1 rounded-full!" variant="outline">
          انصراف
        </Button>
        <Button
          onClick={() => {
            setOpenSuccess(true);
            setOpen(false);
          }}
          className="flex-1 rounded-full!"
          isFullWidth
        >
          پرداخت و ثبت درخواست
        </Button>
      </div>
    </div>
  );
};

export default CallDetail;
