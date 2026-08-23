import ArtistStatus from "@/components/admin/artist-registration/ArtistStatus";
import Button from "@/components/common/Button";
import { EArtistRequestStatus, IArtistItem } from "@/lib/services/admin/type";
import convertGregorianTimeToShamsiTime from "@/lib/utils/convertGregorianTimeToShamsiTime";
import { ColumnsType } from "@dgshahr/ui-kit/Table";
import { ChevronLeft } from "lucide-react";
import type { CopyResolver } from "@/lib/utils/copy";
import type { LandingCopyKey } from "@/lib/constants/landingCopy";

export const generateColumns = (
  onView: (item: IArtistItem) => void,
  copy: CopyResolver<LandingCopyKey>,
): ColumnsType<IArtistItem>[] => [
  {
    align: "start",
    key: "title",
    dataIndex: "title",
    title: copy("profileFormsColName"),
    className: "align-middle min-w-48",
    render: (data) =>
      data.id && (
        <p className="font-p1-regular">{`${data.user.firstName}  ${data.user.lastName}`}</p>
      ),
  },
  {
    align: "center",
    key: "createAt",
    dataIndex: "titcreateAtle",
    title: copy("profileFormsColDate"),
    className: "align-middle min-w-32",
    render: (data) => {
      return (
        <p className="font-p1-regular">
          {data.createdAt && convertGregorianTimeToShamsiTime(data.createdAt)}
        </p>
      );
    },
  },
  {
    align: "center",
    key: "status",
    dataIndex: "status",
    title: copy("profileColStatus"),
    className: "align-middle min-w-32",
    render: (data) => <ArtistStatus status={data.status} isSolid />,
  },
  {
    align: "center",
    key: "actions",
    dataIndex: "actions",
    title: copy("profileColActions"),
    className: "align-middle",
    render: (data) => (
      <Button
        variant="text"
        leftIcon={<ChevronLeft />}
        onClick={() => onView(data)}
      >
        {data.status === EArtistRequestStatus.NEED_TO_REVISION
          ? copy("profileFormEdit")
          : copy("profileFormView")}
      </Button>
    ),
  },
];
