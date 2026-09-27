"use client";

import StatusPill from "../StatusPill";
import { ESupportStatus } from "@/lib/services/admin/type";
import { useLandingCopy } from "@/lib/hooks/useLandingCopy";

const PILL = {
  [ESupportStatus.OPEN]: { key: "profileSupportStatusOpen", color: "yellow" },
  [ESupportStatus.ANSWERED]: { key: "profileSupportStatusAnswered", color: "green" },
  [ESupportStatus.CLOSED]: { key: "profileSupportStatusClosed", color: "red" },
} as const;

export default function SupportStatusPill({ status }: Readonly<{ status: ESupportStatus }>) {
  const copy = useLandingCopy();
  const pill = PILL[status] ?? PILL[ESupportStatus.OPEN];

  return <StatusPill label={copy(pill.key)} color={pill.color} />;
}
