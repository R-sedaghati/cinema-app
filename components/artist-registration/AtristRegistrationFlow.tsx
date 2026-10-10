import {
  useUserCategoryFormSchema,
  useUserCategoryList,
  useUserProfile,
  useUserSiteContent,
} from "@/lib/services/landing/hook";
import { IUserCategoryResponse } from "@/lib/services/landing/type";
import { EFormFieldType } from "@/lib/services/admin/type";
import { isBlankAnswer, profilePrefillValue } from "@/lib/utils/profilePrefill";
import { Loader2 } from "lucide-react";
import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { SelectedCategory } from "@/app/(main)/artist-registration/ArtistRegistrationPageContent";
import FirstStepFlow from "./FIrstStepFlow";
import FourthStepFlow from "./FourthStepFlow";
import DynamicFormStep from "./DynamicFormStep";
import { useFormCopy } from "@/lib/hooks/useFormCopy";
import { useArtistRegistrationStore } from "@/lib/stores/useUserArtist";
import {
  onScreen,
  resolveRegistrationSections,
} from "@/lib/utils/resolveRegistrationSections";
import type { IResolvedRegistrationSection } from "@/lib/utils/resolveRegistrationSections";
import { CATEGORY_PAGE_SIZE } from "@/lib/constants/pagination";
import FormTitleSection from "./sections/FormTitleSection";
import StepperSection from "./sections/StepperSection";
import { sectionBoxProps } from "@/lib/utils/resolveSections";
import { formCardPadding } from "@/lib/utils/formCopy";
import { isMobile } from "react-device-detect";

interface ArtistProps {
  category: SelectedCategory | null;
  flowStep: number;
  onNext: () => void;
  onPrevious: () => void;
  onGoToStep: (step: number) => void;
}

const AtristRegistrationFlow: React.FC<ArtistProps> = ({
  category,
  flowStep,
  onNext,
  onPrevious,
  onGoToStep,
}) => {
  const { data, isLoading } = useUserCategoryList({ page: 1, count: CATEGORY_PAGE_SIZE });
  const { data: schemaData, isLoading: isSchemaLoading } =
    useUserCategoryFormSchema(category?.id);
  const { data: siteContent } = useUserSiteContent();

  const flowSections = useMemo(
    () =>
      onScreen(
        resolveRegistrationSections(siteContent?.result?.registrationSections),
        "flow",
      ),
    [siteContent],
  );

  const selectedCategory = useMemo(() => {
    if (!data?.result || !category?.id) return null;

    return data.result.find(
      (item: IUserCategoryResponse) => item.id === category.id,
    );
  }, [data, category]);

  const copy = useFormCopy();
  const store = useArtistRegistrationStore();
  const router = useRouter();

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

  const { data: profileData, isLoading: isProfileLoading } = useUserProfile();

  // Fields an admin wired to a profile field in the form-builder. The account is the source
  // of what it already knows, so those answers start out prefilled from it. Running here
  // (rather than in ArtistRegistrationPageContent) means it also runs after edit-mode
  // hydration, so a hydrated answer is already in the store and wins below.
  // Unwired fields whose key names a profile value (`email`, `phone`, `fullName`, a custom
  // profile key, …) are prefilled too, as an editable default — forms built before the
  // form-builder link existed would otherwise start empty for a known account.
  const prefillFields = useMemo(
    () =>
      steps
        .flatMap((step) => step.fields)
        .map((field) => ({
          key: field.key,
          source: field.syncToUserField || field.key,
          synced: Boolean(field.syncToUserField),
        })),
    [steps],
  );

  // The phone number belongs to the account, not the form: it is the OTP login identity,
  // and only the OTP flow may change it. Any other synced field the profile already holds
  // is the account's statement too, so those render read-only as well.
  const lockedKeys = useMemo(
    () =>
      new Set(
        prefillFields
          .filter(
            ({ source, synced }) =>
              synced &&
              (source === "phoneNumber" ||
                (profileData && profilePrefillValue(profileData, source))),
          )
          .map(({ key }) => key),
      ),
    [prefillFields, profileData],
  );

  // The schema query refetches on an interval, so `prefillFields` gets a new identity
  // every 30s. Without this guard the effect re-fires and silently refills fields the
  // user deliberately cleared.
  const [prefilledFor, setPrefilledFor] = useState<number | null>(null);

  useEffect(() => {
    if (!profileData || !prefillFields.length) return;
    if (prefilledFor === (category?.id ?? null)) return;
    setPrefilledFor(category?.id ?? null);

    const { answers, setAnswer } = useArtistRegistrationStore.getState();

    for (const { key, source, synced } of prefillFields) {
      const value = profilePrefillValue(profileData, source);

      if (!value) continue;

      // A present synced value locks its field read-only, so it always wins — even over a
      // hydrated draft carrying an older value the user could no longer edit. A key-matched
      // default stays editable, so a draft or saved answer keeps priority over it.
      if (synced || isBlankAnswer(answers[key])) setAnswer(key, value);
    }
  }, [prefillFields, profileData, category?.id, prefilledFor]);

  useEffect(() => {
    if (data && !hasChildren && flowStep === 0) {
      onNext();
    }
  }, [data, hasChildren, flowStep, onNext]);

  // Before the auto-advance effect fires, a childless category is still on step 0, and
  // a negative active step renders as "0 of N".
  const stepperActiveStep = Math.max(hasChildren ? flowStep : flowStep - 1, 0);
  const totalFixedTailSteps = 1; // payment step
  const totalSteps = steps.length + totalFixedTailSteps + (hasChildren ? 1 : 0);

  // The fields the account already knows (name, last name, …) are filled by the effect
  // above once the profile lands. Until then the form would show them empty and then pop
  // them in locked, so the loader covers the profile fetch and the render before the
  // prefill has been applied.
  const isPrefillPending =
    isProfileLoading ||
    (Boolean(profileData) &&
      prefillFields.length > 0 &&
      prefilledFor !== (category?.id ?? null));

  if (isLoading || isSchemaLoading || isPrefillPending) {
    return (
      <div className="flex justify-center items-center py-24">
        <Loader2 className="animate-spin text-error-500" size={40} />
      </div>
    );
  }

  // A deep link can carry any number; anything past the review step has nothing to
  // render, and clamping here beats a blank page.
  const maxStep = steps.length + 1;
  const clampedStep = Math.min(Math.max(flowStep, 0), maxStep);
  const contentIndex = clampedStep - 1;

  // Without child categories there is no category sub-step: flowStep 0 auto-advances,
  // so stepping back into it just bounces forward again and the button looks dead.
  // Leave for the grid of all forms instead — from an edit too, which has no earlier
  // step of its own to fall back to.
  const handlePrevious = () => {
    if (!hasChildren && clampedStep === 1) {
      store.reset();
      router.push("/artist-registration");
      return;
    }
    onPrevious();
  };

  const renderStep = () => {
    if (clampedStep === 0) {
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
          onGoToStep={onGoToStep}
        />
      );
    }

    return null;
  };

  const renderSection = (section: IResolvedRegistrationSection) => {
    switch (section.key) {
      case "formTitle":
        return (
          <FormTitleSection
            key={section.key}
            copy={copy}
            categoryTitle={category?.title ?? ""}
          />
        );
      case "stepper":
        return (
          <StepperSection
            key={section.key}
            steps={steps}
            copy={copy}
            hasChildren={hasChildren}
            activeStep={stepperActiveStep}
            totalSteps={totalSteps}
            variant={section.variant}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div
      className="flex flex-col gap-3 items-center"
      // Admin card padding, read by the step cards as `p-(--form-pad)`.
      style={
        {
          "--form-pad": `${formCardPadding(siteContent?.result?.form, isMobile ? "mobile" : "desktop")}px`,
        } as CSSProperties
      }
    >
      {flowSections.map((s) => (
        <div key={s.key} className="flex w-full flex-col items-center" {...sectionBoxProps(s)}>
          {renderSection(s)}
        </div>
      ))}

      {renderStep()}
    </div>
  );
};

export default AtristRegistrationFlow;
