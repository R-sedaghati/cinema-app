"use client";

import React from "react";
import ContentCard from "./ContentCard";
import { useLandingCopy } from "@/lib/hooks/useLandingCopy";

export default function SupportCard() {
  const copy = useLandingCopy();

  return (
    <ContentCard title={copy("profileSupportTitle")}>
      <p className="text-sm leading-8 text-zinc-300">
        <span style={copy.style("profileSupportDesc")}>{copy("profileSupportDesc")}</span>
      </p>
    </ContentCard>
  );
}
