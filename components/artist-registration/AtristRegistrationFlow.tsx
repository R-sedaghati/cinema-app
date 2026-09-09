import {
  useUserCategoryFormSchema,
  useUserCategoryList,
  useUserProfile,
  useUserSiteContent,
} from "@/lib/services/landing/hook";
import { IUserCategoryResponse, IUserProfile } from "@/lib/services/landing/type";
import { EFormFieldType, SyncToUserField } from "@/lib/services/admin/type";
import { Loader2 } from "lucide-react";
import { useEffect, useMemo, useRef } from "react";
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

interface ArtistProps {
  category: SelectedCategory | null;
  flowStep: number;
  onNext: () => void;
  onPrevious: () => void;
  onGoToStep: (step: number) => void;
}

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

  // The schema query refetches on an interval, so `syncedFields` gets a new identity
  // every 30s. Without this guard the effect re-fires and silently refills fields the
  // user deliberately cleared.
  const prefilledForRef = useRef<number | null>(null);

  useEffect(() => {
    if (!profileData || !syncedFields.length) return;
    if (prefilledForRef.current === (category?.id ?? null)) return;
    prefilledForRef.current = category?.id ?? null;

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
  }, [syncedFields, profileData, category?.id]);

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

  if (isLoading || isSchemaLoading) {
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
    <div className="flex flex-col gap-3 items-center">
      {flowSections.map(renderSection)}

      {renderStep()}
    </div>
  );
};

export default AtristRegistrationFlow;
