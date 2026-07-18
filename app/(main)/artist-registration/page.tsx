"use client";

import { Suspense, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Card } from "@dgshahr/ui-kit";
import { MoveLeft, Loader2 } from "lucide-react";
import AtristRegistrationFlow from "@/components/artist-registration/AtristRegistrationFlow";
import { mobileSplitPattern, splitPattern } from "@/lib/utils/split-pattern";
import { useArtistRegistrationStore } from "@/lib/stores/useUserArtist";
import { useUserArtistDetail, useUserCategoryList } from "@/lib/services/landing/hook";
import clsx from "clsx";
import { isDesktop, isMobile } from "react-device-detect";

export interface SelectedCategory {
  id: number;
  title: string;
}

function ArtistRegistrationPageContent() {
  const { data: categoryData, isLoading: isCategoryLoading } = useUserCategoryList({
    page: 1,
    count: 30,
  });

  const topLevelCategories = useMemo(
    () => (categoryData?.result ?? []).map((c) => ({ id: c.id, title: c.faName })),
    [categoryData],
  );

  const rows = isMobile
    ? mobileSplitPattern(topLevelCategories)
    : splitPattern(topLevelCategories);
  const searchParams = useSearchParams();
  const editIdParam = searchParams.get("editId");
  const editId = editIdParam ? Number(editIdParam) : null;

  const {
    step,
    setStep,
    selectedCategoryId,
    selectedCategoryTitle,
    setSelectedCategory,
    handleNext,
    setField,
    reset,
  } = useArtistRegistrationStore();

  const selectedCategory: SelectedCategory | null =
    selectedCategoryId === null
      ? null
      : { id: selectedCategoryId, title: selectedCategoryTitle };

  const { data: editData, isLoading: editLoading } = useUserArtistDetail(editId ?? undefined);

  useEffect(() => {
    if (!editId || !editData?.result) return;
    const r = editData.result;

    reset();
    setField("editId", editId);
    setField(
      "categoryId",
      r.categories.map((c) => c.id),
    );
    setField("answers", r.answers ?? {});
    setField(
      "portfolios",
      r.portfolios.map((p) => ({ path: p.filePath, type: p.type })),
    );

    const cat = r.categories[0];
    if (cat) {
      setSelectedCategory(cat.id, cat.faName);
      setStep(1);
    }
  }, [editData, editId]);

  const handleSelectCategory = (id: number, title: string) => {
    reset();
    setField("categoryId", [id]);
    setSelectedCategory(id, title);
    setStep(1);
  };

  const handlePrevious = () => {
    if (step === 1 && !editId) {
      reset();
    } else {
      setStep(step - 1);
    }
  };

  if ((editId && editLoading) || (step === 0 && isCategoryLoading)) {
    return (
      <div className="flex justify-center items-center py-24">
        <Loader2 className="animate-spin text-error-500" size={40} />
      </div>
    );
  }

  return (
    <div className='mt-4'>
      {step === 0 && !editId && (
        <Card
          wrapperClassName={clsx(
            "w-[90%] mx-auto mt-4",
            isDesktop && "w-4/5 mt-0",
          )}
          className={clsx("p-4", isDesktop && "p-6!")}
        >
          <div className="flex flex-col gap-3 items-center">
            <p className={clsx("font-h4-bold", isDesktop && "font-h3-bold")}>
              لطفاً زمینه فعالیت خود را مشخص نمایید:
            </p>

            <div className="flex flex-col gap-4">
              {rows.map((row) => (
                <div
                  key={row.map((r) => r.id).join("-")}
                  className="flex flex-wrap justify-center gap-4"
                >
                  {row.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleSelectCategory(item.id, item.title)}
                      className="md:w-60 overflow-hidden w-32.5 h-20 relative px-4 pb-6 md:pb-0 md:pt-3 bg-zinc-900 rounded-2xl flex items-center gap-4 md:gap-0 md:justify-between border border-transparent hover:border-red-900 cursor-pointer"
                    >
                      <p className="text-nowrap text-sm md:text-base z-10">
                        {item.title}
                      </p>

                      <MoveLeft className="text-error-500 z-10" />
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
    </div>
  );
}

export default function ArtistRegistrationPage() {
  return (
    <Suspense fallback={null}>
      <ArtistRegistrationPageContent />
    </Suspense>
  );
}
