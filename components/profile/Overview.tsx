"use client";

import React, { useEffect, useState } from "react";
import ContentCard from "./ContentCard";
import { Input } from "@dgshahr/ui-kit";
import Button from "../common/Button";
import { isMobile } from "react-device-detect";
import {
  useUpdateUserProfile,
  useUserProfile,
} from "@/lib/services/landing/hook";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function Overview() {
  const router = useRouter();
  const { data } = useUserProfile();
  const { mutate, isPending } = useUpdateUserProfile();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone_number: "",
  });

  useEffect(() => {
    if (!data) return;

    setForm({
      firstName: data.firstName ?? "",
      lastName: data.lastName ?? "",
      email: data.email ?? "",
      phone_number: data.phone_number ?? "",
    });
  }, [data]);

  const handleChange =
    (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    mutate(
      {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
      },
      {
        onSuccess: () => {
          toast.success("با موفقیت تغییر کرد");
          router.push("/profile");
        },
      },
    );
  };

  return (
    <ContentCard title="ویرایش پروفایل">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-8 rounded-xl border-2 border-zinc-700/60 bg-gray-100/60 p-4 shadow-[0_10px_60px_rgba(0,0,0,0.8)] backdrop-blur-sm"
      >
        <div className="grid w-full gap-4 md:grid-cols-2">
          <Input
            id="first-name"
            labelContent="نام"
            required
            placeholder="نام خود را وارد کنید."
            value={form.firstName}
            onChange={handleChange("firstName")}
          />

          <Input
            id="last-name"
            labelContent="نام خانوادگی"
            required
            placeholder="نام خانوادگی خود را وارد کنید."
            value={form.lastName}
            onChange={handleChange("lastName")}
          />

          <Input
            id="email"
            labelContent="ایمیل"
            required
            dir="ltr"
            placeholder="ایمیل خود را وارد کنید."
            value={form.email}
            onChange={handleChange("email")}
          />

          <Input
            id="phone"
            labelContent="شماره موبایل"
            required
            dir="ltr"
            type="tel"
            disabled
            placeholder="09*********"
            value={form.phone_number}
          />
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            isFullWidth={isMobile}
            className="rounded-full!"
            isLoading={isPending}
            disabled={isPending}
          >
            به‌روزرسانی پروفایل
          </Button>
        </div>
      </form>
    </ContentCard>
  );
}
