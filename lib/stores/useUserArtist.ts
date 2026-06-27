import { create } from "zustand";

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

  // Form Actions
  setField: <K extends keyof ArtistRegistrationState>(
    field: K,
    value: ArtistRegistrationState[K],
  ) => void;

  addPortfolio: (portfolio: Portfolio) => void;
  removePortfolio: (index: number) => void;

  reset: () => void;
}

const initialState = {
  step: 0,
  editId: null as number | null,

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

export const useArtistRegistrationStore = create<ArtistRegistrationState>(
  (set) => ({
    ...initialState,

    setStep: (step) => set({ step }),

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

    removePortfolio: (index) =>
      set((state) => ({
        portfolios: state.portfolios.filter((_, i) => i !== index),
      })),

    reset: () =>
      set({
        ...initialState,
      }),
  }),
);
