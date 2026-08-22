"use client";

import Button from "@/components/common/Button";
import useLoginDrawerStore from "@/lib/stores/useLoginDrawerStore";
import { useLandingCopy } from "@/lib/hooks/useLandingCopy";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const MainHeader = () => {
  const router = useRouter();
  const { open } = useLoginDrawerStore();
  const copy = useLandingCopy();

  return (
    <div className="flex items-center flex-col mt-10 space-y-4">
      <h1 className="text-5xl text-center leading-16 font-h1-regular whitespace-pre-line bg-linear-to-r from-white from-30%  to-zinc-700 bg-clip-text text-transparent">
        {copy("heroTitle")}
      </h1>
      <p className="text-center whitespace-pre-line">{copy("heroSubtitle")}</p>
      <div className="flex gap-2">
        <Button
          onClick={open}
          variant="outline"
          size="small"
          className="rounded-full!"
        >
          {copy("heroPrimaryCta")}
        </Button>
        <Button
          onClick={() => router.push("/artists")}
          leftIcon={<ChevronLeft />}
          size="small"
          className="bg-error-500 rounded-full!"
        >
          {copy("heroSecondaryCta")}
        </Button>
      </div>
    </div>
  );
};

export default MainHeader;
