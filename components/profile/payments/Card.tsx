"use client";

import Badge from "@/components/common/Badge";
import { useLandingCopy } from "@/lib/hooks/useLandingCopy";
import { Divider } from "@dgshahr/ui-kit";
import { IContactRequestItem } from "@/lib/services/landing/type";
import convertEnNumberToFaNumberWithSeparation from "@/lib/utils/convertEnNumberToFaNumberWithSeparation";
import convertGregorianTimeToShamsiTime from "@/lib/utils/convertGregorianTimeToShamsiTime";

const statusColors: Record<
  IContactRequestItem["status"],
  "success" | "warning" | "error" | "gray"
> = {
  PENDING: "warning",
  COMPLETED: "success",
  FAILED: "error",
  CANCELED: "gray",
};

const Card = ({ payment }: { payment: IContactRequestItem }) => {
  const copy = useLandingCopy();
  const statusLabels: Record<IContactRequestItem["status"], string> = {
    PENDING: copy("paymentPending"),
    COMPLETED: copy("paymentCompleted"),
    FAILED: copy("paymentFailed"),
    CANCELED: copy("paymentCanceled"),
  };

  // The artist's own name is behind this very purchase, so the code is what we can show.
  const artistLabel = payment.artist.code ?? "—";

  return (
    <>
      <div className="min-h-21 p-4 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <p className="text-zinc-400">
            {convertGregorianTimeToShamsiTime(payment.createdAt)}
          </p>
          <Badge
            value={statusLabels[payment.status]}
            color={statusColors[payment.status]}
          />
        </div>
        <div className="flex flex-col md:flex-row items-start justify-between md:items-center">
          <p className="line-clamp-1">
            {copy("profilePaymentItemLabel", { artist: artistLabel })}
          </p>
          <p className="text-nowrap">
            {payment.amount === 0
              ? copy("labelFree")
              : `${convertEnNumberToFaNumberWithSeparation(payment.amount)} ${copy("labelCurrency")}`}
          </p>
        </div>
      </div>
      <Divider type="horizontal" className="last:hidden" />
    </>
  );
};

export default Card;
