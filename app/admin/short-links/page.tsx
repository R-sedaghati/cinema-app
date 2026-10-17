"use client";

import ShortLinkManager from "@/components/admin/shortLink/ShortLinkManager";
import withNoSSR from "@/lib/utils/withNoSSR";
import { Divider } from "@dgshahr/ui-kit";
import React from "react";

function ShortLinks() {
  return (
    <div className="flex flex-col pt-6 px-4">
      <h2 className="mb-6 text-lg font-semibold">لینک‌های کوتاه</h2>
      <Divider className="mb-5" color="gray" size="thin" type="horizontal" />
      <ShortLinkManager />
    </div>
  );
}

export default withNoSSR(ShortLinks);
