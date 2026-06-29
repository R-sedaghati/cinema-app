"use client";

import React from "react";
import {
  FileText,
  UserRound,
  MessageCircle,
  CreditCard,
  LogOut,
  ChevronLeft,
  Headset,
} from "lucide-react";
import { SectionId } from "../types";
import Button from "../../common/Button";
import clsx from "clsx";
import MenuSection from "./MenuSection";
import { useUserProfile } from "@/lib/services/landing/hook";

export interface SideBarSections {
  id: SectionId;
  label: string;
  icon: React.ReactNode;
}

const sections1: SideBarSections[] = [
  {
    id: "forms",
    label: "لیست فرم‌ها",
    icon: <FileText className="h-4 w-4" />,
  },
  {
    id: "requests",
    label: "درخواست‌های ارتباط با هنرمندان",
    icon: <MessageCircle className="h-4 w-4" />,
  },
  {
    id: "payments",
    label: "تاریخچه پرداخت‌ها",
    icon: <CreditCard className="h-4 w-4" />,
  },
];

const sections2: SideBarSections[] = [
  {
    id: "support",
    label: "پشتیبانی",
    icon: <Headset className="h-4 w-4" />,
  },
  {
    id: "logout",
    label: "خروج از حساب",
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
          ویرایش
        </Button>
      </div>

      <MenuSection sections={sections1} active={active} setActive={setActive} />
      <MenuSection sections={sections2} active={active} setActive={setActive} />
    </aside>
  );
}
