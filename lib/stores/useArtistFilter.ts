import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Gender } from "@/lib/mock/artists";

type Filters = {
  categoryId__in: number[];
  gender: Gender | "همه";
  city__in: number[];
};

interface ArtistFilterState {
  query: string;
  filters: Filters;
  setQuery: (q: string) => void;
  setFilters: (f: Partial<Filters>) => void;
  reset: () => void;
}

const initialFilters: Filters = {
  categoryId__in: [],
  gender: "همه",
  city__in: [],
};

export const useArtistFilterStore = create<ArtistFilterState>()(
  persist(
    (set) => ({
      query: "",
      filters: initialFilters,
      setQuery: (query) => set({ query }),
      setFilters: (f) => set((s) => ({ filters: { ...s.filters, ...f } })),
      reset: () => set({ query: "", filters: initialFilters }),
    }),
    { name: "artist-filter-storage" },
  ),
);
