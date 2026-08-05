import Button from "@/components/common/Button";
import { Input } from "@dgshahr/ui-kit";
import {
  useUserContactPrice,
  useUserCreateContactRequest,
} from "@/lib/services/landing/hook";
import useAuthStore from "@/lib/stores/useAuthStore";
import useLoginDrawerStore from "@/lib/stores/useLoginDrawerStore";
import convertEnNumberToFaNumberWithSeparation from "@/lib/utils/convertEnNumberToFaNumberWithSeparation";
import React, { useState } from "react";

const CallDetail = ({
  artistId,
  setOpen,
}: {
  artistId: number;
  setOpen: (open: boolean) => void;
}) => {
  const { accessToken } = useAuthStore();
  const { open: openLoginDrawer } = useLoginDrawerStore();
  const [requesterName, setRequesterName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { data: priceData } = useUserContactPrice(artistId);
  const { mutate, isPending } = useUserCreateContactRequest();

  // Admins set this per category, in Toman.
  const amountToman = priceData?.result?.amount ?? 0;

  const submit = () => {
    if (!accessToken) {
      setOpen(false);
      openLoginDrawer();
      return;
    }

    if (!requesterName.trim()) {
      setError("نام و نام خانوادگی را وارد کنید.");
      return;
    }

    setError(null);
    mutate(
      { artistId, requesterName: requesterName.trim() },
      {
        onSuccess: (response) => {
          const { redirectUrl } = response.result;
          // No redirect URL means this artist was already unlocked — just reload.
          if (redirectUrl) globalThis.location.href = redirectUrl;
          else globalThis.location.reload();
        },
      },
    );
  };

  return (
    <div className="w-full space-y-8">
      <p className="text-zinc-300 leading-8 text-sm text-center">
        برای مشاهده اطلاعات تماس هنرمند، بعد از پرکردن فرم اطلاعات، هزینه خدمات
        سایت را پرداخت کنید تا درخواست مشاهده شما ثبت گردد.
      </p>
      <Input
        labelContent="نام و نام خانوادگی"
        required
        type="text"
        value={requesterName}
        onChange={(e) => setRequesterName(e.target.value)}
        placeholder="نام و نام خانوادگی خود را وارد کنید."
        {...(error && { status: "error", hintMessage: error })}
      />
      <div className="border border-zinc-600 rounded-2xl p-6 flex justify-between items-center">
        <span className="text-zinc-400 text-sm">مبلغ قابل پرداخت</span>
        <span className="text-zinc-100 text-lg font-semibold">
          {amountToman
            ? `${convertEnNumberToFaNumberWithSeparation(amountToman)} تومان`
            : "—"}
        </span>
      </div>
      <div className="flex gap-4">
        <Button
          isFullWidth
          className="flex-1 rounded-full!"
          variant="outline"
          onClick={() => setOpen(false)}
        >
          انصراف
        </Button>
        <Button
          onClick={submit}
          disabled={isPending}
          className="flex-1 rounded-full!"
          isFullWidth
        >
          {isPending ? "در حال انتقال به درگاه..." : "پرداخت و ثبت درخواست"}
        </Button>
      </div>
    </div>
  );
};

export default CallDetail;
