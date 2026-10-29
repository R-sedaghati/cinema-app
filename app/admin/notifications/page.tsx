"use client";

import AdminNotifications from "@/components/admin/notifications/AdminNotifications";
import withNoSSR from "@/lib/utils/withNoSSR";
import { Button, Divider } from "@dgshahr/ui-kit";
import { useRouter } from "next/navigation";
import React from "react";

function NotificationsPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col pt-6 px-4">
      <h2 className="mb-2 text-lg font-semibold">اعلان‌ها</h2>
      <div className="flex justify-between items-center mb-2">
        <p className="font-p2-regular text-gray-500">
          ثبت‌نام‌ها، پرداخت‌ها، تیکت‌ها و درخواست‌های رزومه جدید. روی هر اعلان
          بزنید تا به صفحه‌اش بروید.
        </p>
        <Button variant="outline" onClick={() => router.back()}>
          بازگشت
        </Button>{" "}
      </div>
      <Divider className="mb-5" color="gray" size="thin" type="horizontal" />
      <AdminNotifications />
    </div>
  );
}

export default withNoSSR(NotificationsPage);
