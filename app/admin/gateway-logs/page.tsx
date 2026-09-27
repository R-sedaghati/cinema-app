"use client";

import GatewayLogs from "@/components/admin/gateway-logs/GatewayLogs";
import withNoSSR from "@/lib/utils/withNoSSR";
import { Divider } from "@dgshahr/ui-kit";
import React from "react";

function GatewayLogsPage() {
  return (
    <div className="flex flex-col pt-6 px-4">
      <h2 className="mb-2 text-lg font-semibold">گزارش درگاه پرداخت</h2>
      <p className="mb-6 font-p2-regular text-gray-500">
        وضعیت اتصال سایت به درگاه بانک سامان و هر اتفاقی که در پرداخت‌ها افتاده است.
      </p>
      <Divider className="mb-5" color="gray" size="thin" type="horizontal" />
      <GatewayLogs />
    </div>
  );
}

export default withNoSSR(GatewayLogsPage);
