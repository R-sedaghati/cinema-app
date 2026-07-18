"use client";

import CategoryForm from "@/components/admin/category/CategoryForm";
import withNoSSR from "@/lib/utils/withNoSSR";

function CategoryCreate() {
  return <CategoryForm />;
}

export default withNoSSR(CategoryCreate);
