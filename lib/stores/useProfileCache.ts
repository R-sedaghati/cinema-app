import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { IUserProfile } from "@/lib/services/landing/type";

/**
 * The signed-in user's own data (name, national code, email, profile fields …), kept in
 * localStorage so any screen — above all the registration form — can show it the moment it
 * opens, without waiting for a request and without the user typing it again.
 *
 * It is a cache, never the source of truth: `useUserProfile` shows it first and then
 * revalidates against the server, and every change to the profile refreshes it. It belongs
 * to one session: a copy saved for another login is ignored, and logging out clears it.
 */

/** Enough of the token to tell two logins apart without storing the token twice. */
export const sessionKeyOf = (accessToken: string) => (accessToken ? accessToken.slice(-24) : "");

interface ProfileCacheState {
  sessionKey: string;
  profile: IUserProfile | null;
  /** When the copy was last confirmed by the server (ms). */
  savedAt: number;
  save: (accessToken: string, profile: IUserProfile) => void;
  clear: () => void;
}

const useProfileCache = create<ProfileCacheState>()(
  persist(
    (set) => ({
      sessionKey: "",
      profile: null,
      savedAt: 0,
      save: (accessToken, profile) =>
        set({ sessionKey: sessionKeyOf(accessToken), profile, savedAt: Date.now() }),
      clear: () => set({ sessionKey: "", profile: null, savedAt: 0 }),
    }),
    { name: "landing-profile-cache", version: 1 },
  ),
);

/** The saved profile, only if it was saved for this session. */
export const readCachedProfile = (accessToken: string) => {
  const { sessionKey, profile, savedAt } = useProfileCache.getState();

  return accessToken && profile && sessionKey === sessionKeyOf(accessToken) ? { profile, savedAt } : null;
};

export default useProfileCache;
