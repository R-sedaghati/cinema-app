"use client";

import SmsTemplateTable from "@/components/admin/sms/SmsTemplateTable";
import withNoSSR from "@/lib/utils/withNoSSR";
import { Divider } from "@dgshahr/ui-kit";
import React from "react";

function SmsTemplateList() {
  return (
    <div className="flex flex-col pt-6 px-4">
      <h2 className="mb-2 text-lg font-semibold">مدیریت پیامک‌های خودکار</h2>
      <p className="mb-6 font-p2-regular text-gray-500">
        متن هر پیامک و فعال بودن آن را در مراحل مختلف درخواست هنرمند تعیین کنید.
      </p>
      <Divider className="mb-5" color="gray" size="thin" type="horizontal" />
      <SmsTemplateTable />
    </div>
  );
}

export default withNoSSR(SmsTemplateList);
