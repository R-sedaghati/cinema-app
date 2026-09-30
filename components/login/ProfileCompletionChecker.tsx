"use client";

import { useEffect, useRef, useState } from "react";
import { useProfileFields, useUserProfile } from "@/lib/services/landing/hook";
import useAuthStore from "@/lib/stores/useAuthStore";
import { missingProfileFields } from "@/lib/utils/profileFields";
import CompleteProfileDrawer from "./CompleteProfileDrawer";

const ProfileCompletionChecker = () => {
  const { accessToken } = useAuthStore();
  const { data: profile } = useUserProfile();
  const { data: fields } = useProfileFields();
  const [open, setOpen] = useState(false);
  const hasPrompted = useRef(false);

  useEffect(() => {
    if (!accessToken || !profile || !fields || hasPrompted.current) return;
    if (missingProfileFields(profile, fields).length) {
      hasPrompted.current = true;
      setOpen(true);
    }
  }, [profile, fields, accessToken]);

  return <CompleteProfileDrawer open={open} onClose={() => setOpen(false)} />;
};

export default ProfileCompletionChecker;
