"use client";

import ContentCard from "../ContentCard";
import Card from "./Card";

export default function PaymentsList() {
  return (
    <ContentCard title="تاریخچه پرداخت‌ها">
      <div className="flex flex-col rounded-xl bg-gray-100/60 border-2 border-zinc-700/60 backdrop-blur-sm">
        <Card />
        <Card />
      </div>
    </ContentCard>
  );
}
