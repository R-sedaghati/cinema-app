"use client";

import TutorialTable from "@/components/admin/tutorial/TutorialTable";
import withNoSSR from "@/lib/utils/withNoSSR";
import { Divider } from "@dgshahr/ui-kit";
import React from "react";

function TutorialList() {
  return (
    <div className="flex flex-col pt-6 px-4">
      <h2 className="mb-6 text-lg font-semibold">مدیریت آموزش‌ها</h2>
      <Divider className="mb-5" color="gray" size="thin" type="horizontal" />
      <TutorialTable />
    </div>
  );
}

export default withNoSSR(TutorialList);
