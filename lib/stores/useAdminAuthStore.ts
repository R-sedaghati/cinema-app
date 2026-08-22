import { create } from "zustand";
import { persist } from "zustand/middleware";

interface MainAuthStore {
  accessToken: string;
  userName: string;
  hasHydrated: boolean;
  setHasHydrated: () => void;
  login: (accessToken: string) => void;
  setUserName: (userName: string) => void;
  logout: () => void;
  isLoggedIn: () => boolean;
}

const useAdminAuthStore = create<MainAuthStore>()(
  persist(
    (set, get) => ({
      accessToken: "",
      userName: "",
      hasHydrated: false,

      setHasHydrated: () => set({ hasHydrated: true }),

      login: (accessToken) =>
        set({
          accessToken,
        }),

      setUserName: (userName) =>
        set({
          userName,
        }),

      logout: () =>
        set({
          accessToken: "",
          userName: "",
        }),

      isLoggedIn: () => !!get().accessToken,
    }),
    {
      name: "admin-auth-store",
      // hasHydrated is runtime-only: persisting it would restore a stale `true`
      // before rehydration actually finished.
      partialize: ({ accessToken, userName }) => ({ accessToken, userName }),
      // Fires after rehydration (and on error), so the guard never redirects
      // while the persisted token is still being read back.
      onRehydrateStorage: () => (state) => state?.setHasHydrated(),
    },
  ),
);

export default useAdminAuthStore;
