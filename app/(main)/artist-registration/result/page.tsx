"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card } from "@dgshahr/ui-kit";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import Button from "@/components/common/Button";
import {
  useUpdateUserArtistRequest,
  useUserCreateArtistRequest,
} from "@/lib/services/landing/hook";
import { useArtistRegistrationStore } from "@/lib/stores/useUserArtist";
import { isMobile } from "react-device-detect";
import clsx from "clsx";
import { useFormCopy } from "@/lib/hooks/useFormCopy";
import { paymentHref, subscriptionHref } from "@/lib/services/landing/api";
import { clearSubscriptionDraft, loadSubscriptionDraft } from "@/lib/utils/subscriptionDraft";

function ResultContent() {
  const params = useSearchParams();
  const router = useRouter();
  const reset = useArtistRegistrationStore((state) => state.reset);
  const copy = useFormCopy();

  const paid = params.get("status") === "success";
  const isSubscription = params.get("kind") === "subscription";
  const categoryId = Number(params.get("categoryId")) || null;
  const requestId = Number(params.get("requestId")) || null;

  // After a subscription payment, the form kept in localStorage before the gateway is
  // submitted here; a failed submit shows the server's message on the fail layout.
  const { mutate: create } = useUserCreateArtistRequest();
  const { mutate: update } = useUpdateUserArtistRequest();
  const [draftState, setDraftState] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [draftError, setDraftError] = useState<string | null>(null);

  useEffect(() => {
    if (!paid || !isSubscription || draftState !== "idle") return;
    const draft = loadSubscriptionDraft();
    if (!draft) return setDraftState("done");

    setDraftState("submitting");
    const { editId, ...payload } = draft;
    const handlers = {
      onSuccess: () => {
        clearSubscriptionDraft();
        setDraftState("done");
      },
      onError: (error: { response?: { status?: number; data?: unknown } }) => {
        // A server answer (duplicate form, validation) will not change on retry, so the
        // draft goes; a network failure keeps it for the retry button.
        if (error.response) clearSubscriptionDraft();
        setDraftError((error.response?.data as { message?: string } | undefined)?.message ?? null);
        setDraftState("error");
      },
    };
    if (editId) update({ id: editId, ...payload }, handlers);
    else create(payload, handlers);
  }, [paid, isSubscription, draftState, create, update]);

  const isSuccess = paid && draftState !== "error";
  // Stays true until the browser leaves for the gateway, so a second click cannot start
  // a second payment.
  const [isRetrying, setIsRetrying] = useState(false);

  // Subscription: the draft is still in localStorage, so paying again needs no refill.
  // Legacy: the request is still PENDING_PAYMENT. Neither → back to the form.
  const retryPayment = () => {
    if (paid && draftState === "error") {
      // Paid, but the form did not go through: resubmit if the draft survived, else refill.
      return loadSubscriptionDraft() ? setDraftState("idle") : router.push("/artist-registration");
    }
    if (!isSubscription && !requestId) return router.push("/artist-registration");

    setIsRetrying(true);
    (isSubscription ? subscriptionHref(categoryId) : paymentHref(requestId!, categoryId))
      .then((href) => {
        window.location.href = href;
      })
      // landingApi's interceptor already toasts the failure.
      .catch(() => setIsRetrying(false));
  };

  useEffect(() => {
    if (isSuccess) reset();
  }, [isSuccess, reset]);

  if (draftState === "submitting" || (paid && isSubscription && draftState === "idle")) {
    return (
      <div className="flex justify-center items-center py-24">
        <Loader2 className="animate-spin text-error-500" size={40} />
      </div>
    );
  }

  const page = !isSuccess ? "Fail" : params.get("kind") === "free" ? "Submit" : "Paid";
  const title = copy(`result${page}Title`);
  const description = (paid && draftState === "error" && draftError) || copy(`result${page}Desc`);

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
              onClick={() => (isSuccess ? router.push("/profile") : retryPayment())}
              isLoading={isRetrying}
              disabled={isRetrying}
            >
              {isSuccess ? copy("successCta") : copy("failCta")}
            </Button>
            <Button
              variant="outline"
              className={clsx("rounded-full!", !isMobile && "px-10")}
              isFullWidth={isMobile}
              onClick={() => router.push("/")}
            >
              <span style={copy.style("homeCta")}>{copy("homeCta")}</span>
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
