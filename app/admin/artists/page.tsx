"use client";

import ArtistTable from "@/components/admin/artists/ArtistTable";
import withNoSSR from "@/lib/utils/withNoSSR";
import { Divider } from "@dgshahr/ui-kit";
import React from "react";

function ArtistList() {
  return (
    <div className="flex flex-col pt-6 px-4">
      <h2 className="mb-6 text-lg font-semibold">لیست هنرمندان</h2>
      <Divider className="mb-5" color="gray" size="thin" type="horizontal" />
      <ArtistTable />
    </div>
  );
}

export default withNoSSR(ArtistList);
