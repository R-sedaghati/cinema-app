"use client";

import { useEffect, useMemo, useState } from "react";
import { notFound, useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "@dgshahr/ui-kit";
import { Loader2, MoveRight } from "lucide-react";
import clsx from "clsx";
import { isDesktop } from "react-device-detect";
import Button from "@/components/common/Button";
import FormAnswersSummary from "@/components/artist-registration/FormAnswersSummary";
import ArtistStatus from "@/components/admin/artist-registration/ArtistStatus";
import {
  useOwnArtistRequest,
  useUserCategoryFormSchema,
} from "@/lib/services/landing/hook";
import useAuthStore from "@/lib/stores/useAuthStore";
import useLoginDrawerStore from "@/lib/stores/useLoginDrawerStore";
import { useFormCopy } from "@/lib/hooks/useFormCopy";
import { useLandingCopy } from "@/lib/hooks/useLandingCopy";
import convertGregorianTimeToShamsiTime from "@/lib/utils/convertGregorianTimeToShamsiTime";
import { groupPortfolios } from "@/lib/utils/portfolioAnswers";

/**
 * Read-only view of a request the caller submitted, at any status. The public artist page
 * only exists once a request is approved, and it hides the identity answers — this is the
 * owner's own copy.
 */
export default function ArtistRequestViewPage() {
  const params = useParams();
  const router = useRouter();
  const raw = Array.isArray(params.id) ? params.id[0] : params.id;
  const id = Number(raw);

  if (!raw || !Number.isInteger(id) || id <= 0) notFound();

  const copy = useFormCopy();
  const landingCopy = useLandingCopy();

  const { accessToken } = useAuthStore();
  const { open: openLoginDrawer } = useLoginDrawerStore();

  // The token is persisted, so it is empty until zustand rehydrates — gating before that
  // flashes the sign-in card at users who are in fact logged in.
  const [isAuthReady, setIsAuthReady] = useState(false);
  useEffect(() => setIsAuthReady(true), []);
  const isSignedOut = isAuthReady && !accessToken;

  useEffect(() => {
    if (isSignedOut) openLoginDrawer();
  }, [isSignedOut, openLoginDrawer]);

  const { data, isLoading, isError } = useOwnArtistRequest(id || undefined);
  const request = data?.result;

  const { data: schemaData, isLoading: isSchemaLoading } =
    useUserCategoryFormSchema(request?.categories?.[0]?.id);

  const steps = useMemo(
    () => [...(schemaData?.result?.steps ?? [])].sort((a, b) => a.order - b.order),
    [schemaData],
  );

  const { answers: portfolioAnswers, urlByPath } = useMemo(
    () => groupPortfolios(request?.portfolios),
    [request],
  );

  const answers = useMemo(
    () => ({ ...portfolioAnswers, ...(request?.answers ?? {}) }),
    [portfolioAnswers, request],
  );

  if (isSignedOut) {
    return (
      <div className="flex justify-center py-16 md:py-24">
        <Card
          wrapperClassName={clsx("w-[90%]", isDesktop && "w-1/2")}
          className="py-10 px-4 md:px-8"
        >
          <div className="flex flex-col gap-5 items-center text-center">
            <p className="font-h4-bold">{landingCopy("regAuthGateTitle")}</p>
            <p className="font-p1-regular text-gray-600">
              {landingCopy("regAuthGateDesc")}
            </p>
            <Button className="rounded-full!" onClick={openLoginDrawer}>
              {landingCopy("regAuthGateCta")}
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (!isAuthReady || isLoading || (request && isSchemaLoading)) {
    return (
      <div className="flex justify-center items-center py-24">
        <Loader2 className="animate-spin text-error-500" size={40} />
      </div>
    );
  }

  if (isError || !request) {
    return (
      <div className="flex justify-center py-16 md:py-24">
        <Card
          wrapperClassName={clsx("w-[90%]", isDesktop && "w-1/2")}
          className="py-10 px-4 md:px-8"
        >
          <div className="flex flex-col gap-5 items-center text-center">
            <p className="font-h5-bold">{landingCopy("profileFormsEmpty")}</p>
            <Button className="rounded-full!" onClick={() => router.push("/profile")}>
              {landingCopy("callSuccessCta")}
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <div className={clsx("mx-auto mb-3 w-[90%]", isDesktop && "w-4/5")}>
        <Link
          href="/profile"
          className="inline-flex items-center gap-1 text-sm text-zinc-400 hover:text-zinc-200"
        >
          <MoveRight size={18} />
          {landingCopy("callSuccessCta")}
        </Link>
      </div>

      <div className="flex justify-center">
        <Card
          wrapperClassName={clsx("w-[95%]", isDesktop && "w-3/4")}
          className="pt-10 px-4 md:px-6"
        >
          <div className="flex flex-col gap-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-col gap-1">
                <p className="font-h5-bold">
                  {landingCopy("profileFormViewTitle")}
                </p>
                <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500">
                  {request.trackingCode && (
                    <span>
                      {landingCopy("profileFormsTracking")} {request.trackingCode}
                    </span>
                  )}
                  {request.createdAt && (
                    <span>
                      {convertGregorianTimeToShamsiTime(request.createdAt)}
                    </span>
                  )}
                </div>
              </div>

              <ArtistStatus status={request.status} isSolid />
            </div>

            <FormAnswersSummary
              steps={steps}
              answers={answers}
              copy={copy}
              portfolioUrls={urlByPath}
            />

            <div className="flex justify-end pb-6">
              <Button
                className="rounded-full!"
                onClick={() => router.push(`/artist-registration/${id}`)}
              >
                {landingCopy("profileFormEdit")}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
