"use client";

import { useEffect, useMemo } from "react";
import { Card } from "@dgshahr/ui-kit";
import { MoveLeft, MoveRight, Loader2 } from "lucide-react";
import Link from "next/link";
import AtristRegistrationFlow from "@/components/artist-registration/AtristRegistrationFlow";
import { mobileSplitPattern, splitPattern } from "@/lib/utils/split-pattern";
import { useArtistRegistrationStore } from "@/lib/stores/useUserArtist";
import {
  useUserArtistDetail,
  useUserAtristRequests,
  useUserCategoryList,
} from "@/lib/services/landing/hook";
import clsx from "clsx";
import { isDesktop, isMobile } from "react-device-detect";
import { defaultCopy } from "@/lib/utils/formCopy";

export interface SelectedCategory {
  id: number;
  title: string;
}

export default function ArtistRegistrationPageContent({ editId }: { editId: number | null }) {
  const { data: categoryData, isLoading: isCategoryLoading } = useUserCategoryList({
    page: 1,
    count: 30,
  });

  // Each account fills a given form once, so a category already registered in is shown
  // but not selectable. The backend enforces the same rule on submit.
  const { data: ownRequests } = useUserAtristRequests({ page: 1, count: 100 });

  const registeredCategoryIds = useMemo(
    () =>
      new Set(
        (ownRequests?.result ?? []).flatMap((request) =>
          request.categories.map((c) => c.id),
        ),
      ),
    [ownRequests],
  );

  const topLevelCategories = useMemo(
    () =>
      (categoryData?.result ?? []).map((c) => ({
        id: c.id,
        title: c.faName,
        // A request filed under a child category occupies its parent's form too.
        isRegistered:
          registeredCategoryIds.has(c.id) ||
          (c.children ?? []).some((child) => registeredCategoryIds.has(child.id)),
      })),
    [categoryData, registeredCategoryIds],
  );

  const rows = isMobile
    ? mobileSplitPattern(topLevelCategories)
    : splitPattern(topLevelCategories);

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

    // Merge legacy portfolio rows (grouped by the schema field they were
    // submitted under) back into answers so IMAGE/VIDEO fields hydrate
    // like any other dynamic field.
    const portfolioAnswers: Record<string, string | string[]> = {};
    for (const p of r.portfolios ?? []) {
      if (!p.fieldKey) continue;
      const existing = portfolioAnswers[p.fieldKey];
      if (existing === undefined) {
        portfolioAnswers[p.fieldKey] = p.filePath;
      } else if (Array.isArray(existing)) {
        existing.push(p.filePath);
      } else {
        portfolioAnswers[p.fieldKey] = [existing, p.filePath];
      }
    }

    setField("answers", { ...portfolioAnswers, ...(r.answers ?? {}) });

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
      <div className={clsx("mx-auto mb-3 w-[90%]", isDesktop && "w-4/5")}>
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-zinc-400 hover:text-zinc-200"
        >
          <MoveRight size={18} />
          {defaultCopy("backHome")}
        </Link>
      </div>

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
              {defaultCopy("categoryPrompt")}
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
                      disabled={item.isRegistered}
                      className={clsx(
                        "md:w-60 overflow-hidden w-32.5 h-20 relative px-4 pb-6 md:pb-0 md:pt-3 bg-zinc-900 rounded-2xl flex items-center gap-4 md:gap-0 md:justify-between border border-transparent",
                        item.isRegistered
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:border-red-900 cursor-pointer",
                      )}
                    >
                      <div className="flex flex-col items-start gap-1 z-10">
                        <p className="text-nowrap text-sm md:text-base">
                          {item.title}
                        </p>
                        {item.isRegistered && (
                          <span className="text-[10px] md:text-xs text-zinc-400">
                            {defaultCopy("alreadyRegistered")}
                          </span>
                        )}
                      </div>

                      {!item.isRegistered && <MoveLeft className="text-error-500 z-10" />}
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
