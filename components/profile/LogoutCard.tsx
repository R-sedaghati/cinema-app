"use client";

import React from "react";
import ContentCard from "./ContentCard";
import Button from "../common/Button";
import useAuthStore from "@/lib/stores/useAuthStore";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function LogoutCard() {
  const router = useRouter();
  const { logout } = useAuthStore();

  return (
    <ContentCard title="خروج از حساب">
      <Button
        onClick={() => {
          logout();
          toast.success("با موفقیت خارج شدید");
          router.push("/");
        }}
      >
        خروج از حساب
      </Button>
    </ContentCard>
  );
}
