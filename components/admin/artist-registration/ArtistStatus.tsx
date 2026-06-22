"use client";

import React from "react";
import Badge from "@dgshahr/ui-kit/Badge";
import { ARTSIT_STATUS } from "@/lib/constants/artist/status";
import { EArtistRequestStatus } from "@/lib/services/admin/type";

interface RolesProps {
  status: EArtistRequestStatus;
  isSolid: boolean;
}
const ArtistStatus: React.FC<RolesProps> = ({ status, isSolid }) => {
  const key = status;

  const item = ARTSIT_STATUS[key] ?? { label: status, color: "gray" };

  return (
    <Badge
      value={item.label}
      color={item.color}
      type={isSolid ? "solid" : "twoTone"}
    />
  );
};

export default ArtistStatus;
