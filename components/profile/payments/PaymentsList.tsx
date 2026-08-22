"use client";

import ContentCard from "../ContentCard";
import Card from "./Card";
import { useUserContactRequests } from "@/lib/services/landing/hook";
import { useLandingCopy } from "@/lib/hooks/useLandingCopy";

export default function PaymentsList() {
  const { data, isPending } = useUserContactRequests({ page: 1, count: 20 });
  const payments = data?.result ?? [];
  const copy = useLandingCopy();

  return (
    <ContentCard title={copy("profilePaymentsTitle")}>
      <div className="flex flex-col rounded-xl bg-gray-100/60 border-2 border-zinc-700/60 backdrop-blur-sm">
        {isPending ? (
          <p className="p-4 text-zinc-400">{copy("labelLoading")}</p>
        ) : payments.length === 0 ? (
          <p className="p-4 text-zinc-400">{copy("profilePaymentsEmpty")}</p>
        ) : (
          payments.map((payment) => (
            <Card key={payment.id} payment={payment} />
          ))
        )}
      </div>
    </ContentCard>
  );
}
