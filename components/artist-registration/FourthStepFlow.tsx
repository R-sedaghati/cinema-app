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
import { userPurchase } from "@/lib/services/landing/api";
import FormAnswersSummary from "./FormAnswersSummary";

interface Props {
  steps: IFormStep[];
  copy: CopyFn;
  /** Resolved server-side from the category. 0 means registration is free here. */
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
  // Resolved server-side from the category. 0 is a real answer — the category is free —
  // so it must not be conflated with `undefined`, which means "not loaded yet".
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

  // The purchase endpoint needs the Authorization header, which a plain
  // `window.location.href` navigation cannot carry — so ask for the gateway URL over
  // XHR (the axios instance injects the token) and navigate to whatever comes back.
  const startPayment = (requestId: number) => {
    setIsRedirecting(true);
    // Read before the reset below, so the fallback URL does not depend on when the
    // store is cleared.
    const categoryId = store.categoryId[0] ?? "";

    return userPurchase(requestId)
      .then(({ result }) => {
        // No redirectUrl means the server already settled it — a free category, or the
        // wallet covered the fee — so there is no gateway stop to make.
        const href =
          result?.redirectUrl ??
          `/artist-registration/result?status=success&categoryId=${categoryId}`;

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
          onSuccess: (res) => {
            // A request sent back for revision had its fee refunded to the wallet, so it
            // goes through payment again. The wallet normally covers it in full, in which
            // case the server settles it and redirects without a gateway stop.
            // Resetting the store here would unmount the flow mid-purchase, so it waits
            // until the navigation is actually under way.
            if (res.result.requiresPayment) {
              startPayment(res.result.artistRequestId);
              return;
            }

            store.reset();
            toast.success(copy("editSuccessToast"));
            router.push("/profile");
          },
          onError: () => toast.error(copy("editErrorToast")),
        },
      );
    } else {
      create(formPayload, {
        onSuccess: (res) => {
          // The amount is fixed server-side; sending one here let users choose their own price.
          // The server resolves the fee (and skips the gateway when it is 0), so this
          // is the same redirect whether the category is paid or free.
          startPayment(res.result.artistRequestId);
        },
        onError: (error) => {
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
    }
  };

  return (
    <Card
      wrapperClassName={isMobile ? "w-[95%]" : "w-3/4"}
      className={clsx("pt-16 px-4", isDesktop && "px-6")}
    >
      <div className="flex flex-col gap-10">
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
              {!isFree && <p className="font-p2-regular">{copy("paymentNote")}</p>}
            </div>
            <Card wrapperClassName="w-full md:w-1/3">
              <div className="flex justify-between items-center">
                <p className="font-p2-medium">{copy("amountLabel")}</p>
                {isFree ? (
                  <p className="font-p2-medium">{copy("labelFree")}</p>
                ) : (
                  <div className="flex gap-1">
                    <p className="font-p2-medium">
                      {registrationAmount === undefined
                        ? "—"
                        : convertEnNumberToFaNumberWithSeparation(
                            registrationAmount,
                          )}
                    </p>
                    <p className="font-p2-medium">{copy("currency")}</p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}

        {store.editId && (
          <div className="flex gap-2 items-center">
            <div className="w-1 h-6 bg-error-500" />
            <p className="font-h5-bold">{copy("reviewTitle")}</p>
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
            {copy("prevLabel")}
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
