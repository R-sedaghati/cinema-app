"use client";

import SmsRuleTable from "@/components/admin/sms/SmsRuleTable";
import withNoSSR from "@/lib/utils/withNoSSR";
import { Divider } from "@dgshahr/ui-kit";
import React from "react";

function SmsTemplateList() {
  return (
    <div className="flex flex-col pt-6 px-4">
      <h2 className="mb-2 text-lg font-semibold">مدیریت پیامک‌های خودکار</h2>
      <p className="mb-6 font-p2-regular text-gray-500">
        در هر مرحله از سایت (ثبت فرم، پرداخت، تایید، پشتیبانی و …) هر تعداد پیامک بخواهید اضافه کنید؛ به کاربر، مدیران یا شماره‌های دلخواه، به‌صورت متن آزاد یا الگوی ملی پیامک. هر پیامک را می‌توانید ویرایش، متوقف یا حذف کنید.
      </p>
      <Divider className="mb-5" color="gray" size="thin" type="horizontal" />
      <SmsRuleTable />
    </div>
  );
}

export default withNoSSR(SmsTemplateList);
