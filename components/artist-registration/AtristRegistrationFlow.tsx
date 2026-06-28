import { useUserCategoryList } from "@/lib/services/landing/hook";
import { IUserCategoryResponse } from "@/lib/services/landing/type";
import { Card, HorizontalStep, HorizontalStepper } from "@dgshahr/ui-kit";
import { LayoutGrid, UserRound, List, CreditCard } from "lucide-react";
import { useMemo } from "react";
import { SelectedCategory } from "@/app/(main)/artist-registration/page";
import FirstStepFlow from "./FIrstStepFlow";
import SecondStepFlow from "./SecondStepFlow";
import ThirdStepFlow from "./ThirdStepFlow";
import FourthStepFlow from "./FourthStepFlow";
import { isDesktop, isMobile } from "react-device-detect";
import clsx from "clsx";

interface ArtistProps {
  category: SelectedCategory | null;
  flowStep: number;
  onNext: () => void;
  onPrevious: () => void;
}

const AtristRegistrationFlow: React.FC<ArtistProps> = ({
  category,
  flowStep,
  onNext,
  onPrevious,
}) => {
  const { data } = useUserCategoryList({ page: 1, count: 16 });

  const selectedCategory = useMemo(() => {
    if (!data?.result || !category?.id) return null;

    return data.result.find(
      (item: IUserCategoryResponse) => item.id === category.id,
    );
  }, [data, category]);

  const children = selectedCategory?.children || [];

  const renderStep = () => {
    switch (flowStep) {
      case 0:
        return (
          <FirstStepFlow
            childrenList={children}
            onNext={onNext}
            onPrevious={onPrevious}
          />
        );

      case 1:
        return <SecondStepFlow onNext={onNext} onPrevious={onPrevious} />;

      case 2:
        return <ThirdStepFlow onNext={onNext} onPrevious={onPrevious} />;

      case 3:
        return <FourthStepFlow onNext={onNext} onPrevious={onPrevious} />;

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-3 items-center">
      <p className="font-h2-bold md:mb-7">{`فرم حوزه ${category?.title}`}</p>

      <Card wrapperClassName={isMobile ? "w-[85%]" : "w-3/4"} className="py-4">
        <HorizontalStepper
          activeStep={flowStep}
          size="medium"
          stepOrientation="horizontal"
          classname={clsx(
            "w-[85%] mx-auto scrollbar-hidden",
            isDesktop && "w-3/4",
          )}
        >
          <HorizontalStep
            activeIcon={<LayoutGrid />}
            icon={<LayoutGrid />}
            subTitle="مرحله ۱ از ۴"
            title="زمینه فعالیت"
          />
          <HorizontalStep
            activeIcon={<UserRound />}
            icon={<UserRound />}
            subTitle="مرحله ۲ از ۴"
            title="اطلاعات هویتی"
          />
          <HorizontalStep
            activeIcon={<List />}
            icon={<List />}
            subTitle="مرحله ۳ از ۴"
            title="سوابق کاری و پروژه‌ها"
          />
          <HorizontalStep
            activeIcon={<CreditCard />}
            icon={<CreditCard />}
            subTitle="مرحله پایانی"
            title="پرداخت"
          />
        </HorizontalStepper>
      </Card>

      {renderStep()}
    </div>
  );
};

export default AtristRegistrationFlow;
