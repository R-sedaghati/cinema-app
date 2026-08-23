"use client";
/* eslint-disable @next/next/no-img-element */

import Button from "@/components/common/Button";
import { useLandingCopy } from "@/lib/hooks/useLandingCopy";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import React from "react";

const Success = ({ trackingCode }: { trackingCode: string | null }) => {
  const copy = useLandingCopy();

  return (
    <div className="w-full max-w-xl text-center space-y-6">
      {/* Success Icon */}
      <div className="flex justify-center">
        <img
          src="/check_circle_line.svg"
          alt="موفق"
          width={112}
          height={112}
        />
      </div>

      <div className="flex justify-center">
        <div className="bg-emerald-600 text-white px-8 py-2 rounded-full text-base font-medium shadow-lg">
          {copy("callSuccessTitle")}
        </div>
      </div>

      {/* Description */}
      <p className="text-zinc-300 leading-8 text-sm max-w-md mx-auto">
        {copy("callSuccessDesc")}
      </p>

      {/* Tracking Code */}
      {trackingCode && (
        <div className="text-zinc-400 text-sm">
          {copy("callSuccessTracking")}
          <span className="text-zinc-100 font-semibold mr-2">{trackingCode}</span>
        </div>
      )}

      {/* CTA Button */}
      <div>
        <Link href="/profile">
          <Button isFullWidth className="rounded-full!" leftIcon={<ChevronLeft />}>
            {copy("callSuccessCta")}
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Success;
