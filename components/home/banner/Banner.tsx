"use client";

import Button from "@/components/common/Button";
import useAuthStore from "@/lib/stores/useAuthStore";
import useLoginDrawerStore from "@/lib/stores/useLoginDrawerStore";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

const Banner = () => {
  const router = useRouter();
  const { isLoggedIn } = useAuthStore();
  const { open } = useLoginDrawerStore();

  return (
    <div className="w-full relative ">
      <div className="bg-secondary-black flex-col md:flex-row min-h-52 relative rounded-4xl border border-error-500/30 shadow-card w-full p-9 flex justify-between items-center">
        <div className="flex flex-col justify-center gap-8">
          <h1 className="text-right flex flex-col gap-4 font-bold text-3xl bg-linear-to-r from-white from-30% to-zinc-600 bg-clip-text text-transparent">
            اگر عاشق یکی از شاخه‌های هنری هستی،
            <br />
            <span className="text-xl">
              {" "}
              فرم رو پر کن و شانست رو برای ورود به دنیای حرفه‌ای هنر امتحان کن.
            </span>
          </h1>
          <Button
            leftIcon={<ChevronLeft />}
            size="small"
            className="bg-error-500 rounded-full!"
            onClick={
              isLoggedIn ? () => router.push("/artist-registration") : open
            }
          >
            ثبت‌ نام هنرمند
          </Button>
        </div>
        <div className="h-42 md:h-auto">
          <Image
            src={"./camera-1.svg"}
            alt="camera-1"
            className="absolute bottom-0 left-0 md:left-10"
            width={385}
            height={428}
          />
        </div>
        <Image
          src={"./film-1.svg"}
          alt="camera-1"
          className="absolute hidden md:block -bottom-16 right-10"
          width={102}
          height={105}
        />
        <Image
          src={"./action-1.svg"}
          alt="camera-1"
          className="absolute hidden md:block -top-28 left-10"
          width={169}
          height={162}
        />
      </div>
    </div>
  );
};

export default Banner;
