"use client";

import TransactionTable from "@/components/admin/transactions/TransactionTable";
import withNoSSR from "@/lib/utils/withNoSSR";
import { Divider } from "@dgshahr/ui-kit";
import React from "react";

function TransactionList() {
  return (
    <div className="flex flex-col pt-6 px-4">
      <h2 className="mb-6 text-lg font-semibold">لیست تراکنش‌ها</h2>
      <Divider className="mb-5" color="gray" size="thin" type="horizontal" />
      <TransactionTable />
    </div>
  );
}

export default withNoSSR(TransactionList);
