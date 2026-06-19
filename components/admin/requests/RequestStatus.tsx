"use client";

import React from "react";
import Badge from "@dgshahr/ui-kit/Badge";
import { ESupportStatus } from "@/lib/services/admin/type";
import { SUPPOET_STATUS } from "@/lib/constants/support/status";

interface RolesProps {
  status: string;
}
const RequestStatus: React.FC<RolesProps> = ({ status }) => {
  const key = status as ESupportStatus;

  const item = SUPPOET_STATUS[key] ?? { label: status, color: "gray" };

  return <Badge value={item.label} color={item.color} type="twoTone" />;
};

export default RequestStatus;
