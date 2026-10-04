"use client";

import convertEnNumberToFaNumberWithSeparation from "@/lib/utils/convertEnNumberToFaNumberWithSeparation";
import { Card } from "@dgshahr/ui-kit";
import Button from "../common/Button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useArtistRegistrationStore } from "@/lib/stores/useUserArtist";
import {
  useUpdateUserArtistRequest,
  useUserCreateArtistRequest,
} from "@/lib/services/landing/hook";
import { EFormFieldType, IFormStep } from "@/lib/services/admin/type";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import { isDesktop, isMobile } from "react-device-detect";
import clsx from "clsx";
import { CopyFn } from "@/lib/utils/formCopy";
import { getStepErrors } from "@/lib/utils/validateFormStep";
import { subscriptionHref } from "@/lib/services/landing/api";
import { saveSubscriptionDraft } from "@/lib/utils/subscriptionDraft";
import FormAnswersSummary from "./FormAnswersSummary";

interface Props {
  steps: IFormStep[];
  copy: CopyFn;
  /** Yearly subscription price, resolved server-side. 0 means subscribed (or free): submit directly. */
  registrationAmount?: number;
  onNext: () => void;
  onPrevious: () => void;
  /** Jump back to the first step that failed validation. */
  onGoToStep: (step: number) => void;
}

const FourthStepFlow: React.FC<Props> = ({
  steps,
  copy,
  registrationAmount,
  onPrevious,
  onGoToStep,
}) => {
  const store = useArtistRegistrationStore();
  // 0 is a real answer — already subscribed, or the subscription is free — so it must
  // not be conflated with `undefined`, which means "not loaded yet".
  const isFree = registrationAmount === 0;
  const router = useRouter();
  const { mutate: create, isPending: isCreating } =
    useUserCreateArtistRequest();
  const { mutate: update, isPending: isUpdating } =
    useUpdateUserArtistRequest();
  // Stays true until the browser leaves the page: the mutation is done but the purchase
  // call and the redirect are not, and an un-disabled button here means a second request.
  const [isRedirecting, setIsRedirecting] = useState(false);
  const isPending = isCreating || isUpdating || isRedirecting;

  const portfolios = steps
    .flatMap((step) => step.fields)
    .filter((field) => field.type === EFormFieldType.IMAGE || field.type === EFormFieldType.VIDEO)
    .flatMap((field) => {
      const value = store.answers[field.key];
      const paths = Array.isArray(value) ? value : value ? [value] : [];
      return (paths as string[]).map((path) => ({
        path,
        type: field.type as "IMAGE" | "VIDEO",
        fieldKey: field.key,
      }));
    });

  const formPayload = {
    categoryIds: store.categoryId,
    answers: store.answers,
    portfolios: portfolios.length ? portfolios : undefined,
  };

  // Pay first, then save: the answers wait in localStorage while the browser is at the
  // gateway, and the result page submits them once the subscription has settled.
  // The purchase call goes over XHR because it needs the Authorization header.
  const buySubscription = () => {
    setIsRedirecting(true);
    const categoryId = store.categoryId[0] ?? "";
    saveSubscriptionDraft({ editId: store.editId, ...formPayload });

    return subscriptionHref(categoryId)
      .then((href) => {
        // Only safe once the navigation is certain: resetting earlier unmounts the flow
        // while this call is still in flight.
        store.reset();
        window.location.href = href;
      })
      // landingApi's interceptor already toasts the failure.
      .catch(() => setIsRedirecting(false));
  };

  const handleSubmit = () => {
    // Per-step validation only runs on Next, so a deep link that lands straight on this
    // screen would otherwise submit — and charge for — an empty form.
    const firstInvalid = steps.findIndex(
      (step) => getStepErrors(step, store.answers, copy).length > 0,
    );

    if (firstInvalid !== -1) {
      toast.error(getStepErrors(steps[firstInvalid], store.answers, copy)[0]);
      onGoToStep(firstInvalid + 1);
      return;
    }

    if (store.editId) {
      update(
        { id: store.editId, ...formPayload },
        {
          onSuccess: () => {
            store.reset();
            toast.success(copy("editSuccessToast"));
            router.push("/profile");
          },
          onError: (error) => {
            // 402 = a revision resubmitted after the subscription lapsed: renew, then
            // the result page sends these same edits.
            if (error.response?.status === 402) return void buySubscription();
            toast.error(copy("editErrorToast"));
          },
        },
      );
      return;
    }

    // Always ask the server first, even when the page still shows a price: the amount may
    // be stale (subscribed in another tab, or just paid), and the server answers 402 when
    // the subscription really is missing — that is the only case that goes to the gateway.
    create(formPayload, {
      onSuccess: () => {
        const categoryId = store.categoryId[0] ?? "";
        store.reset();
        router.push(`/artist-registration/result?status=success&kind=free&categoryId=${categoryId}`);
      },
      onError: (error) => {
        // 402 = the subscription lapsed since the form loaded; buy it, then submit.
        if (error.response?.status === 402) return void buySubscription();

        // 409 = this account already filled this category's form. The server owns the
        // rule, so its message wins; the copy key is the fallback.
        const message = (error.response?.data as { message?: string } | undefined)
          ?.message;

        toast.error(
          message ??
            (error.response?.status === 409
              ? copy("duplicateErrorToast")
              : copy("editErrorToast")),
        );
      },
    });
  };

  return (
    <Card
      wrapperClassName={isMobile ? "w-[95%]" : "w-3/4"}
      size={isMobile ? "small" : "medium"}
      className={clsx("pt-8 px-(--form-pad)! pb-(--form-pad)!", isDesktop && "pt-16")}
    >
      <div className="flex flex-col gap-6 md:gap-10">
        <FormAnswersSummary
          steps={steps}
          answers={store.answers}
          copy={copy}
          portfolioUrls={store.portfolioUrls}
        />

        {!store.editId && (
          <div className="flex flex-col gap-3 md:gap-0 md:flex-row justify-between items-center">
            <div className="flex flex-col gap-3">
              <div className="flex gap-2 items-center">
                <div className="w-1 h-6 bg-error-500" />
                <p className="font-h5-bold">
                  {isFree ? copy("paymentFreeTitle") : copy("paymentTitle")}
                </p>
              </div>
              {!isFree && <p className="font-p2-regular"><span style={copy.style("paymentNote")}>{copy("paymentNote")}</span></p>}
            </div>
            <Card wrapperClassName="w-full md:w-1/3" size={isMobile ? "small" : "medium"}>
              <div className="flex justify-between items-center">
                <p className="font-p2-medium"><span style={copy.style("amountLabel")}>{copy("amountLabel")}</span></p>
                {isFree ? (
                  <p className="font-p2-medium"><span style={copy.style("labelFree")}>{copy("labelFree")}</span></p>
                ) : (
                  <div className="flex gap-1">
                    <p className="font-p2-medium">
                      {registrationAmount === undefined
                        ? "—"
                        : convertEnNumberToFaNumberWithSeparation(
                            registrationAmount,
                          )}
                    </p>
                    <p className="font-p2-medium"><span style={copy.style("currency")}>{copy("currency")}</span></p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}

        {store.editId && (
          <div className="flex gap-2 items-center">
            <div className="w-1 h-6 bg-error-500" />
            <p className="font-h5-bold"><span style={copy.style("reviewTitle")}>{copy("reviewTitle")}</span></p>
          </div>
        )}

        <div className="flex justify-end gap-3 mt-5">
          <Button
            variant="outline"
            rightIcon={<ChevronRight />}
            className={clsx("rounded-full!", isDesktop && "px-10")}
            onClick={onPrevious}
            isFullWidth={isMobile}
            size={isMobile ? "small" : "medium"}
          >
            <span style={copy.style("prevLabel")}>{copy("prevLabel")}</span>
          </Button>

          <Button
            leftIcon={<ChevronLeft />}
            className={clsx("rounded-full!", isDesktop && "px-10")}
            onClick={handleSubmit}
            isLoading={isPending}
            isFullWidth={isMobile}
            size={isMobile ? "small" : "medium"}
            disabled={isPending}
          >
            {store.editId
              ? copy("editSubmitLabel")
              : isFree
                ? copy("freeSubmitLabel")
                : copy("submitLabel")}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default FourthStepFlow;
