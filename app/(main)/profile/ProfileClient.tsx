"use client";

import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { SectionId } from "../../../components/profile/types";
import ProfileSidebar from "../../../components/profile/sidebar/ProfileSidebar";
import ProfileContent from "../../../components/profile/ProfileContent";
import useResponsiveSidebar from "../../../components/profile/useResponsiveSidebar";

export function ProfileClient() {
  const [active, setActive] = useState<SectionId | null>("forms");

  const { isMobile, showSidebar, setShowSidebar, handleSelect } =
    useResponsiveSidebar(setActive);

  return (
    <div className="relative grid gap-5 md:grid-cols-[minmax(260px,0.9fr)_minmax(0,2.1fr)]">
      {(isMobile === null || !isMobile || showSidebar) && (
        <ProfileSidebar active={active} setActive={handleSelect} />
      )}
      {isMobile !== null && (!isMobile || !showSidebar) && (
        <div className="relative z-10 flex-4 overflow-x-scroll">
          {isMobile && (
            <ArrowRight
              onClick={() => {
                setShowSidebar(true);
                setActive(null);
              }}
              className="absolute top-4 right-4 text-zinc-400"
            />
          )}
          <ProfileContent active={active} />
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
