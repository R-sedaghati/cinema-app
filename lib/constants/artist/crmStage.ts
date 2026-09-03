import { ECrmStage } from "@/lib/services/admin/type";
import { BadgeProps } from "@dgshahr/ui-kit/Badge";

export const CRM_STAGE: Record<
  ECrmStage,
  { label: string; color: BadgeProps["color"] }
> = {
  [ECrmStage.NEW]: {
    label: "جدید",
    color: "gray",
  },
  [ECrmStage.CONTACTED]: {
    label: "تماس گرفته شده",
    color: "sky",
  },
  [ECrmStage.AWAITING_DOCS]: {
    label: "در انتظار مدارک",
    color: "warning",
  },
  [ECrmStage.NEGOTIATING]: {
    label: "در حال مذاکره",
    color: "violet",
  },
  [ECrmStage.WON]: {
    label: "موفق",
    color: "success",
  },
  [ECrmStage.LOST]: {
    label: "ناموفق",
    color: "error",
  },
};
