"use client";

import React from "react";
import {
  FileText,
  UserRound,
  MessageCircle,
  CreditCard,
  Wallet,
  LogOut,
  ChevronLeft,
  Headset,
} from "lucide-react";
import { SectionId } from "../types";
import Button from "../../common/Button";
import MenuSection from "./MenuSection";
import { useUserProfile } from "@/lib/services/landing/hook";
import clsx from "clsx";
import { useLandingCopy } from "@/lib/hooks/useLandingCopy";
import type { LandingCopyKey } from "@/lib/constants/landingCopy";

export interface SideBarSections {
  id: SectionId;
  label: string;
  icon: React.ReactNode;
}

// Labels are copy keys; the admin-editable text is resolved at render time.
const sectionDefs1: { id: SectionId; label: LandingCopyKey; icon: React.ReactNode }[] = [
  {
    id: "forms",
    label: "profileFormsTitle",
    icon: <FileText className="h-4 w-4" />,
  },
  {
    id: "requests",
    label: "profileRequestsTitle",
    icon: <MessageCircle className="h-4 w-4" />,
  },
  {
    id: "payments",
    label: "profilePaymentsTitle",
    icon: <CreditCard className="h-4 w-4" />,
  },
  {
    id: "wallet",
    label: "profileWalletTitle",
    icon: <Wallet className="h-4 w-4" />,
  },
];

const sectionDefs2: { id: SectionId; label: LandingCopyKey; icon: React.ReactNode }[] = [
  {
    id: "support",
    label: "profileSupportTitle",
    icon: <Headset className="h-4 w-4" />,
  },
  {
    id: "logout",
    label: "profileLogoutTitle",
    icon: <LogOut className="h-4 w-4" />,
  },
];

export default function ProfileSidebar({
  active,
  setActive,
}: Readonly<{
  active: SectionId | null;
  setActive: (s: SectionId | null) => void;
}>) {
  const { data } = useUserProfile();
  const copy = useLandingCopy();
  const resolve = (defs: typeof sectionDefs1): SideBarSections[] =>
    defs.map((s) => ({ ...s, label: copy(s.label) }));

  return (
    <aside className="relative flex-2 z-10 w-full space-y-2 text-right">
      <div
        className={clsx(
          "flex justify-between gap-2 overflow-hidden items-center bg-gray-100/60 rounded-xl border-2 border-zinc-700/60 p-5 backdrop-blur-sm",
        )}
      >
        <div className="flex items-center justify-start gap-2">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-zinc-800/80 ring-1 ring-zinc-700">
            <UserRound className="h-6 w-6 text-zinc-300" />
          </div>
          <div className="flex flex-col gap-2 items-start">
            <h2 className="text-base text-zinc-100">{`${data?.firstName} ${data?.lastName}`}</h2>
            <span dir="ltr" className="text-sm text-zinc-400">
              {data?.phone_number ?? ""}
            </span>
            <p className="text-sm text-zinc-400 truncate">{data?.email}</p>
          </div>
        </div>
        <Button
          variant="text"
          leftIcon={<ChevronLeft className="text-zinc-500" size={20} />}
          className="text-sm text-zinc-400! transition hover:text-zinc-200 p-0!"
          onClick={() => setActive("overview")}
        >
          {copy("actionEdit")}
        </Button>
      </div>

      <MenuSection sections={resolve(sectionDefs1)} active={active} setActive={setActive} />
      <MenuSection sections={resolve(sectionDefs2)} active={active} setActive={setActive} />
    </aside>
  );
}
