"use client";

import Payments from "@/components/admin/payments/Payments";
import withNoSSR from "@/lib/utils/withNoSSR";
import { Divider } from "@dgshahr/ui-kit";
import React from "react";

function PaymentsPage() {
  return (
    <div className="flex flex-col pt-6 px-4">
      <h2 className="mb-2 text-lg font-semibold">تراکنش‌ها</h2>
      <p className="mb-6 font-p2-regular text-gray-500">
        همه پرداخت‌های هزینه ثبت‌نام، از درگاه بانک یا کیف پول.
      </p>
      <Divider className="mb-5" color="gray" size="thin" type="horizontal" />
      <Payments />
    </div>
  );
}

export default withNoSSR(PaymentsPage);
