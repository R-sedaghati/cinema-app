"use client";

import CategoryTable from "@/components/admin/category/CategoryTable";
import withNoSSR from "@/lib/utils/withNoSSR";
import { Divider } from "@dgshahr/ui-kit";
import React from "react";

function CategoryList() {
  return (
    <div className="flex flex-col pt-6 px-4">
      <h2 className="mb-6 text-lg font-semibold">دسته‌بندی و فرم‌ها</h2>
      <Divider className="mb-5" color="gray" size="thin" type="horizontal" />
      <CategoryTable />
    </div>
  );
}

export default withNoSSR(CategoryList);
