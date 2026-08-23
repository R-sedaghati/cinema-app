"use client";

import React from "react";
import ContentCard from "./ContentCard";
import Button from "../common/Button";
import useAuthStore from "@/lib/stores/useAuthStore";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useLandingCopy } from "@/lib/hooks/useLandingCopy";

export default function LogoutCard() {
  const router = useRouter();
  const { logout } = useAuthStore();
  const copy = useLandingCopy();

  return (
    <ContentCard title={copy("profileLogoutTitle")}>
      <Button
        onClick={() => {
          logout();
          toast.success(copy("profileLogoutSuccess"));
          router.push("/");
        }}
      >
        {copy("profileLogoutTitle")}
      </Button>
    </ContentCard>
  );
}
