import { create } from "zustand";
import { persist } from "zustand/middleware";

interface MainAuthStore {
  accessToken: string;
  userName: string;
  /** The logged-in admin's own id, so CRM assignment can offer "my items". */
  adminId: number | null;
  hasHydrated: boolean;
  setHasHydrated: () => void;
  login: (accessToken: string) => void;
  setUserName: (userName: string) => void;
  setAdminId: (adminId: number | null) => void;
  logout: () => void;
  isLoggedIn: () => boolean;
}

const useAdminAuthStore = create<MainAuthStore>()(
  persist(
    (set, get) => ({
      accessToken: "",
      userName: "",
      adminId: null,
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

      setAdminId: (adminId) =>
        set({
          adminId,
        }),

      logout: () =>
        set({
          accessToken: "",
          userName: "",
          adminId: null,
        }),

      isLoggedIn: () => !!get().accessToken,
    }),
    {
      name: "admin-auth-store",
      // hasHydrated is runtime-only: persisting it would restore a stale `true`
      // before rehydration actually finished.
      partialize: ({ accessToken, userName, adminId }) => ({
        accessToken,
        userName,
        adminId,
      }),
      // Fires after rehydration (and on error), so the guard never redirects
      // while the persisted token is still being read back.
      onRehydrateStorage: () => (state) => state?.setHasHydrated(),
    },
  ),
);

export default useAdminAuthStore;
