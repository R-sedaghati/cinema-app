"use client";

import clsx from "clsx";
import { Card, HorizontalStep, HorizontalStepper } from "@dgshahr/ui-kit";
import {
  CreditCard,
  LayoutGrid,
  List,
  LucideIcon,
  UserRound,
} from "lucide-react";
import { isDesktop, isMobile } from "react-device-detect";
import type { IFormStep } from "@/lib/services/admin/type";
import type { CopyFn } from "@/lib/utils/formCopy";

const ICON_MAP: Record<string, LucideIcon> = {
  LayoutGrid,
  UserRound,
  List,
  CreditCard,
};

interface Props {
  steps: IFormStep[];
  copy: CopyFn;
  /** A category sub-step exists only when the chosen category has children. */
  hasChildren: boolean;
  activeStep: number;
  totalSteps: number;
  variant?: string;
}

const StepperSection: React.FC<Props> = ({
  steps,
  copy,
  hasChildren,
  activeStep,
  totalSteps,
  variant,
}) => {
  if (variant === "compact") {
    return (
      <p className="font-p2-medium text-zinc-400">
        {copy("stepCounter", { n: activeStep + 1, total: totalSteps })}
      </p>
    );
  }

  return (
    <Card wrapperClassName={isMobile ? "w-[95%]" : "w-3/4"} className="py-4">
      <HorizontalStepper
        activeStep={activeStep}
        size="medium"
        stepOrientation="horizontal"
        classname={clsx("w-[95%] mx-auto scrollbar-hidden", isDesktop && "w-3/4")}
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
  );
};

export default StepperSection;
