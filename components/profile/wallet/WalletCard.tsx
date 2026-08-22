"use client";

import ContentCard from "../ContentCard";
import convertEnNumberToFaNumberWithSeparation from "@/lib/utils/convertEnNumberToFaNumberWithSeparation";
import convertGregorianTimeToShamsiTime from "@/lib/utils/convertGregorianTimeToShamsiTime";
import {
  useUserWalletBalance,
  useUserWalletTransactions,
} from "@/lib/services/landing/hook";
import { Divider } from "@dgshahr/ui-kit";
import { IWalletTransactionItem } from "@/lib/services/landing/type";
import { useLandingCopy } from "@/lib/hooks/useLandingCopy";

/** Signed amounts read better with an explicit sign than with colour alone. */
const formatAmount = (amount: number, currency: string) => {
  const sign = amount > 0 ? "+" : "−";
  return `${sign} ${convertEnNumberToFaNumberWithSeparation(Math.abs(amount))} ${currency}`;
};

const Row = ({
  transaction,
  currency,
}: {
  transaction: IWalletTransactionItem;
  currency: string;
}) => (
  <>
    <div className="min-h-21 p-4 flex flex-col gap-2">
      <div className="flex justify-between items-center gap-4">
        <p className="line-clamp-1">{transaction.typeLabel}</p>
        <p
          className={
            transaction.amount > 0
              ? "text-nowrap text-emerald-400"
              : "text-nowrap text-zinc-300"
          }
        >
          {formatAmount(transaction.amount, currency)}
        </p>
      </div>
      <div className="flex justify-between items-center gap-4">
        <p className="text-zinc-400 text-sm line-clamp-1">
          {transaction.description ?? ""}
        </p>
        <p className="text-zinc-400 text-sm text-nowrap">
          {convertGregorianTimeToShamsiTime(transaction.createdAt)}
        </p>
      </div>
    </div>
    <Divider type="horizontal" className="last:hidden" />
  </>
);

export default function WalletCard() {
  const { data: balanceData, isPending: isBalancePending } =
    useUserWalletBalance();
  const { data, isPending } = useUserWalletTransactions({ page: 1, count: 20 });

  const balance = balanceData?.result?.balance ?? 0;
  const transactions = data?.result ?? [];
  const copy = useLandingCopy();

  return (
    <ContentCard title={copy("profileWalletTitle")}>
      <div className="rounded-xl bg-gray-100/60 border-2 border-zinc-700/60 backdrop-blur-sm p-6 flex flex-col gap-2">
        <span className="text-zinc-400 text-sm">{copy("profileWalletBalance")}</span>
        <span className="text-zinc-50 text-2xl font-semibold">
          {isBalancePending
            ? "—"
            : `${convertEnNumberToFaNumberWithSeparation(balance)} ${copy("labelCurrency")}`}
        </span>
        <p className="text-zinc-400 text-sm leading-7">
          {copy("profileWalletNote")}
        </p>
      </div>

      <div className="flex flex-col rounded-xl bg-gray-100/60 border-2 border-zinc-700/60 backdrop-blur-sm">
        {isPending ? (
          <p className="p-4 text-zinc-400">{copy("labelLoading")}</p>
        ) : transactions.length === 0 ? (
          <p className="p-4 text-zinc-400">{copy("profileWalletEmpty")}</p>
        ) : (
          transactions.map((transaction) => (
            <Row
              key={transaction.id}
              transaction={transaction}
              currency={copy("labelCurrency")}
            />
          ))
        )}
      </div>
    </ContentCard>
  );
}
