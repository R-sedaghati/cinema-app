"use client";

import Link from "next/link";
import { Badge } from "@dgshahr/ui-kit";
import { ARTSIT_STATUS } from "@/lib/constants/artist/status";
import {
  useAdminArtistList,
  useAdminTransactionList,
  useAdminUsersList,
} from "@/lib/services/admin/hook";
import { EArtistRequestStatus } from "@/lib/services/admin/type";

// ponytail: counts come from list endpoints' `count` (total) with page size 1,
// one request per tile. Add a /admin/stats endpoint if tiles grow past ~10.
const useStatusCount = (status: EArtistRequestStatus) =>
  useAdminArtistList({ count: 1, status__in: [status] }).data?.count;

function Tile({ title, value, href }: { title: string; value?: number; href: string }) {
  return (
    <Link
      href={href}
      className="rounded-xl border border-gray-200 bg-white p-4 transition hover:shadow-md"
    >
      <p className="text-sm text-gray-500">{title}</p>
      <p className="mt-2 text-2xl font-bold">
        {value === undefined ? "…" : value.toLocaleString("fa-IR")}
      </p>
    </Link>
  );
}

export default function Admin() {
  const users = useAdminUsersList({ count: 1 }).data?.count;
  const transactions = useAdminTransactionList({ count: 1 }).data?.count;
  const recent = useAdminArtistList({ count: 5 }).data;
  const pending = useStatusCount(EArtistRequestStatus.PENDING);
  const pendingPayment = useStatusCount(EArtistRequestStatus.PENDING_PAYMENT);
  const approved = useStatusCount(EArtistRequestStatus.APPROVED);
  const revision = useStatusCount(EArtistRequestStatus.NEED_TO_REVISION);

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-10">
      <h1 className="text-2xl font-bold">داشبورد</h1>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Tile title="کاربران" value={users} href="/admin/users" />
        <Tile title="فرم‌های ثبت‌نامی" value={recent?.count} href="/admin/artist-registration" />
        <Tile title="تراکنش‌ها" value={transactions} href="/admin/transactions" />
        <Tile title={ARTSIT_STATUS.APPROVED.label} value={approved} href="/admin/artist-registration" />
        <Tile title={ARTSIT_STATUS.PENDING.label} value={pending} href="/admin/artist-registration" />
        <Tile title={ARTSIT_STATUS.PENDING_PAYMENT.label} value={pendingPayment} href="/admin/artist-registration" />
        <Tile title={ARTSIT_STATUS.NEED_TO_REVISION.label} value={revision} href="/admin/artist-registration" />
      </div>

      <section className="rounded-xl border border-gray-200 bg-white p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-bold">آخرین فرم‌های ثبت‌نامی</h2>
          <Link href="/admin/artist-registration" className="text-sm text-blue-600">
            مشاهده همه
          </Link>
        </div>
        {!recent ? (
          <div className="dot-flashing" />
        ) : recent.result.length === 0 ? (
          <p className="text-sm text-gray-500">فرمی ثبت نشده است.</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {recent.result.map((item) => (
              <li key={item.id}>
                <Link
                  href={`/admin/artist-registration/${item.id}`}
                  className="flex items-center justify-between gap-3 py-3 hover:bg-gray-50"
                >
                  <span>
                    {[item.user?.firstName, item.user?.lastName].filter(Boolean).join(" ") ||
                      item.user?.phoneNumber}
                    <span className="mr-2 text-xs text-gray-500">
                      {item.categories?.map((c) => c.faName).join("، ")}
                    </span>
                  </span>
                  <span className="flex items-center gap-3">
                    {item.createdAt && (
                      <span className="text-xs text-gray-500">
                        {new Date(item.createdAt).toLocaleDateString("fa-IR")}
                      </span>
                    )}
                    <Badge
                      value={ARTSIT_STATUS[item.status].label}
                      color={ARTSIT_STATUS[item.status].color}
                      type="twoTone"
                      size="small"
                    />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
