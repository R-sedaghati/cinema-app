import { EArtistRequestStatus } from "@/lib/services/admin/type";
import { BadgeProps } from "@dgshahr/ui-kit/Badge";

export const ARTSIT_STATUS: Record<
  EArtistRequestStatus,
  { label: string; color: BadgeProps["color"] }
> = {
  [EArtistRequestStatus.APPROVED]: {
    label: "تایید شده",
    color: "success",
  },
  [EArtistRequestStatus.PENDING]: {
    label: "در انتظار بررسی",
    color: "gray",
  },
  [EArtistRequestStatus.PENDING_PAYMENT]: {
    label: "در انتظار پرداخت",
    color: "warning",
  },
  [EArtistRequestStatus.REJECTED]: {
    label: "رد شده",
    color: "warning",
  },
};
