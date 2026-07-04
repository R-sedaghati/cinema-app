"use client";

import SliderTable from "@/components/admin/slider/SliderTable";
import withNoSSR from "@/lib/utils/withNoSSR";
import { Divider } from "@dgshahr/ui-kit";
import React from "react";

function SliderList() {
  return (
    <div className="flex flex-col pt-6 px-4">
      <h2 className="mb-6 text-lg font-semibold">مدیریت اسلایدرهای صفحه اصلی</h2>
      <Divider className="mb-5" color="gray" size="thin" type="horizontal" />
      <SliderTable />
    </div>
  );
}

export default withNoSSR(SliderList);
