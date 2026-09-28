"use client";

import { Button } from "@dgshahr/ui-kit";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import TableEmptyState from "@/components/common/TableEmptyState";
import {
  useAdminNotifications,
  useAdminNotificationsRead,
} from "@/lib/services/admin/hook";
import type { IAdminNotification, NotificationEvent } from "@/lib/services/admin/type";
import convertGregorianTimeToShamsiTime from "@/lib/utils/convertGregorianTimeToShamsiTime";

const EVENT_LABELS: Record<NotificationEvent, string> = {
  REGISTRATION: "ثبت‌نام",
  TRANSACTION: "پرداخت",
  SUPPORT_TICKET: "پشتیبانی",
  RESUME_REQUEST: "درخواست رزومه",
};

export default function AdminNotifications() {
  const router = useRouter();
  const { data, isLoading } = useAdminNotifications();
  const { mutate: markRead, isPending } = useAdminNotificationsRead();

  const items = data?.result.items ?? [];
  const unread = data?.result.unread ?? 0;

  const open = (item: IAdminNotification) => {
    if (!item.readAt) markRead(item.id);
    if (item.link) router.push(item.link);
  };

  if (isLoading) return <div className="dot-flashing" />;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="font-p2-regular text-gray-500">{unread} اعلان خوانده‌نشده</p>
        <Button
          color="gray"
          variant="outline"
          disabled={unread === 0}
          isLoading={isPending}
          onClick={() => markRead(undefined)}
        >
          همه خوانده شد
        </Button>
      </div>

      {items.length === 0 ? (
        <TableEmptyState message="هنوز اعلانی ثبت نشده است." />
      ) : (
        <ul className="flex flex-col gap-2">
          {items.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => open(item)}
                className={clsx(
                  "w-full text-start rounded-lg border p-3 flex flex-col gap-1 transition-colors hover:bg-gray-50",
                  item.readAt ? "border-gray-200" : "border-primary-300 bg-primary-50",
                )}
              >
                <div className="flex items-center gap-2 font-p3-regular text-gray-500">
                  {!item.readAt && <span className="size-2 rounded-full bg-primary-500" />}
                  <span>{EVENT_LABELS[item.event] ?? item.event}</span>
                  <span>·</span>
                  <span>{convertGregorianTimeToShamsiTime(item.createdAt)}</span>
                </div>
                <p className={item.readAt ? "font-p2-regular" : "font-p2-medium"}>
                  {item.message}
                </p>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
