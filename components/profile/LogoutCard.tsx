"use client";

import React from "react";
import ContentCard from "./ContentCard";
import Button from "../common/Button";

export default function LogoutCard() {
  return (
    <ContentCard title="خروج از حساب">
      <p className="text-sm leading-8 text-zinc-300">
        این دکمه در نسخه نهایی به سیستم احراز هویت متصل می‌شود. در حال حاضر، فقط
        برای کامل شدن نمای ظاهری صفحه قرار داده شده است.
      </p>

      <Button> خروج از حساب</Button>
    </ContentCard>
  );
}
