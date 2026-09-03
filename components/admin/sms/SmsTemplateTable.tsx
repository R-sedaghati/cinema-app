"use client";

import { useState } from "react";
import { Table } from "@dgshahr/ui-kit";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import TableEmptyState from "@/components/common/TableEmptyState";
import { SMS_EVENT_ORDER } from "@/lib/constants/sms/events";
import {
  useAdminSmsTemplateList,
  useAdminSmsTemplateUpdate,
} from "@/lib/services/admin/hook";
import { ESmsEvent, ISmsTemplate } from "@/lib/services/admin/type";
import { tableEmptyMessage } from "@/lib/mock/messages";
import withNoSSR from "@/lib/utils/withNoSSR";
import SmsTemplateDrawer from "./SmsTemplateDrawer";
import { generateColumns } from "./columns";

function SmsTemplateTable() {
  const queryClient = useQueryClient();

  const { data, isPending } = useAdminSmsTemplateList();
  const { mutate: updateTemplate } = useAdminSmsTemplateUpdate();

  const [editing, setEditing] = useState<ISmsTemplate | null>(null);
  /** Guards the row whose toggle is in flight against a second click. */
  const [togglingEvent, setTogglingEvent] = useState<ESmsEvent | null>(null);

  // The row set is fixed, so order by the pipeline rather than by whatever the API returns.
  const templates = [...(data?.result ?? [])].sort(
    (a, b) => SMS_EVENT_ORDER.indexOf(a.event) - SMS_EVENT_ORDER.indexOf(b.event),
  );

  const handleToggle = (template: ISmsTemplate) => {
    setTogglingEvent(template.event);

    updateTemplate(
      { event: template.event, payload: { isActive: !template.isActive } },
      {
        onSuccess: () => {
          toast.success(
            template.isActive ? "ارسال این پیامک غیرفعال شد" : "ارسال این پیامک فعال شد",
          );
          queryClient.invalidateQueries({ queryKey: ["smsTemplateList"] });
        },
        onError: () => toast.error("خطا در تغییر وضعیت پیامک"),
        onSettled: () => setTogglingEvent(null),
      },
    );
  };

  const columns = generateColumns(setEditing, handleToggle, togglingEvent);

  return (
    <div className="ss02 mb-5">
      <Table
        rowKey="event"
        className="w-full"
        stickyTableHeader
        columns={columns}
        data={templates}
        loading={isPending ? { size: 45 } : undefined}
        emptyContent={
          <TableEmptyState showImage message={tableEmptyMessage.notFound} />
        }
      />

      <SmsTemplateDrawer
        open={Boolean(editing)}
        onClose={() => setEditing(null)}
        template={editing}
      />
    </div>
  );
}

export default withNoSSR(SmsTemplateTable);
