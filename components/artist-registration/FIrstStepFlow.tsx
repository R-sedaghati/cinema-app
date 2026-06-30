"use client";

import { IUserCaategoryItem } from "@/lib/services/landing/type";
import { useArtistRegistrationStore } from "@/lib/stores/useUserArtist";
import { Card, Checkbox } from "@dgshahr/ui-kit";
import { ChevronRight, ChevronLeft } from "lucide-react";
import Button from "../common/Button";
import clsx from "clsx";
import { isDesktop, isMobile } from "react-device-detect";

interface Props {
  childrenList: IUserCaategoryItem[];
  onNext: () => void;
  onPrevious: () => void;
}

const FirstStepFlow: React.FC<Props> = ({
  childrenList,
  onNext,
  onPrevious,
}) => {
  const { categoryId, setField } = useArtistRegistrationStore();

  const toggleCategory = (id: number) => {
    if (categoryId.includes(id)) {
      setField(
        "categoryId",
        categoryId.filter((c) => c !== id),
      );
    } else {
      setField("categoryId", [...categoryId, id]);
    }
  };

  return (
    <Card wrapperClassName={isMobile ? "w-[95%]" : "w-3/4"}>
      <div className={clsx("flex flex-col gap-6", isDesktop && "gap-4!")}>
        <p className="font-p2-medium">لطفاً زمینه فعالیت خود را مشخص نمایید:</p>

        <div className="flex flex-col gap-2">
          {childrenList?.map((child) => (
            <Checkbox
              key={child.id}
              label={child?.faName ?? ""}
              checked={categoryId.includes(child.id)}
              onChange={() => toggleCategory(child.id)}
            />
          ))}
        </div>

        <div className="flex justify-end gap-3">
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
            onClick={onNext}
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

export default FirstStepFlow;
