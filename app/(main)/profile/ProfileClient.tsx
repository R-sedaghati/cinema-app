"use client";

import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { SectionId } from "../../../components/profile/types";
import ProfileSidebar from "../../../components/profile/sidebar/ProfileSidebar";
import ProfileContent from "../../../components/profile/ProfileContent";
import useResponsiveSidebar from "../../../components/profile/useResponsiveSidebar";
import { useLandingCopy } from "@/lib/hooks/useLandingCopy";
import type { LandingCopyKey } from "@/lib/constants/landingCopy";
import BackLinkSection from "@/components/artist-registration/sections/BackLinkSection";
import { useFormCopy } from "@/lib/hooks/useFormCopy";
import useAuthStore from "@/lib/stores/useAuthStore";
import useLoginDrawerStore from "@/lib/stores/useLoginDrawerStore";
import { Card } from "@dgshahr/ui-kit";
import { landingCopy } from "@/lib/utils/landingCopy";
import clsx from "clsx";
import { isDesktop } from "react-device-detect";

const sectionLabelKeys: Record<SectionId, LandingCopyKey> = {
  overview: "profileOverviewTitle",
  forms: "profileFormsTitle",
  messages: "profileMessagesTitle",
  requests: "profileRequestsTabTitle",
  wallet: "profileWalletTitle",
  support: "profileSupportTitle",
  logout: "profileLogoutTitle",
};

export function ProfileClient() {
  const fromCopy = useFormCopy();
  const { accessToken } = useAuthStore();
  const { open: openLoginDrawer } = useLoginDrawerStore();

  const [active, setActive] = useState<SectionId | null>("forms");
  const copy = useLandingCopy();
  const sectionLabels = (id: SectionId) => copy(sectionLabelKeys[id]);

  const { isMobile, showSidebar, setShowSidebar, handleSelect } =
    useResponsiveSidebar(setActive);

  const goBack = () => {
    setShowSidebar(true);
    setActive(null);
  };

  useEffect(() => {
    if (!accessToken) openLoginDrawer();
  }, [accessToken, openLoginDrawer]);

  if (!accessToken) {
    return (
      <div className="flex justify-center py-16 md:py-24">
        <Card
          wrapperClassName={clsx("w-[90%]", isDesktop && "w-1/2")}
          className="py-10 px-4 md:px-8"
        >
          <div className="flex flex-col gap-5 items-center text-center">
            <p data-el="title" className="font-h4-bold">
              <span style={landingCopy.style("regAuthGateTitle")}>
                {landingCopy("regAuthGateTitle")}
              </span>
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="relative grid gap-9 md:grid-cols-[minmax(260px,0.9fr)_minmax(0,2.1fr)]">
      {isMobile && <BackLinkSection copy={fromCopy} />}
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
              <span data-el="title" className="text-base font-semibold text-zinc-100">
                {active ? sectionLabels(active) : ""}
              </span>
            </div>
          )}
          <BackLinkSection copy={fromCopy} />
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
