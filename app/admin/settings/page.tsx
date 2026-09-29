"use client";

import AdminProfileForm from "@/components/admin/settings/AdminProfileForm";
import NotificationSettingsForm from "@/components/admin/settings/NotificationSettingsForm";
import PaymentSettingsForm from "@/components/admin/settings/PaymentSettingsForm";
import UploadLimitsForm from "@/components/admin/settings/UploadLimitsForm";
import withNoSSR from "@/lib/utils/withNoSSR";

function Settings() {
  return (
    <div className="flex flex-col gap-5">
      <AdminProfileForm />
      <PaymentSettingsForm />
      <NotificationSettingsForm />
      <UploadLimitsForm />
    </div>
  );
}

export default withNoSSR(Settings);
