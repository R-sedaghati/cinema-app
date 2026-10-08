"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import useAuthStore from "@/lib/stores/useAuthStore";
import useProfileCache, { readCachedProfile } from "@/lib/stores/useProfileCache";

/**
 * Keeps the stored copy of the user's data and the open tabs in step. When another tab
 * changes the profile (it writes the shared localStorage copy), this tab takes the new
 * copy at once instead of showing the old one until its next revalidation.
 */
export default function ProfileCacheSync() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== "landing-profile-cache") return;

      void Promise.resolve(useProfileCache.persist.rehydrate()).then(() => {
        const { accessToken } = useAuthStore.getState();
        const cached = readCachedProfile(accessToken);

        if (cached) {
          queryClient.setQueryData(["userProfile", accessToken], cached.profile, { updatedAt: cached.savedAt });
        }
      });
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [queryClient]);

  return null;
}
