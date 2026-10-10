"use client";

import React from "react";
import {
  FileText,
  UserRound,
  MessageCircle,
  Wallet,
  LogOut,
  ChevronLeft,
  Headset,
  Mail,
  BadgeCheck,
} from "lucide-react";
import { SectionId } from "../types";
import Button from "../../common/Button";
import MenuSection from "./MenuSection";
import {
  useUserBadgeCounts,
  useUserProfile,
} from "@/lib/services/landing/hook";
import { subscriptionHref } from "@/lib/services/landing/api";
import convertGregorianTimeToShamsiTime from "@/lib/utils/convertGregorianTimeToShamsiTime";
import clsx from "clsx";
import { useLandingCopy } from "@/lib/hooks/useLandingCopy";
import type { LandingCopyKey } from "@/lib/constants/landingCopy";

export interface SideBarSections {
  id: SectionId;
  label: string;
  icon: React.ReactNode;
  /** Unread count shown next to the chevron; falsy hides it. */
  badge?: number;
}

// Labels are copy keys; the admin-editable text is resolved at render time.
const sectionDefs1: {
  id: SectionId;
  label: LandingCopyKey;
  icon: React.ReactNode;
}[] = [
  {
    id: "forms",
    label: "profileFormsTitle",
    icon: <FileText className="h-4 w-4" />,
  },
  {
    id: "messages",
    label: "profileMessagesTitle",
    icon: <Mail className="h-4 w-4" />,
  },
  {
    id: "requests",
    label: "profileRequestsTitle",
    icon: <MessageCircle className="h-4 w-4" />,
  },
  {
    id: "wallet",
    label: "profileWalletTitle",
    icon: <Wallet className="h-4 w-4" />,
  },
];

const sectionDefs2: {
  id: SectionId;
  label: LandingCopyKey;
  icon: React.ReactNode;
}[] = [
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

/** The yearly subscription. Active: member badge + end date. Expired: renew. */
function SubscriptionBadge({
  expiresAt,
}: Readonly<{ expiresAt?: string | null }>) {
  if (!expiresAt) return null;

  if (new Date(expiresAt) > new Date()) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs text-emerald-400">
        <BadgeCheck className="h-3.5 w-3.5" />
        عضو فعال تا {convertGregorianTimeToShamsiTime(expiresAt, false)}
      </span>
    );
  }

  const renew = () => {
    // landingApi's interceptor already toasts a failure.
    subscriptionHref()
      .then((href) => {
        window.location.href = href;
      })
      .catch(() => {});
  };

  return (
    <span className="inline-flex items-center gap-2 text-xs text-zinc-500">
      اشتراک منقضی شده
      <button
        type="button"
        onClick={renew}
        className="text-zinc-200 underline hover:text-white"
      >
        تمدید
      </button>
    </span>
  );
}

export default function ProfileSidebar({
  active,
  setActive,
}: Readonly<{
  active: SectionId | null;
  setActive: (s: SectionId | null) => void;
}>) {
  const { data } = useUserProfile();
  const copy = useLandingCopy();
  const counts = useUserBadgeCounts().data?.result;
  const badges: Partial<Record<SectionId, number>> = {
    messages: counts?.messages,
    forms: counts?.forms,
  };
  const resolve = (defs: typeof sectionDefs1): SideBarSections[] =>
    defs.map((s) => ({
      ...s,
      label: copy(s.label),
      badge: badges[s.id],
    }));

  return (
    <aside className="relative flex-2 z-10 w-full space-y-2 text-right">
      <div
        className={clsx(
          "flex justify-between gap-2 overflow-hidden items-center bg-gray-100/60 rounded-xl border-2 border-zinc-700/60 p-5 backdrop-blur-sm",
        )}
      >
        <div className="flex items-center justify-start gap-2">
          {data?.avatar ? (
            <img
              src={data.avatar}
              alt=""
              className="h-14 w-14 shrink-0 rounded-full object-cover ring-1 ring-zinc-700"
            />
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-zinc-800/80 ring-1 ring-zinc-700">
              <UserRound className="h-6 w-6 text-zinc-300" />
            </div>
          )}
          <div className="flex flex-col gap-2 items-start">
            <h2 data-el="title" className="text-base text-zinc-100">{`${data?.firstName} ${data?.lastName}`}</h2>
            <span dir="ltr" className="text-sm text-zinc-400">
              {data?.phone_number ?? ""}
            </span>
            <p data-el="card-meta" className="text-sm text-zinc-400 truncate">{data?.email}</p>
            <SubscriptionBadge expiresAt={data?.subscriptionExpiresAt} />
          </div>
        </div>
        <Button
          variant="text"
          leftIcon={<ChevronLeft className="text-zinc-500" size={20} />}
          className="text-sm text-zinc-400! transition hover:text-zinc-200 p-0!"
          onClick={() => setActive("overview")}
        >
          <span style={copy.style("actionEdit")}>{copy("actionEdit")}</span>
        </Button>
      </div>

      <MenuSection
        sections={resolve(sectionDefs1)}
        active={active}
        setActive={setActive}
      />
      <MenuSection
        sections={resolve(sectionDefs2)}
        active={active}
        setActive={setActive}
      />
    </aside>
  );
}
