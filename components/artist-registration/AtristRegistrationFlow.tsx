import {
  useUserCategoryFormSchema,
  useUserCategoryList,
  useUserProfile,
} from "@/lib/services/landing/hook";
import { IUserCategoryResponse, IUserProfile } from "@/lib/services/landing/type";
import { EFormFieldType, SyncToUserField } from "@/lib/services/admin/type";
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
import { useFormCopy } from "@/lib/hooks/useFormCopy";
import { useArtistRegistrationStore } from "@/lib/stores/useUserArtist";

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

/** Answer shapes that mean "still blank", and so may be filled in from the profile. */
const isEmptyAnswer = (value: unknown) =>
  value === undefined ||
  value === null ||
  value === "" ||
  (Array.isArray(value) && value.length === 0);

/**
 * The profile value a `syncToUserField` target prefills from, or `null` when there is
 * nothing safe to prefill. `avatar` is deliberately excluded: the profile exposes a
 * presigned URL while an IMAGE answer holds the storage key, so prefilling one would
 * write the URL back into `avatar_path` on submit. Avatar sync stays one-way, form → account.
 */
const profileValue = (
  profile: IUserProfile,
  target: SyncToUserField,
): string | null => {
  if (target === "avatar") return null;

  return target === "phoneNumber" ? profile.phone_number : profile[target];
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

  const copy = useFormCopy();
  const store = useArtistRegistrationStore();

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

  const { data: profileData } = useUserProfile();

  // Fields an admin wired to a profile field in the form-builder. The account is the source
  // of what it already knows, so those answers start out prefilled from it. Running here
  // (rather than in ArtistRegistrationPageContent) means it also runs after edit-mode
  // hydration, so a hydrated answer is already in the store and wins below.
  const syncedFields = useMemo(
    () =>
      steps
        .flatMap((step) => step.fields)
        .filter((field) => field.syncToUserField)
        .map((field) => ({
          key: field.key,
          target: field.syncToUserField as SyncToUserField,
        })),
    [steps],
  );

  // The phone number belongs to the account, not the form: it is the OTP login identity,
  // and only the OTP flow may change it. Its fields render read-only.
  const lockedKeys = useMemo(
    () =>
      new Set(
        syncedFields
          .filter(({ target }) => target === "phoneNumber")
          .map(({ key }) => key),
      ),
    [syncedFields],
  );

  useEffect(() => {
    if (!profileData) return;

    const { answers, setAnswer } = useArtistRegistrationStore.getState();

    for (const { key, target } of syncedFields) {
      const value = profileValue(profileData, target);

      if (!value) continue;

      // The phone number is read-only and owned by the account, so it always wins — even
      // over a hydrated draft carrying an older number. Every other target only fills a
      // blank: a draft, or anything the user has typed, is the more current statement.
      if (target !== "phoneNumber" && !isEmptyAnswer(answers[key])) continue;

      setAnswer(key, value);
    }
  }, [syncedFields, profileData]);

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

  // Without child categories there is no category sub-step: flowStep 0 auto-advances,
  // so stepping back into it just bounces forward again and the button looks dead.
  // Jump straight to the category grid instead (edit mode has no grid to return to).
  const handlePrevious = () => {
    if (!hasChildren && flowStep === 1) {
      if (!store.editId) store.reset();
      return;
    }
    onPrevious();
  };

  const renderStep = () => {
    if (flowStep === 0) {
      return hasChildren ? (
        <FirstStepFlow
          childrenList={children}
          copy={copy}
          onNext={onNext}
          onPrevious={handlePrevious}
        />
      ) : null;
    }

    if (contentIndex < steps.length) {
      const step = steps[contentIndex];
      return (
        <DynamicFormStep
          step={step}
          provinceKey={provinceKey}
          lockedKeys={lockedKeys}
          copy={copy}
          onNext={onNext}
          onPrevious={handlePrevious}
        />
      );
    }

    if (contentIndex === steps.length) {
      return (
        <FourthStepFlow
          steps={steps}
          copy={copy}
          registrationAmount={schemaData?.result?.registrationAmount}
          onNext={onNext}
          onPrevious={handlePrevious}
        />
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
