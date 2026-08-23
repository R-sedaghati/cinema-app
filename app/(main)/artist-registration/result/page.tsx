"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card } from "@dgshahr/ui-kit";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import Button from "@/components/common/Button";
import { useUserCategoryFormSchema } from "@/lib/services/landing/hook";
import { useArtistRegistrationStore } from "@/lib/stores/useUserArtist";
import { isMobile } from "react-device-detect";
import clsx from "clsx";
import { makeCopy } from "@/lib/utils/formCopy";
import { useLandingCopy } from "@/lib/hooks/useLandingCopy";

function ResultContent() {
  const params = useSearchParams();
  const router = useRouter();
  const reset = useArtistRegistrationStore((state) => state.reset);
  const landingCopy = useLandingCopy();

  // ponytail: fallbacks, so a category with no copy set still shows a sane page
  const DEFAULTS = {
    success: {
      title: landingCopy("regResultSuccessTitle"),
      description: landingCopy("regResultSuccessDesc"),
    },
    failed: {
      title: landingCopy("regResultFailTitle"),
      description: landingCopy("regResultFailDesc"),
    },
  };

  const isSuccess = params.get("status") === "success";
  const categoryId = Number(params.get("categoryId")) || null;

  const { data, isLoading } = useUserCategoryFormSchema(categoryId);
  const schema = data?.result;

  useEffect(() => {
    if (isSuccess) reset();
  }, [isSuccess, reset]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-24">
        <Loader2 className="animate-spin text-error-500" size={40} />
      </div>
    );
  }

  const copy = makeCopy(schema?.formCopy);

  const title =
    (isSuccess ? schema?.successTitle : schema?.failTitle) ||
    DEFAULTS[isSuccess ? "success" : "failed"].title;
  const description =
    (isSuccess ? schema?.successDescription : schema?.failDescription) ||
    DEFAULTS[isSuccess ? "success" : "failed"].description;

  return (
    <div className="flex justify-center py-10 md:py-20">
      <Card wrapperClassName={isMobile ? "w-[95%]" : "w-1/2"} className="py-10 px-4 md:px-8">
        <div className="flex flex-col gap-5 items-center text-center">
          {isSuccess ? (
            <CheckCircle2 className="text-success-500" size={64} />
          ) : (
            <XCircle className="text-error-500" size={64} />
          )}

          <p className="font-h4-bold">{title}</p>
          <p className="font-p1-regular text-gray-600 whitespace-pre-line">{description}</p>

          <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto mt-3">
            <Button
              className={clsx("rounded-full!", !isMobile && "px-10")}
              isFullWidth={isMobile}
              onClick={() => router.push(isSuccess ? "/profile" : "/artist-registration")}
            >
              {isSuccess ? copy("successCta") : copy("failCta")}
            </Button>
            <Button
              variant="outline"
              className={clsx("rounded-full!", !isMobile && "px-10")}
              isFullWidth={isMobile}
              onClick={() => router.push("/")}
            >
              {copy("homeCta")}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default function ArtistRegistrationResultPage() {
  return (
    <Suspense>
      <ResultContent />
    </Suspense>
  );
}
