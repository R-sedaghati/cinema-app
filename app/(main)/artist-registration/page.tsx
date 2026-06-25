"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { Card } from "@dgshahr/ui-kit";
import { MoveLeft } from "lucide-react";
import AtristRegistrationFlow from "@/components/artist-registration/AtristRegistrationFlow";
import { artistCategories } from "@/lib/mock/artists";
import { splitPattern } from "@/lib/utils/split-pattern";
import { Gender, useArtistRegistrationStore } from "@/lib/stores/useUserArtist";
import { useUserArtistDetail } from "@/lib/services/landing/hook";

export interface SelectedCategory {
  id: number;
  title: string;
}

export default function ArtistRegistrationPage() {
  const rows = splitPattern(artistCategories);
  const searchParams = useSearchParams();
  const editIdParam = searchParams.get("editId");
  const editId = editIdParam ? Number(editIdParam) : null;

  const [step, setStep] = useState(0);
  const [selectedCategory, setSelectedCategory] =
    useState<SelectedCategory | null>(null);

  const { setField, reset } = useArtistRegistrationStore();

  const { data: editData } = useUserArtistDetail(editId ?? undefined);

  useEffect(() => {
    if (!editId || !editData?.result) return;
    const r = editData.result;

    reset();
    setField("editId", editId);
    setField("categoryId", r.categories.map((c) => c.id));
    setField("firstName", r.user.firstName ?? "");
    setField("lastName", r.user.lastName ?? "");
    setField("height", r.user.height);
    setField("weight", r.user.weight);
    setField("language", r.user.language ?? "");
    setField("dialect", r.user.dialect ?? "");
    setField("email", r.user.email ?? "");
    setField("address", r.user.address ?? "");
    setField("province", r.user.province ?? "");
    setField("city", r.user.city ?? "");
    setField("postalCode", r.user.postalCode ?? "");
    setField("education", r.user.education ?? "");
    setField("major", r.user.major ?? "");
    setField("avatar", r.user.avatar ?? "");
    setField("aboutMe", r.user.aboutMe ?? "");
    if (r.user.gender) setField("gender", r.user.gender as Gender);
    setField(
      "portfolios",
      r.portfolios.map((p) => ({ path: p.filePath, type: p.type })),
    );

    const cat = r.categories[0];
    if (cat) {
      setSelectedCategory({ id: cat.id, title: cat.faName });
      setStep(1);
    }
  }, [editData, editId]);

  const handleSelectCategory = (id: number, title: string) => {
    reset();
    setField("categoryId", [id]);
    setSelectedCategory({ id, title });
    setStep(1);
  };

  const handleNext = () => {
    setStep((prev) => prev + 1);
  };

  const handlePrevious = () => {
    if (step === 1 && !editId) {
      setStep(0);
      setSelectedCategory(null);
      reset();
    } else {
      setStep((prev) => prev - 1);
    }
  };

  return (
    <>
      {step === 0 && !editId && (
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
