"use client";

import SmsLogs from "@/components/admin/sms-logs/SmsLogs";
import withNoSSR from "@/lib/utils/withNoSSR";
import { Divider } from "@dgshahr/ui-kit";
import React from "react";

function SmsLogsPage() {
  return (
    <div className="flex flex-col pt-6 px-4">
      <h2 className="mb-2 text-lg font-semibold">گزارش پنل پیامک</h2>
      <p className="mb-6 font-p2-regular text-gray-500">
        وضعیت اتصال سایت به سامانه ملی پیامک و هر پیامکی که سایت ارسال کرده است.
      </p>
      <Divider className="mb-5" color="gray" size="thin" type="horizontal" />
      <SmsLogs />
    </div>
  );
}

export default withNoSSR(SmsLogsPage);
