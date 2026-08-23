"use client";

import { Button, Card, Divider, Input } from "@dgshahr/ui-kit";
import { useState } from "react";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import {
  useAdminAdjustUserWallet,
  useAdminUserWallet,
} from "@/lib/services/admin/hook";
import convertEnNumberToFaNumberWithSeparation from "@/lib/utils/convertEnNumberToFaNumberWithSeparation";
import convertGregorianTimeToShamsiTime from "@/lib/utils/convertGregorianTimeToShamsiTime";

/**
 * A user's wallet: balance, ledger, and manual adjustment.
 *
 * Adjustments are signed — a negative amount claws money back — and always require a
 * reason, because this is the one place balance moves without a payment behind it.
 */
const UserWallet = ({ userId }: { userId: number }) => {
  const queryClient = useQueryClient();
  const { data, isPending: isLoading } = useAdminUserWallet(userId);
  const { mutate, isPending } = useAdminAdjustUserWallet(userId);

  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  const balance = data?.result?.balance ?? 0;
  const transactions = data?.result?.transactions ?? [];

  const handleSubmit = () => {
    const parsed = Number(amount);

    if (!Number.isFinite(parsed) || parsed === 0) {
      toast.error("مبلغ باید عددی غیر از صفر باشد.");
      return;
    }

    if (!description.trim()) {
      toast.error("توضیح دلیل تغییر الزامی است.");
      return;
    }

    mutate(
      { amount: parsed, description: description.trim() },
      {
        onSuccess: () => {
          toast.success("موجودی کیف پول تغییر کرد");
          setAmount("");
          setDescription("");
          queryClient.invalidateQueries({ queryKey: ["adminUserWallet", userId] });
        },
        onError: () => toast.error("خطا در تغییر موجودی"),
      },
    );
  };

  return (
    <Card>
      <div className="flex flex-col gap-4">
        <p className="font-h3-bold text-error-500">کیف پول</p>
        <Divider color="gray" size="thin" type="horizontal" />

        <div className="flex items-center justify-between p-5 border border-solid border-gray-300 rounded-xl">
          <p className="font-p1-regular">موجودی فعلی</p>
          <p className="font-h5-bold">
            {isLoading
              ? "—"
              : `${convertEnNumberToFaNumberWithSeparation(balance)} تومان`}
          </p>
        </div>

        <div className="flex flex-col gap-3 border border-solid border-gray-300 rounded-xl p-3">
          <p className="font-p1-medium">تغییر دستی موجودی</p>
          <div className="flex flex-col gap-3 md:flex-row">
            <Input
              labelContent="مبلغ"
              placeholder="مثلاً 50000 یا 50000-"
              postfix="تومان"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              hintMessage="عدد مثبت به موجودی اضافه و عدد منفی از آن کم می‌کند."
              wrapperClassName="md:w-1/3"
            />
            <Input
              labelContent="دلیل تغییر"
              placeholder="دلیل این تغییر را بنویسید"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              wrapperClassName="md:w-2/3"
            />
          </div>
          <div className="flex justify-end">
            <Button
              color="error"
              disabled={isPending}
              isLoading={isPending}
              onClick={handleSubmit}
            >
              ثبت تغییر
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <p className="font-p1-medium">تاریخچه تراکنش‌ها</p>
          {isLoading ? (
            <p className="font-p2-regular text-gray-500">در حال بارگذاری...</p>
          ) : transactions.length === 0 ? (
            <p className="font-p2-regular text-gray-500">
              هنوز تراکنشی ثبت نشده است.
            </p>
          ) : (
            transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between gap-3 p-4 border border-solid border-gray-300 rounded-xl"
              >
                <div className="flex flex-col gap-1">
                  <p className="font-p1-regular">{transaction.typeLabel}</p>
                  <p className="font-p2-regular text-gray-500">
                    {transaction.description ?? ""}
                    {transaction.adminUsername
                      ? ` (${transaction.adminUsername})`
                      : ""}
                  </p>
                </div>
                <p className="font-p1-regular text-nowrap">
                  {transaction.amount > 0 ? "+" : "−"}{" "}
                  {convertEnNumberToFaNumberWithSeparation(
                    Math.abs(transaction.amount),
                  )}
                </p>
                <p className="font-p2-regular text-gray-500 text-nowrap">
                  {transaction.createdAt &&
                    convertGregorianTimeToShamsiTime(transaction.createdAt)}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </Card>
  );
};

export default UserWallet;
