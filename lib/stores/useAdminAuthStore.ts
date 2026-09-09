import { create } from "zustand";
import { persist } from "zustand/middleware";

interface MainAuthStore {
  accessToken: string;
  userName: string;
  /** The logged-in admin's own id, so CRM assignment can offer "my items". */
  adminId: number | null;
  /** Server-assigned role. Only SUPER_ADMIN may delete users, so the UI has to know. */
  role: string;
  hasHydrated: boolean;
  setHasHydrated: () => void;
  login: (accessToken: string) => void;
  setUserName: (userName: string) => void;
  setAdminId: (adminId: number | null) => void;
  setRole: (role: string) => void;
  logout: () => void;
  isLoggedIn: () => boolean;
}

const useAdminAuthStore = create<MainAuthStore>()(
  persist(
    (set, get) => ({
      accessToken: "",
      userName: "",
      adminId: null,
      role: "",
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

      setRole: (role) =>
        set({
          role,
        }),

      logout: () =>
        set({
          accessToken: "",
          userName: "",
          adminId: null,
          role: "",
        }),

      isLoggedIn: () => !!get().accessToken,
    }),
    {
      name: "admin-auth-store",
      // hasHydrated is runtime-only: persisting it would restore a stale `true`
      // before rehydration actually finished.
      partialize: ({ accessToken, userName, adminId, role }) => ({
        accessToken,
        userName,
        adminId,
        role,
      }),
      // Fires after rehydration (and on error), so the guard never redirects
      // while the persisted token is still being read back.
      onRehydrateStorage: () => (state) => state?.setHasHydrated(),
    },
  ),
);

export default useAdminAuthStore;
