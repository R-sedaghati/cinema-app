import Button from "@/components/common/Button";
import { toResumeName } from "@/lib/utils/resumeName";
import { IContactRequestItem } from "@/lib/services/landing/type";
import convertGregorianTimeToShamsiTime from "@/lib/utils/convertGregorianTimeToShamsiTime";
import { ColumnsType } from "@dgshahr/ui-kit/Table";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import type { CopyResolver } from "@/lib/utils/copy";
import type { LandingCopyKey } from "@/lib/constants/landingCopy";

const statusClasses: Record<IContactRequestItem["status"], string> = {
  PENDING: "bg-amber-900/40 text-amber-400",
  APPROVED: "bg-emerald-900/40 text-emerald-400",
  REJECTED: "bg-red-900/40 text-red-400",
};

const statusKeys: Record<IContactRequestItem["status"], LandingCopyKey> = {
  PENDING: "requestPending",
  APPROVED: "requestApproved",
  REJECTED: "requestRejected",
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
        <span data-el="card-meta" className="text-xs text-zinc-500">
          {data.artist?.categories?.map((category) => toResumeName(category.faName)).join(copy("listSeparator"))}
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
    key: "createdAt",
    dataIndex: "createdAt",
    title: copy("profileRequestsColDate"),
    className: "align-middle min-w-28",
    render: (data) => (
      <span className="text-sm">{convertGregorianTimeToShamsiTime(data.createdAt)}</span>
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
          <span style={copy.style("profileRequestsViewArtist")}>{copy("profileRequestsViewArtist")}</span>
        </Button>
      </Link>
    ),
  },
];
