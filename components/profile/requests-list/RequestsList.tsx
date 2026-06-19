"use client";

import ContentCard from "../ContentCard";
import { Table } from "@dgshahr/ui-kit";
import { columnData, columns } from "./MockData";

export default function RequestsList() {
  return (
    <ContentCard title="درخواست‌های ارتباط با هنرمندان">
      <Table
        className="w-full"
        stickyTableHeader
        wrapperClassName="h-130 overflow-scroll"
        columns={columns}
        data={columnData}
        rowKey="id"
      />
    </ContentCard>
  );
}
