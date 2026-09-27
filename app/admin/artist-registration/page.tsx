"use client";

import ArtistRegistrationTable from "@/components/admin/artist-registration/ArtistRegistrationTable";
import withNoSSR from "@/lib/utils/withNoSSR";
import { Divider } from "@dgshahr/ui-kit";
import { useSearchParams } from "next/navigation";
import React from "react";

function ArtistRegistrationList() {
  // Remount on query change so sidebar/category links reseed the filters.
  const query = useSearchParams().toString();
  return (
    <div className="flex flex-col pt-6 px-4">
      <h2 className="mb-6 text-lg font-semibold">لیست فرم‌های ثبت‌نامی</h2>
      <Divider className="mb-5" color="gray" size="thin" type="horizontal" />
      <ArtistRegistrationTable key={query} />
    </div>
  );
}

export default withNoSSR(ArtistRegistrationList);
