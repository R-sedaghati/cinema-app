import Button from "@/components/common/Button";
import { IContactRequestItem } from "@/lib/services/landing/type";
import convertEnNumberToFaNumberWithSeparation from "@/lib/utils/convertEnNumberToFaNumberWithSeparation";
import { ColumnsType } from "@dgshahr/ui-kit/Table";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import type { CopyResolver } from "@/lib/utils/copy";
import type { LandingCopyKey } from "@/lib/constants/landingCopy";

const statusClasses: Record<IContactRequestItem["status"], string> = {
  PENDING: "bg-amber-900/40 text-amber-400",
  COMPLETED: "bg-emerald-900/40 text-emerald-400",
  FAILED: "bg-red-900/40 text-red-400",
  CANCELED: "bg-zinc-800 text-zinc-400",
};

const statusKeys: Record<IContactRequestItem["status"], LandingCopyKey> = {
  PENDING: "paymentPending",
  COMPLETED: "paymentCompleted",
  FAILED: "paymentFailed",
  CANCELED: "paymentCanceled",
};

export const generateColumns = (
  copy: CopyResolver<LandingCopyKey>,
): ColumnsType<IContactRequestItem>[] => [
  {
    align: "start",
    key: "artist",
    dataIndex: "artist",
    title: copy("profileRequestsColArtist"),
    className: "align-middle min-w-60",
    render: (data) => (
      <div className="flex flex-col gap-1">
        <p className="font-p1-regular">{data.artist?.code ?? "—"}</p>
        <span className="text-xs text-zinc-500">
          {data.artist?.categories?.map((category) => category.faName).join("، ")}
        </span>
      </div>
    ),
  },
  {
    align: "center",
    key: "trackingCode",
    dataIndex: "trackingCode",
    title: copy("profileRequestsColTracking"),
    className: "align-middle min-w-32",
    render: (data) => <span className="text-sm">{data.trackingCode}</span>,
  },
  {
    align: "center",
    key: "amount",
    dataIndex: "amount",
    title: copy("profileRequestsColAmount"),
    className: "align-middle min-w-28",
    render: (data) => (
      <span className="text-sm">
        {convertEnNumberToFaNumberWithSeparation(data.amount)} {copy("labelCurrency")}
      </span>
    ),
  },
  {
    align: "center",
    key: "status",
    dataIndex: "status",
    title: copy("profileColStatus"),
    className: "align-middle min-w-32",
    render: (data) => (
      <span
        className={`rounded-full px-3 py-1 text-xs ${statusClasses[data.status]}`}
      >
        {copy(statusKeys[data.status])}
      </span>
    ),
  },
  {
    align: "center",
    key: "actions",
    dataIndex: "actions",
    title: copy("profileColActions"),
    className: "align-middle max-w-52",
    render: (data) => (
      <Link href={`/artists/${data.artist?.id}`}>
        <Button variant="text" leftIcon={<ChevronLeft />}>
          {copy("profileRequestsViewArtist")}
        </Button>
      </Link>
    ),
  },
];
