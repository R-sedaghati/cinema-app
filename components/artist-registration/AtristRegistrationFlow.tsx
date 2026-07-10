import { useUserCategoryFormSchema, useUserCategoryList } from "@/lib/services/landing/hook";
import { IUserCategoryResponse } from "@/lib/services/landing/type";
import { Card, HorizontalStep, HorizontalStepper } from "@dgshahr/ui-kit";
import {
  LayoutGrid,
  UserRound,
  List,
  CreditCard,
  Loader2,
  LucideIcon,
} from "lucide-react";
import { useEffect, useMemo } from "react";
import { SelectedCategory } from "@/app/(main)/artist-registration/page";
import FirstStepFlow from "./FIrstStepFlow";
import ThirdStepFlow from "./ThirdStepFlow";
import FourthStepFlow from "./FourthStepFlow";
import DynamicFormStep from "./DynamicFormStep";
import { isDesktop, isMobile } from "react-device-detect";
import clsx from "clsx";

interface ArtistProps {
  category: SelectedCategory | null;
  flowStep: number;
  onNext: () => void;
  onPrevious: () => void;
}

const ICON_MAP: Record<string, LucideIcon> = {
  LayoutGrid,
  UserRound,
  List,
  CreditCard,
};

const AtristRegistrationFlow: React.FC<ArtistProps> = ({
  category,
  flowStep,
  onNext,
  onPrevious,
}) => {
  const { data, isLoading } = useUserCategoryList({ page: 1, count: 30 });
  const { data: schemaData, isLoading: isSchemaLoading } =
    useUserCategoryFormSchema(category?.id);

  const selectedCategory = useMemo(() => {
    if (!data?.result || !category?.id) return null;

    return data.result.find(
      (item: IUserCategoryResponse) => item.id === category.id,
    );
  }, [data, category]);

  const children = selectedCategory?.children || [];
  const hasChildren = children.length > 0;

  const steps = useMemo(
    () => [...(schemaData?.result?.steps ?? [])].sort((a, b) => a.order - b.order),
    [schemaData],
  );

  useEffect(() => {
    if (data && !hasChildren && flowStep === 0) {
      onNext();
    }
  }, [data, hasChildren, flowStep]);

  const stepperActiveStep = hasChildren ? flowStep : flowStep - 1;
  const totalFixedTailSteps = 2; // portfolio/sample step + review step

  if (isLoading || isSchemaLoading) {
    return (
      <div className="flex justify-center items-center py-24">
        <Loader2 className="animate-spin text-error-500" size={40} />
      </div>
    );
  }

  const contentIndex = flowStep - 1;

  const renderStep = () => {
    if (flowStep === 0) {
      return hasChildren ? (
        <FirstStepFlow
          childrenList={children}
          onNext={onNext}
          onPrevious={onPrevious}
        />
      ) : null;
    }

    if (contentIndex < steps.length) {
      const step = steps[contentIndex];
      return <DynamicFormStep step={step} onNext={onNext} onPrevious={onPrevious} />;
    }

    if (contentIndex === steps.length) {
      return <ThirdStepFlow onNext={onNext} onPrevious={onPrevious} />;
    }

    if (contentIndex === steps.length + 1) {
      return (
        <FourthStepFlow steps={steps} onNext={onNext} onPrevious={onPrevious} />
      );
    }

    return null;
  };

  const totalSteps = steps.length + totalFixedTailSteps + (hasChildren ? 1 : 0);

  return (
    <div className="flex flex-col gap-3 items-center">
      <p className="font-h2-bold mt-5 mb-1 md:mb-7 md:mt-0">{`فرم حوزه ${category?.title}`}</p>

      <Card wrapperClassName={isMobile ? "w-[95%]" : "w-3/4"} className="py-4">
        <HorizontalStepper
          activeStep={stepperActiveStep}
          size="medium"
          stepOrientation="horizontal"
          classname={clsx(
            "w-[95%] mx-auto scrollbar-hidden",
            isDesktop && "w-3/4",
          )}
        >
          {hasChildren && (
            <HorizontalStep
              activeIcon={<LayoutGrid />}
              icon={<LayoutGrid />}
              subTitle={`مرحله ۱ از ${totalSteps}`}
              title="زمینه فعالیت"
            />
          )}
          {steps.map((step, index) => {
            const Icon = (step.icon && ICON_MAP[step.icon]) || UserRound;
            const stepNumber = index + 1 + (hasChildren ? 1 : 0);
            return (
              <HorizontalStep
                key={step.id}
                activeIcon={<Icon />}
                icon={<Icon />}
                subTitle={`مرحله ${stepNumber} از ${totalSteps}`}
                title={step.title}
              />
            );
          })}
          <HorizontalStep
            activeIcon={<List />}
            icon={<List />}
            subTitle={`مرحله ${steps.length + 1 + (hasChildren ? 1 : 0)} از ${totalSteps}`}
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
