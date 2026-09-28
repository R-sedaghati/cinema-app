"use client";

import AdminNotifications from "@/components/admin/notifications/AdminNotifications";
import withNoSSR from "@/lib/utils/withNoSSR";
import { Divider } from "@dgshahr/ui-kit";
import React from "react";

function NotificationsPage() {
  return (
    <div className="flex flex-col pt-6 px-4">
      <h2 className="mb-2 text-lg font-semibold">اعلان‌ها</h2>
      <p className="mb-6 font-p2-regular text-gray-500">
        ثبت‌نام‌ها، پرداخت‌ها، تیکت‌ها و درخواست‌های رزومه جدید. روی هر اعلان بزنید تا به صفحه‌اش بروید.
      </p>
      <Divider className="mb-5" color="gray" size="thin" type="horizontal" />
      <AdminNotifications />
    </div>
  );
}

export default withNoSSR(NotificationsPage);
