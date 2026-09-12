"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Card } from "@dgshahr/ui-kit";
import AtristRegistrationFlow from "@/components/artist-registration/AtristRegistrationFlow";
import { useArtistRegistrationStore } from "@/lib/stores/useUserArtist";
import { groupPortfolios } from "@/lib/utils/portfolioAnswers";
import { sortByPriority } from "@/lib/utils/sortByPriority";
import { CATEGORY_PAGE_SIZE, MAX_PAGE_SIZE } from "@/lib/constants/pagination";
import {
  useOwnArtistRequest,
  useUserAtristRequests,
  useUserCategoryList,
  useUserSiteContent,
} from "@/lib/services/landing/hook";
import {
  onScreen,
  resolveRegistrationSections,
} from "@/lib/utils/resolveRegistrationSections";
import SelectScreen from "@/components/artist-registration/sections/SelectScreen";
import BackLinkSection from "@/components/artist-registration/sections/BackLinkSection";
import clsx from "clsx";
import { isDesktop } from "react-device-detect";
import { useFormCopy } from "@/lib/hooks/useFormCopy";
import { useLandingCopy } from "@/lib/hooks/useLandingCopy";
import useAuthStore from "@/lib/stores/useAuthStore";
import useLoginDrawerStore from "@/lib/stores/useLoginDrawerStore";
import Button from "@/components/common/Button";
import { toast } from "react-toastify";

export interface SelectedCategory {
  id: number;
  title: string;
}

export default function ArtistRegistrationPageContent({ editId }: { editId: number | null }) {
  const copy = useFormCopy();
  const landingCopy = useLandingCopy();

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const urlStep = Number(searchParams.get("step")) || 0;
  const urlCategoryId = Number(searchParams.get("category")) || 0;

  // The form is only worth filling once there is an account to attach it to: submitting
  // it signed out 401s, and the interceptor's logout redirect throws every answer away.
  // The token is persisted, so it is empty until zustand rehydrates — gating before that
  // flashes the sign-in card at users who are in fact logged in.
  const { accessToken } = useAuthStore();
  const { open: openLoginDrawer } = useLoginDrawerStore();
  const [isAuthReady, setIsAuthReady] = useState(false);

  // ponytail: mount flag, not a persist subscription — localStorage rehydration is
  // synchronous, so the token is settled by the first effect, and `persist` is not
  // there to subscribe to during the prerender anyway.
  useEffect(() => setIsAuthReady(true), []);

  const isSignedOut = isAuthReady && !accessToken;

  useEffect(() => {
    if (isSignedOut) openLoginDrawer();
  }, [isSignedOut, openLoginDrawer]);

  const { data: categoryData, isLoading: isCategoryLoading } = useUserCategoryList({
    page: 1,
    count: CATEGORY_PAGE_SIZE,
  });

  // Each account fills a given form once, so a category already registered in opens the
  // existing request for editing instead of starting a second one. The backend enforces
  // the same one-per-category rule on create.
  const { data: ownRequests } = useUserAtristRequests({ page: 1, count: MAX_PAGE_SIZE });

  const requestIdByCategory = useMemo(
    () =>
      new Map(
        (ownRequests?.result ?? []).flatMap((request) =>
          request.categories.map((c) => [c.id, request.id] as const),
        ),
      ),
    [ownRequests],
  );

  const topLevelCategories = useMemo(
    () =>
      sortByPriority(categoryData?.result ?? []).map((c) => ({
        id: c.id,
        title: c.faName,
        image: c.image,
        // A request filed under a child category occupies its parent's form too.
        existingRequestId:
          requestIdByCategory.get(c.id) ??
          (c.children ?? [])
            .map((child) => requestIdByCategory.get(child.id))
            .find((id) => id !== undefined),
      })),
    [categoryData, requestIdByCategory],
  );

  const { data: siteContent } = useUserSiteContent();

  const selectSections = useMemo(
    () =>
      onScreen(
        resolveRegistrationSections(siteContent?.result?.registrationSections),
        "select",
      ),
    [siteContent],
  );

  const {
    step,
    setStep,
    selectedCategoryId,
    selectedCategoryTitle,
    setSelectedCategory,
    handleNext,
    setField,
    reset,
  } = useArtistRegistrationStore();

  const selectedCategory: SelectedCategory | null =
    selectedCategoryId === null
      ? null
      : { id: selectedCategoryId, title: selectedCategoryTitle };

  const { data: editData, isLoading: editLoading } = useOwnArtistRequest(editId ?? undefined);

  // The URL is the durable copy of "which category, which step": state is a transient
  // mirror of it, so a refresh, a back button, or a shared link lands on the same screen
  // instead of dropping the user back on the category grid.
  const [isUrlHydrated, setIsUrlHydrated] = useState(false);
  const [editError, setEditError] = useState(false);

  // Hydration resets the store, so it must happen once per request — not once per
  // response object. Re-running it over a refetch would throw away everything typed since.
  const hydratedIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!editId || !editData?.result) return;
    if (hydratedIdRef.current === editId) return;
    hydratedIdRef.current = editId;

    const r = editData.result;

    reset();
    setField("editId", editId);
    setField(
      "categoryId",
      r.categories.map((c) => c.id),
    );

    // Merge portfolio rows (grouped by the schema field they were submitted under) back
    // into answers so IMAGE/VIDEO fields hydrate like any other dynamic field.
    const { answers: portfolioAnswers, urlByPath } = groupPortfolios(r.portfolios);

    setField("portfolioUrls", urlByPath);
    // Portfolio rows are the authoritative record of what was uploaded, so they win:
    // a stale or empty file key in `answers` would otherwise blank the hydrated images.
    setField("answers", { ...(r.answers ?? {}), ...portfolioAnswers });

    const cat = r.categories[0];
    if (cat) {
      setSelectedCategory(cat.id, cat.faName);
      setStep(1);
    } else {
      // No category means no form schema to render — say so instead of leaving the
      // page on step 0 with an editId, which renders nothing at all.
      setEditError(true);
    }
    setIsUrlHydrated(true);
  }, [editData, editId]);

  useEffect(() => {
    if (isUrlHydrated || editId) return;

    // The store outlives a client-side navigation, so a form edited earlier would still
    // be sitting in it when the category grid mounts.
    if (useArtistRegistrationStore.getState().editId) reset();

    // Titles come from the category list, so hydrating a deep-linked step has to wait
    // for it — without a title the form header renders blank.
    if (!urlStep || !urlCategoryId) {
      setIsUrlHydrated(true);
      return;
    }
    if (!topLevelCategories.length) return;

    const cat = topLevelCategories.find((c) => c.id === urlCategoryId);
    if (cat) {
      setField("categoryId", [cat.id]);
      setSelectedCategory(cat.id, cat.title);
      // The flow clamps the step to what the schema actually has; keep the obvious
      // nonsense out of the store in the first place.
      setStep(Math.max(urlStep, 1));
    } else {
      // The category list is paginated, so a link to a category outside the first page
      // resolves to nothing. Falling through to the grid without a word looks broken.
      toast.error(landingCopy("deepLinkCategoryMissing"));
    }
    setIsUrlHydrated(true);
  }, [isUrlHydrated, editId, urlStep, urlCategoryId, topLevelCategories]);

  useEffect(() => {
    if (!isUrlHydrated) return;

    // Only the create flow is resumable. An edit is addressed by its request id alone,
    // so its progress stays out of the URL and reopening one starts at the first step.
    const params = new URLSearchParams();
    if (!editId && selectedCategoryId) {
      params.set("category", String(selectedCategoryId));
      if (step > 0) params.set("step", String(step));
    }

    const query = params.toString();
    const next = query ? `${pathname}?${query}` : pathname;
    const current = searchParams.toString();
    if (query === current) return;

    router.replace(next, { scroll: false });
  }, [isUrlHydrated, editId, selectedCategoryId, step, pathname, router, searchParams]);

  // Back/Forward rewrites the query without remounting, and the hydration effect above
  // only runs once — so the step has to be re-read from the URL here or the address bar
  // and the rendered step drift apart permanently.
  useEffect(() => {
    if (!isUrlHydrated || editId) return;
    if (!urlCategoryId || urlCategoryId !== selectedCategoryId) return;
    if (urlStep && urlStep !== step) setStep(urlStep);
  }, [urlStep, urlCategoryId, isUrlHydrated, editId, selectedCategoryId, step, setStep]);

  const handleSelectCategory = (
    id: number,
    title: string,
    existingRequestId?: number,
  ) => {
    // Already filed here: send the user into the edit flow for that request rather
    // than a create that the server would 409.
    if (existingRequestId) {
      router.push(`/artist-registration/${existingRequestId}`);
      return;
    }

    reset();
    setField("categoryId", [id]);
    setSelectedCategory(id, title);
    setStep(1);
  };

  const handlePrevious = () => {
    // Nothing sits behind the first step of the flow, so back leaves it for the grid of
    // all forms instead of leaving the user on a button that does nothing.
    if (step <= 1) {
      reset();
      router.push("/artist-registration");
      return;
    }

    setStep(step - 1);
  };

  if (isSignedOut) {
    return (
      <div className="flex justify-center py-16 md:py-24">
        <Card
          wrapperClassName={clsx("w-[90%]", isDesktop && "w-1/2")}
          className="py-10 px-4 md:px-8"
        >
          <div className="flex flex-col gap-5 items-center text-center">
            <p className="font-h4-bold">{landingCopy("regAuthGateTitle")}</p>
            <p className="font-p1-regular text-gray-600">
              {landingCopy("regAuthGateDesc")}
            </p>
            <Button className="rounded-full!" onClick={openLoginDrawer}>
              {landingCopy("regAuthGateCta")}
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (editError) {
    return (
      <div className="flex justify-center py-16 md:py-24">
        <Card
          wrapperClassName={clsx("w-[90%]", isDesktop && "w-1/2")}
          className="py-10 px-4 md:px-8"
        >
          <div className="flex flex-col gap-5 items-center text-center">
            <p className="font-h4-bold">{landingCopy("regEditUnavailable")}</p>
            <Button
              className="rounded-full!"
              onClick={() => router.push("/artist-registration")}
            >
              {landingCopy("regEditUnavailableCta")}
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (!isAuthReady || (editId && editLoading) || (step === 0 && isCategoryLoading)) {
    return (
      <div className="flex justify-center items-center py-24">
        <Loader2 className="animate-spin text-error-500" size={40} />
      </div>
    );
  }

  const showBackLink = selectSections.some((s) => s.key === "backLink");

  return (
    <div className="mt-4">
      {step === 0 && !editId && (
        <SelectScreen
          sections={selectSections}
          items={topLevelCategories}
          copy={copy}
          onSelect={handleSelectCategory}
        />
      )}

      {/* The link back home belongs to both screens, but it is only orderable on
          the select one — inside the flow it always sits at the top. Hiding it
          in the builder hides it everywhere. */}
      {step >= 1 && showBackLink && <BackLinkSection copy={copy} />}

      {step >= 1 && selectedCategory && (
        <AtristRegistrationFlow
          category={selectedCategory}
          flowStep={step - 1}
          onNext={handleNext}
          onPrevious={handlePrevious}
          onGoToStep={(flowStep) => setStep(flowStep + 1)}
        />
      )}
    </div>
  );
}
