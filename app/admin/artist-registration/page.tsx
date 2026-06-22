"use client";

import ArtistRegistrationTable from "@/components/admin/artist-registration/ArtistRegistrationTable";
import withNoSSR from "@/lib/utils/withNoSSR";
import { Divider } from "@dgshahr/ui-kit";
import React from "react";

function ArtistRegistrationList() {
  return (
    <div className="flex flex-col pt-6 px-4">
      <h2 className="mb-6 text-lg font-semibold">لیست فرم‌های ثبت‌نامی</h2>
      <Divider className="mb-5" color="gray" size="thin" type="horizontal" />
      <ArtistRegistrationTable />
    </div>
  );
}

export default withNoSSR(ArtistRegistrationList);
