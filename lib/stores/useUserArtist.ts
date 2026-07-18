import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ESampleType } from "../services/landing/type";

export type PortfolioType = "IMAGE" | "VIDEO";

export interface Portfolio {
  path: string;
  type: PortfolioType;
}

interface ArtistRegistrationState {
  // Stepper
  step: number;

  sampleType: ESampleType;

  // Edit mode — non-null means editing an existing request
  editId: number | null;

  // Selected category (for display)
  selectedCategoryId: number | null;
  selectedCategoryTitle: string;

  // Form
  categoryId: number[];
  answers: Record<string, unknown>;
  portfolios: Portfolio[];

  // Step Actions
  handleNext: () => void;
  handlePrevious: () => void;
  setStep: (step: number) => void;
  setSelectedCategory: (id: number, title: string) => void;

  // Form Actions
  setField: <K extends keyof ArtistRegistrationState>(
    field: K,
    value: ArtistRegistrationState[K],
  ) => void;

  setAnswer: (key: string, value: unknown) => void;
  setAnswers: (answers: Record<string, unknown>) => void;

  addPortfolio: (portfolio: Portfolio) => void;
  removePortfolio: (path: string) => void;

  reset: () => void;
}

const initialState = {
  step: 0,
  editId: null as number | null,

  selectedCategoryId: null as number | null,
  selectedCategoryTitle: "",

  categoryId: [],
  sampleType: ESampleType.HAS_SAMPLE,

  answers: {} as Record<string, unknown>,
  portfolios: [] as Portfolio[],
};

export const useArtistRegistrationStore = create<ArtistRegistrationState>()(
  persist(
    (set) => ({
      ...initialState,

      setStep: (step) => set({ step }),

      setSelectedCategory: (id, title) =>
        set({ selectedCategoryId: id, selectedCategoryTitle: title }),

      handleNext: () =>
        set((state) => ({
          step: state.step + 1,
        })),

      handlePrevious: () =>
        set((state) => {
          if (state.step === 1) {
            return {
              step: 0,
              categoryId: [],
              selectedCategoryId: null,
              selectedCategoryTitle: "",
            };
          }

          return {
            step: Math.max(state.step - 1, 0),
          };
        }),

      setField: (field, value) =>
        set({
          [field]: value,
        } as Pick<ArtistRegistrationState, typeof field>),

      setAnswer: (key, value) =>
        set((state) => ({
          answers: { ...state.answers, [key]: value },
        })),

      setAnswers: (answers) => set({ answers }),

      addPortfolio: (portfolio) =>
        set((state) => ({
          portfolios: [...state.portfolios, portfolio],
        })),

      removePortfolio: (path) =>
        set((state) => ({
          portfolios: state.portfolios.filter((item) => item.path !== path),
        })),

      reset: () =>
        set({
          ...initialState,
        }),
    }),
    { name: "artist-registration-storage" },
  ),
);
