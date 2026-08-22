"use client";

import Button from "@/components/common/Button";
import { useLandingCopy } from "@/lib/hooks/useLandingCopy";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const StatisticsSection = () => {
  const router = useRouter();
  const copy = useLandingCopy();

  const statisticsItems = [1, 2, 3, 4].map((n) => ({
    id: n,
    value: copy(`stat${n}Value` as "stat1Value"),
    title: copy(`stat${n}Label` as "stat1Label"),
  }));

  return (
    <div className="flex relative flex-col md:flex-row gap-10 justify-between items-center">
      <div className="flex flex-1 flex-col gap-8 text-zinc-100">
        <h5 className="font-h1-bold text-[32px] whitespace-pre-line">
          {copy("statsTitle")}
        </h5>
        <h6 className="font-medium text-xl whitespace-pre-line">
          {copy("statsSubtitle")}
        </h6>
        <Button
          onClick={() => router.push("/artists")}
          leftIcon={<ChevronLeft />}
          size="small"
          className="bg-error-500 rounded-full!"
        >
          {copy("statsCta")}
        </Button>
      </div>
      <div className="flex-1 place-items-center gap-16 grid grid-cols-2 grid-rows-2">
        {statisticsItems.map((item) => (
          <div key={item.id}>
            {/* ponytail: the sign used to be its own coloured span; a single
                highlight regex keeps that look while the whole value stays editable */}
            <div className="text-6xl font-extrabold">
              {item.value
                .split(/([%٪+])/)
                .map((part, index) =>
                  /[%٪+]/.test(part) ? (
                    <span key={index} className="text-error-500">
                      {part}
                    </span>
                  ) : (
                    part
                  ),
                )}
            </div>
            <p className="font-medium text-xl">{item.title}</p>
          </div>
        ))}
      </div>

      <div
        className="w-170 h-170 rounded-full absolute opacity-20 -top-44 -right-96 -z-1
        bg-radial-primary"
      />
      <div
        className="w-170 h-170 rounded-full absolute opacity-20 -top-100 -left-110 -z-1
        bg-radial-primary"
      />
    </div>
  );
};

export default StatisticsSection;
