import { useUserCategoryFormSchema, useUserCategoryList } from "@/lib/services/landing/hook";
import { IUserCategoryResponse } from "@/lib/services/landing/type";
import { EFormFieldType } from "@/lib/services/admin/type";
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
import { SelectedCategory } from "@/app/(main)/artist-registration/ArtistRegistrationPageContent";
import FirstStepFlow from "./FIrstStepFlow";
import FourthStepFlow from "./FourthStepFlow";
import DynamicFormStep from "./DynamicFormStep";
import { isDesktop, isMobile } from "react-device-detect";
import clsx from "clsx";
import { makeCopy } from "@/lib/utils/formCopy";

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

  const copy = useMemo(
    () => makeCopy(schemaData?.result?.formCopy),
    [schemaData],
  );

  const children = selectedCategory?.children || [];
  const hasChildren = children.length > 0;

  const steps = useMemo(
    () => [...(schemaData?.result?.steps ?? [])].sort((a, b) => a.order - b.order),
    [schemaData],
  );

  const provinceKey = useMemo(
    () =>
      steps
        .flatMap((step) => step.fields)
        .find((field) => field.type === EFormFieldType.SELECT_PROVINCE)?.key,
    [steps],
  );

  useEffect(() => {
    if (data && !hasChildren && flowStep === 0) {
      onNext();
    }
  }, [data, hasChildren, flowStep]);

  const stepperActiveStep = hasChildren ? flowStep : flowStep - 1;
  const totalFixedTailSteps = 1; // payment step

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
          copy={copy}
          onNext={onNext}
          onPrevious={onPrevious}
        />
      ) : null;
    }

    if (contentIndex < steps.length) {
      const step = steps[contentIndex];
      return (
        <DynamicFormStep
          step={step}
          provinceKey={provinceKey}
          copy={copy}
          onNext={onNext}
          onPrevious={onPrevious}
        />
      );
    }

    if (contentIndex === steps.length) {
      return (
        <FourthStepFlow steps={steps} copy={copy} onNext={onNext} onPrevious={onPrevious} />
      );
    }

    return null;
  };

  const totalSteps = steps.length + totalFixedTailSteps + (hasChildren ? 1 : 0);

  return (
    <div className="flex flex-col gap-3 items-center">
      <p className="font-h2-bold mt-5 mb-1 md:mb-7 md:mt-0">
        {copy("formTitle", { category: category?.title ?? "" })}
      </p>

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
              subTitle={copy("stepCounter", { n: 1, total: totalSteps })}
              title={copy("categoryStepTitle")}
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
                subTitle={copy("stepCounter", { n: stepNumber, total: totalSteps })}
                title={step.title}
              />
            );
          })}
          <HorizontalStep
            activeIcon={<CreditCard />}
            icon={<CreditCard />}
            subTitle={copy("finalStepLabel")}
            title={copy("paymentStepTitle")}
          />
        </HorizontalStepper>
      </Card>

      {renderStep()}
    </div>
  );
};

export default AtristRegistrationFlow;
