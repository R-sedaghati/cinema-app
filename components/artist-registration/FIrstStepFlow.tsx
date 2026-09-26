"use client";

import { IUserCaategoryItem } from "@/lib/services/landing/type";
import { useArtistRegistrationStore } from "@/lib/stores/useUserArtist";
import { Card, Checkbox } from "@dgshahr/ui-kit";
import { ChevronRight, ChevronLeft } from "lucide-react";
import Button from "../common/Button";
import clsx from "clsx";
import { isDesktop, isMobile } from "react-device-detect";
import { CopyFn } from "@/lib/utils/formCopy";
import { sortByPriority } from "@/lib/utils/sortByPriority";

interface Props {
  childrenList: IUserCaategoryItem[];
  copy: CopyFn;
  onNext: () => void;
  onPrevious: () => void;
}

const FirstStepFlow: React.FC<Props> = ({
  childrenList,
  copy,
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
    <Card wrapperClassName={isMobile ? "w-[95%]" : "w-3/4"} className="p-(--form-pad)!">
      <div className={clsx("flex flex-col gap-6", isDesktop && "gap-4!")}>
        <p className="font-p2-medium"><span style={copy.style("categoryPrompt")}>{copy("categoryPrompt")}</span></p>

        <div className="flex flex-col gap-2">
          {sortByPriority(childrenList ?? []).map((child) => (
            <Checkbox
              key={child.id}
              label={child?.faName ?? ""}
              containerClassName="w-full"
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
            <span style={copy.style("prevLabel")}>{copy("prevLabel")}</span>
          </Button>

          <Button
            leftIcon={<ChevronLeft />}
            className={clsx("rounded-full!", isDesktop && "px-10")}
            onClick={onNext}
            isFullWidth={isMobile}
            size={isMobile ? "small" : "medium"}
          >
            <span style={copy.style("nextLabel")}>{copy("nextLabel")}</span>
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default FirstStepFlow;
