"use client";

import React from "react";
import ContentCard from "./ContentCard";

export default function SupportCard() {
  return (
    <ContentCard title="پشتیبانی">
      <p className="text-sm leading-8 text-zinc-300">
        این بخش می‌تواند برای نمایش تیکت‌های پشتیبانی و پیام‌های شما با تیم
        پشتیبانی استفاده شود. در حال حاضر فقط نمای کلی صفحه پیاده‌سازی شده است.
      </p>
    </ContentCard>
  );
}
