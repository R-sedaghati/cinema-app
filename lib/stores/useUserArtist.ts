import { create } from "zustand";

// ponytail: one-shot cleanup of the removed persist key; delete once users have loaded the app again
if (typeof window !== "undefined")
  localStorage.removeItem("artist-registration-storage");

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
  answers: Record<string, unknown>;

  /**
   * Storage path -> presigned url, for the already-uploaded files of a request being
   * edited. Answers hold paths (that is what the API takes back); previews need urls.
   */
  portfolioUrls: Record<string, string>;

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
  addPortfolioUrl: (path: string, url: string) => void;
  setAnswers: (answers: Record<string, unknown>) => void;

  reset: () => void;
}

const initialState = () => ({
  step: 0,
  editId: null as number | null,

  selectedCategoryId: null as number | null,
  selectedCategoryTitle: "",

  categoryId: [],

  answers: {} as Record<string, unknown>,

  portfolioUrls: {} as Record<string, string>,
});

export const useArtistRegistrationStore = create<ArtistRegistrationState>()(
  (set) => ({
    ...initialState(),

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

    addPortfolioUrl: (path, url) =>
      set((state) => ({
        portfolioUrls: { ...state.portfolioUrls, [path]: url },
      })),

    setAnswers: (answers) => set({ answers }),

    reset: () =>
      set({
        ...initialState(),
      }),
  }),
);
