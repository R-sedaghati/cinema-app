"use client";

import { Card } from "@dgshahr/ui-kit";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Button from "../common/Button";
import { IFormStep } from "@/lib/services/admin/type";
import { useArtistRegistrationStore } from "@/lib/stores/useUserArtist";
import { getStepErrors } from "@/lib/utils/validateFormStep";
import FieldRenderer from "./fields/FieldRenderer";
import { toast } from "react-toastify";
import { isDesktop, isMobile } from "react-device-detect";
import clsx from "clsx";

interface Props {
  step: IFormStep;
  onNext: () => void;
  onPrevious: () => void;
}

const DynamicFormStep: React.FC<Props> = ({ step, onNext, onPrevious }) => {
  const store = useArtistRegistrationStore();

  const handleNext = () => {
    const errors = getStepErrors(step, store.answers);

    if (errors.length) {
      toast.error(errors[0]);
      return;
    }

    onNext();
  };

  const sortedFields = [...step.fields].sort((a, b) => a.order - b.order);

  return (
    <Card wrapperClassName={isMobile ? "w-[95%]" : "w-3/4"}>
      <div className="flex flex-col gap-5">
        {sortedFields.map((field) => (
          <FieldRenderer
            key={field.id}
            field={field}
            value={store.answers[field.key]}
            onChange={(value) => store.setAnswer(field.key, value)}
          />
        ))}

        <div className="flex justify-end gap-3 mt-5">
          <Button
            variant="outline"
            rightIcon={<ChevronRight />}
            className={clsx("rounded-full!", isDesktop && "px-10")}
            onClick={onPrevious}
            isFullWidth={isMobile}
            size={isMobile ? "small" : "medium"}
          >
            مرحله قبل
          </Button>

          <Button
            leftIcon={<ChevronLeft />}
            className={clsx("rounded-full!", isDesktop && "px-10")}
            onClick={handleNext}
            isFullWidth={isMobile}
            size={isMobile ? "small" : "medium"}
          >
            مرحله بعد
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default DynamicFormStep;
