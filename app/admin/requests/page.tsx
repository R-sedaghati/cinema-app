"use client";

import RequestTable from "@/components/admin/requests/RequestTable";
import withNoSSR from "@/lib/utils/withNoSSR";
import { Divider } from "@dgshahr/ui-kit";
import React from "react";

function RequestList() {
  return (
    <div className="flex flex-col pt-6 px-4">
      <h2 className="mb-6 text-lg font-semibold">لیست درخواست‌های ارتباط</h2>
      <Divider className="mb-5" color="gray" size="thin" type="horizontal" />
      <RequestTable />
    </div>
  );
}

export default withNoSSR(RequestList);
