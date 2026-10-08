import { create } from "zustand";
import { persist } from "zustand/middleware";
import useProfileCache from "./useProfileCache";

interface AuthState {
  accessToken: string;
  refreshToken: string;
  isLoggedIn: boolean;
  phoneNumber: string;
  login: (
    accessToken: string,
    refreshToken: string,
    isLoggedIn: boolean,
  ) => void;
  logout: () => void;
  clearPhoneNumber: () => void;
  setPhoneNumber: (phoneNumber: string) => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: "",
      refreshToken: "",
      isLoggedIn: false,
      phoneNumber: "",

      clearPhoneNumber: () => {
        set(() => ({ phoneNumber: "" }));
      },
      setPhoneNumber: (phoneNumber: string) => {
        set(() => ({ phoneNumber }));
      },
      login: (accessToken: string, refreshToken: string) =>
        set(() => ({
          accessToken,
          refreshToken,
          isLoggedIn: true,
        })),
      logout: () => {
        // The copy of the user's data belongs to this login; it must not outlive it.
        useProfileCache.getState().clear();

        set(() => ({
          accessToken: "",
          refreshToken: "",
          isLoggedIn: false,
        }));
      },
    }),
    { name: "landing-auth-storage" },
  ),
);

export default useAuthStore;
