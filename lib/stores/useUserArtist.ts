import { create } from "zustand";
import { persist } from "zustand/middleware";

export type PortfolioType = "IMAGE" | "VIDEO";
export type Gender = "MAN" | "WOMAN";

export interface Portfolio {
  path: string;
  type: PortfolioType;
}

interface ArtistRegistrationState {
  // Stepper
  step: number;

  // Edit mode — non-null means editing an existing request
  editId: number | null;

  // Selected category (for display)
  selectedCategoryId: number | null;
  selectedCategoryTitle: string;

  // Form
  categoryId: number[];
  firstName: string;
  lastName: string;
  height: number | null;
  weight: number | null;
  language: string;
  gender: Gender | "";
  birthDate: string;
  dialect: string;
  email: string;
  address: string;
  province: string;
  city: string;
  postalCode: string;
  education: string;
  major: string;
  portfolios: Portfolio[];
  avatar: string;
  aboutMe: string;

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

  firstName: "",
  lastName: "",
  height: null,
  weight: null,
  language: "",
  gender: "" as Gender | "",
  birthDate: "",
  dialect: "",
  email: "",
  address: "",
  province: "",
  city: "",
  postalCode: "",
  education: "",
  major: "",
  portfolios: [] as Portfolio[],
  avatar: "",
  aboutMe: "",
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
