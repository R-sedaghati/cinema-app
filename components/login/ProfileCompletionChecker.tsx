"use client";

import { useEffect, useRef, useState } from "react";
import { useUserProfile } from "@/lib/services/landing/hook";
import useAuthStore from "@/lib/stores/useAuthStore";
import CompleteProfileDrawer from "./CompleteProfileDrawer";

const ProfileCompletionChecker = () => {
  const { accessToken } = useAuthStore();
  const { data: profile } = useUserProfile();
  const [open, setOpen] = useState(false);
  const hasPrompted = useRef(false);

  useEffect(() => {
    if (!accessToken || !profile || hasPrompted.current) return;
    if (!profile.firstName || !profile.lastName) {
      hasPrompted.current = true;
      setOpen(true);
    }
  }, [profile, accessToken]);

  return <CompleteProfileDrawer open={open} onClose={() => setOpen(false)} />;
};

export default ProfileCompletionChecker;
