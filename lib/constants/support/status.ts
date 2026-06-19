import { ESupportStatus } from "@/lib/services/admin/type";
import { BadgeProps } from "@dgshahr/ui-kit/Badge";

export const SUPPOET_STATUS: Record<
  ESupportStatus,
  { label: string; color: BadgeProps["color"] }
> = {
  [ESupportStatus.ACCEPTED]: {
    label: "تایید شده",
    color: "success",
  },
  [ESupportStatus.PENDING]: {
    label: "نیاز به بررسی",
    color: "warning",
  },
  [ESupportStatus.REJECTED]: {
    label: "رد شده",
    color: "error",
  },
};
