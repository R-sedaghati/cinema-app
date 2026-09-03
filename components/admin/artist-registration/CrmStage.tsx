"use client";

import React from "react";
import Badge from "@dgshahr/ui-kit/Badge";
import { CRM_STAGE } from "@/lib/constants/artist/crmStage";
import { ECrmStage } from "@/lib/services/admin/type";

interface CrmStageProps {
  stage?: ECrmStage | null;
  isSolid?: boolean;
}

const CrmStage: React.FC<CrmStageProps> = ({ stage, isSolid = false }) => {
  if (!stage) return <p className="font-p1-regular">—</p>;

  const item = CRM_STAGE[stage] ?? { label: stage, color: "gray" };

  return (
    <Badge
      value={item.label}
      color={item.color}
      type={isSolid ? "solid" : "twoTone"}
    />
  );
};

export default CrmStage;
