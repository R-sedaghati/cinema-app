"use client";

import NotificationSettingsForm from "@/components/admin/settings/NotificationSettingsForm";
import PaymentSettingsForm from "@/components/admin/settings/PaymentSettingsForm";
import withNoSSR from "@/lib/utils/withNoSSR";

function Settings() {
  return (
    <div className="flex flex-col gap-5">
      <PaymentSettingsForm />
      <NotificationSettingsForm />
    </div>
  );
}

export default withNoSSR(Settings);
