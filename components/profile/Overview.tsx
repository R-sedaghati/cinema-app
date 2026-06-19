"use client";

import React from "react";
import ContentCard from "./ContentCard";
import { Input } from "@dgshahr/ui-kit";
import Button from "../common/Button";
import { isMobile } from "react-device-detect";

export default function Overview() {
  return (
    <ContentCard title="ویرایش پروفایل">
      <form className="flex gap-8 flex-col rounded-xl bg-gray-100/60 border-2 border-zinc-700/60 p-4 shadow-[0_10px_60px_rgba(0,0,0,0.8)] backdrop-blur-sm">
        <div className="w-full grid gap-4 md:grid-cols-2  ">
          <Input
            id="first-name"
            labelContent="نام"
            required
            placeholder="نام خود را وارد کنید."
          />
          <Input
            id="last-name"
            labelContent="نام خانوادگی"
            required
            placeholder="نام خانوادگی خود را وارد کنید."
          />
          <Input
            id="email"
            labelContent="ایمیل"
            required
            placeholder="ایمیل خود را وارد کنید."
          />
          <Input
            id="phone"
            labelContent="شماره موبایل"
            required
            dir="ltr"
            type="tel"
            disabled
            placeholder="09*********"
          />
        </div>
        <div className="flex justify-end">
          <Button
            isFullWidth={isMobile}
            className="rounded-full!"
            type="submit"
          >
            به‌روزرسانی پروفایل
          </Button>
        </div>
      </form>
    </ContentCard>
  );
}
