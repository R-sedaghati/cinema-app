"use client";

import ContentCard from "../ContentCard";
import { Table } from "@dgshahr/ui-kit";
import { columnData, columns } from "./MockData";

export default function FormsList() {
  return (
    <ContentCard title="لیست فرم‌ها">
      <Table
        rowKey="id"
        stickyTableHeader
        className="w-full"
        wrapperClassName="overflow-hidden"
        columns={columns}
        data={columnData}
      />
    </ContentCard>
  );
}
