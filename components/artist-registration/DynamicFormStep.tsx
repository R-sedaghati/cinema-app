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
import { CopyFn } from "@/lib/utils/formCopy";

interface Props {
  step: IFormStep;
  provinceKey?: string;
  copy: CopyFn;
  onNext: () => void;
  onPrevious: () => void;
}

const DynamicFormStep: React.FC<Props> = ({ step, provinceKey, copy, onNext, onPrevious }) => {
  const store = useArtistRegistrationStore();

  const handleNext = () => {
    const errors = getStepErrors(step, store.answers, copy);

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
        {step.description && (
          <p className="font-p2-medium text-gray-700">{step.description}</p>
        )}

        {sortedFields.map((field) => (
          <FieldRenderer
            key={field.id}
            field={field}
            value={store.answers[field.key]}
            provinceKey={provinceKey}
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
            {copy("prevLabel")}
          </Button>

          <Button
            leftIcon={<ChevronLeft />}
            className={clsx("rounded-full!", isDesktop && "px-10")}
            onClick={handleNext}
            isFullWidth={isMobile}
            size={isMobile ? "small" : "medium"}
          >
            {copy("nextLabel")}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default DynamicFormStep;
