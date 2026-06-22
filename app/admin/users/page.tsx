"use client";

import UsersTable from "@/components/admin/users/UsersTable";
import withNoSSR from "@/lib/utils/withNoSSR";
import { Divider } from "@dgshahr/ui-kit";
import React from "react";

function UsersList() {
  return (
    <div className="flex flex-col pt-6 px-4">
      <h2 className="mb-6 text-lg font-semibold">لیست هنرمندان</h2>
      <Divider className="mb-5" color="gray" size="thin" type="horizontal" />
      <UsersTable />
    </div>
  );
}

export default withNoSSR(UsersList);
