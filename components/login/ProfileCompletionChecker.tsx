"use client";

import { useEffect, useRef, useState } from "react";
import { useProfileFields, useUserProfile } from "@/lib/services/landing/hook";
import useAuthStore from "@/lib/stores/useAuthStore";
import useLoginDrawerStore from "@/lib/stores/useLoginDrawerStore";
import { missingProfileFields } from "@/lib/utils/profileFields";
import CompleteProfileDrawer from "./CompleteProfileDrawer";

const ProfileCompletionChecker = () => {
  const { accessToken } = useAuthStore();
  const isLoginOpen = useLoginDrawerStore((state) => state.isOpen);
  const { data: profile } = useUserProfile();
  const { data: fields } = useProfileFields();
  const [open, setOpen] = useState(false);
  // The session already asked once. Keyed by token, not a page-wide flag: a second account
  // logging in on the same tab must be asked too, while a dismissal sticks for its own.
  const promptedFor = useRef("");

  useEffect(() => {
    if (!accessToken) {
      promptedFor.current = "";
      setOpen(false);
      return;
    }
    // Never stack on top of the login drawer; wait until it has closed.
    if (!profile || !fields || isLoginOpen || promptedFor.current === accessToken) return;

    if (missingProfileFields(profile, fields).length) {
      promptedFor.current = accessToken;
      setOpen(true);
    }
  }, [profile, fields, accessToken, isLoginOpen]);

  return <CompleteProfileDrawer open={open} onClose={() => setOpen(false)} />;
};

export default ProfileCompletionChecker;
