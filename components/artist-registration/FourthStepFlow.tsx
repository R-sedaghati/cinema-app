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
import { toast } from "react-toastify";
import { isDesktop, isMobile } from "react-device-detect";
import clsx from "clsx";
import { CopyFn } from "@/lib/utils/formCopy";

const PAYMENT_AMOUNT = 200000;

interface Props {
  steps: IFormStep[];
  copy: CopyFn;
  onNext: () => void;
  onPrevious: () => void;
}

const FourthStepFlow: React.FC<Props> = ({ steps, copy, onPrevious }) => {
  const store = useArtistRegistrationStore();
  const router = useRouter();
  const { mutate: create, isPending: isCreating } =
    useUserCreateArtistRequest();
  const { mutate: update, isPending: isUpdating } =
    useUpdateUserArtistRequest();
  const isPending = isCreating || isUpdating;

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

  const handleSubmit = () => {
    if (store.editId) {
      update(
        { id: store.editId, ...formPayload },
        {
          onSuccess: () => {
            toast.success(copy("editSuccessToast"));
            store.reset();
            router.push("/profile");
          },
          onError: () => toast.error(copy("editErrorToast")),
        },
      );
    } else {
      create(formPayload, {
        onSuccess: (res) => {
          // The amount is fixed server-side; sending one here let users choose their own price.
          window.location.href = `http://api.archivehonar.ir/api/user/purchase/?requestId=${res.result.artistRequestId}`;
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
        <div className="flex flex-col gap-4">
          {steps.map((step) => (
            <div key={step.id} className="flex flex-col gap-2">
              <p className="font-h6-bold">{step.title}</p>
              <div className="grid md:grid-cols-2 gap-2">
                {[...step.fields]
                  .sort((a, b) => a.order - b.order)
                  .map((field) => {
                    const value = store.answers[field.key];
                    const display =
                      typeof value === "boolean"
                        ? value
                          ? copy("booleanYes")
                          : copy("booleanNo")
                        : Array.isArray(value)
                          ? value.join("، ")
                          : ((value as string | number | undefined) ??
                            copy("emptyValue"));

                    return (
                      <div key={field.id} className="flex gap-1">
                        <p className="font-p2-medium text-gray-500">{field.label}:</p>
                        <p className="font-p2-regular">{String(display)}</p>
                      </div>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>

        {!store.editId && (
          <div className="flex flex-col gap-3 md:gap-0 md:flex-row justify-between items-center">
            <div className="flex flex-col gap-3">
              <div className="flex gap-2 items-center">
                <div className="w-1 h-6 bg-error-500" />
                <p className="font-h5-bold">{copy("paymentTitle")}</p>
              </div>
              <p className="font-p2-regular">{copy("paymentNote")}</p>
            </div>
            <Card wrapperClassName="w-full md:w-1/3">
              <div className="flex justify-between items-center">
                <p className="font-p2-medium">{copy("amountLabel")}</p>
                <div className="flex gap-1">
                  <p className="font-p2-medium">
                    {convertEnNumberToFaNumberWithSeparation(PAYMENT_AMOUNT)}
                  </p>
                  <p className="font-p2-medium">{copy("currency")}</p>
                </div>
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
            {store.editId ? copy("editSubmitLabel") : copy("submitLabel")}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default FourthStepFlow;
