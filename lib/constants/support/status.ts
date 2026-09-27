import { ESupportStatus } from "@/lib/services/admin/type";
import { BadgeProps } from "@dgshahr/ui-kit/Badge";

export const SUPPOET_STATUS: Record<
  ESupportStatus,
  { label: string; color: BadgeProps["color"] }
> = {
  [ESupportStatus.OPEN]: {
    label: "در انتظار پاسخ",
    color: "warning",
  },
  [ESupportStatus.ANSWERED]: {
    label: "پاسخ داده شد",
    color: "success",
  },
  [ESupportStatus.CLOSED]: {
    label: "بسته شده",
    color: "gray",
  },
};
