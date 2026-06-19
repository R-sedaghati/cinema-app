import { create } from "zustand";
import { persist } from "zustand/middleware";

interface MainAuthStore {
  accessToken: string;
  userName: string;
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
    },
  ),
);

export default useAdminAuthStore;
