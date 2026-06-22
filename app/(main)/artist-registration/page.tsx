"use client";

import { useState } from "react";
import Image from "next/image";
import { Card } from "@dgshahr/ui-kit";
import { MoveLeft } from "lucide-react";
import AtristRegistrationFlow from "@/components/artist-registration/AtristRegistrationFlow";
import { artistCategories } from "@/lib/mock/artists";
import { splitPattern } from "@/lib/utils/split-pattern";

export interface SelectedCategory {
  id: number;
  title: string;
}

export default function ArtistRegistrationPage() {
  const rows = splitPattern(artistCategories);

  const [step, setStep] = useState(0);
  const [selectedCategory, setSelectedCategory] =
    useState<SelectedCategory | null>(null);

  const handleSelectCategory = (id: number, title: string) => {
    setSelectedCategory({ id, title });
    setStep(1);
  };

  const handleNext = () => {
    setStep((prev) => prev + 1);
  };

  const handlePrevious = () => {
    if (step === 1) {
      setStep(0);
      setSelectedCategory(null);
    } else {
      setStep((prev) => prev - 1);
    }
  };

  return (
    <>
      {step === 0 && (
        <Card wrapperClassName="w-4/5 mx-auto">
          <div className="flex flex-col gap-3 items-center">
            <p className="font-h3-bold">
              لطفاً زمینه فعالیت خود را مشخص نمایید:
            </p>

            <div className="flex flex-col gap-4">
              {rows.map((row, rowIndex) => (
                <div
                  key={rowIndex}
                  className="flex flex-wrap justify-center gap-4"
                >
                  {row.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleSelectCategory(item.id, item.title)}
                      className="md:w-60 overflow-hidden w-36 h-20 relative px-4 pb-6 md:pb-0 md:pt-3 bg-zinc-900 rounded-2xl flex items-center gap-4 md:gap-0 md:justify-between border border-transparent hover:border-red-900 cursor-pointer"
                    >
                      <p className="text-nowrap text-sm md:text-base z-10">
                        {item.title}
                      </p>

                      <MoveLeft className="text-error-500 z-10" />

                      <Image
                        src={item.image}
                        width={90}
                        height={90}
                        alt={item.title}
                        className="absolute md:relative left-3 md:left-0 bottom-0 z-0 w-12.5 h-12.5 md:w-auto md:h-auto"
                      />
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {step >= 1 && selectedCategory && (
        <AtristRegistrationFlow
          category={selectedCategory}
          flowStep={step - 1}
          onNext={handleNext}
          onPrevious={handlePrevious}
        />
      )}
    </>
  );
}
