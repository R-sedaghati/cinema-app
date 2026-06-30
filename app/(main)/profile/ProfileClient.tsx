"use client";

import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { SectionId } from "../../../components/profile/types";
import ProfileSidebar from "../../../components/profile/sidebar/ProfileSidebar";
import ProfileContent from "../../../components/profile/ProfileContent";
import useResponsiveSidebar from "../../../components/profile/useResponsiveSidebar";

const sectionLabels: Record<SectionId, string> = {
  overview: "ویرایش پروفایل",
  forms: "لیست فرم‌ها",
  requests: "درخواست‌های ارتباط",
  payments: "تاریخچه پرداخت‌ها",
  support: "پشتیبانی",
  logout: "خروج از حساب",
};

export function ProfileClient() {
  const [active, setActive] = useState<SectionId | null>("forms");

  const { isMobile, showSidebar, setShowSidebar, handleSelect } =
    useResponsiveSidebar(setActive);

  const goBack = () => {
    setShowSidebar(true);
    setActive(null);
  };

  return (
    <div className="relative grid gap-9 md:grid-cols-[minmax(260px,0.9fr)_minmax(0,2.1fr)]">
      {(isMobile === null || !isMobile || showSidebar) && (
        <ProfileSidebar active={active} setActive={handleSelect} />
      )}
      {isMobile !== null && (!isMobile || !showSidebar) && (
        <div className="relative z-10 flex-4">
          {isMobile && (
            <div className="flex items-center gap-3 mb-5 pb-4 border-b border-zinc-800/60">
              <button
                type="button"
                onClick={goBack}
                className="flex items-center justify-center rounded-full p-1.5 text-zinc-400 active:bg-zinc-800 transition"
              >
                <ArrowRight size={22} />
              </button>
              <span className="text-base font-semibold text-zinc-100">
                {active ? sectionLabels[active] : ""}
              </span>
            </div>
          )}
          <div className="overflow-x-auto">
            <ProfileContent active={active} />
          </div>
        </div>
      )}

      <div
        className="w-170 h-170 rounded-full absolute opacity-20 -bottom-44 -right-96 -z-1
        bg-radial-primary"
      />
      <div
        className="w-170 h-170 rounded-full absolute opacity-20 -top-44 -left-96 -z-1
        bg-radial-primary"
      />
    </div>
  );
}
