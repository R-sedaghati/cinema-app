"use client";

import Button from "@/components/common/Button";
import { useLandingCopy } from "@/lib/hooks/useLandingCopy";
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
  const copy = useLandingCopy();
  const { open: openLoginDrawer } = useLoginDrawerStore();
  const [requesterName, setRequesterName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { data: priceData, isLoading: isPriceLoading } =
    useUserContactPrice(artistId);
  const { mutate, isPending } = useUserCreateContactRequest();

  // Admins set this per category, in Toman. A price of 0 is a real answer — the
  // category is free — so it must not be conflated with "not loaded yet".
  const amountToman = priceData?.result?.amount;
  const isFree = amountToman === 0;

  const submit = () => {
    if (!accessToken) {
      setOpen(false);
      openLoginDrawer();
      return;
    }

    if (!requesterName.trim()) {
      setError(copy("callNameError"));
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
        {isFree
          ? copy("callFormFreeDesc")
          : copy("callFormPaidDesc")}
      </p>
      <Input
        labelContent={copy("callNameLabel")}
        required
        type="text"
        value={requesterName}
        onChange={(e) => setRequesterName(e.target.value)}
        placeholder={copy("callNamePlaceholder")}
        {...(error && { status: "error", hintMessage: error })}
      />
      <div className="border border-zinc-600 rounded-2xl p-6 flex justify-between items-center">
        <span className="text-zinc-400 text-sm">{copy("callAmountLabel")}</span>
        <span className="text-zinc-100 text-lg font-semibold">
          {isPriceLoading || amountToman === undefined
            ? "—"
            : isFree
              ? copy("labelFree")
              : `${convertEnNumberToFaNumberWithSeparation(amountToman)} ${copy("labelCurrency")}`}
        </span>
      </div>
      <div className="flex gap-4">
        <Button
          isFullWidth
          className="flex-1 rounded-full!"
          variant="outline"
          onClick={() => setOpen(false)}
        >
          {copy("actionCancel")}
        </Button>
        <Button
          onClick={submit}
          disabled={isPending}
          className="flex-1 rounded-full!"
          isFullWidth
        >
          {isPending
            ? isFree
              ? copy("callSubmittingFree")
              : copy("callSubmittingPaid")
            : isFree
              ? copy("callSubmitFree")
              : copy("callSubmitPaid")}
        </Button>
      </div>
    </div>
  );
};

export default CallDetail;
