import ArtistStatus from "@/components/admin/artist-registration/ArtistStatus";
import Button from "@/components/common/Button";
import { EArtistRequestStatus, IArtistItem } from "@/lib/services/admin/type";
import convertGregorianTimeToShamsiTime from "@/lib/utils/convertGregorianTimeToShamsiTime";
import { ColumnsType } from "@dgshahr/ui-kit/Table";
import { Pencil, Eye, CreditCard, ExternalLink } from "lucide-react";
import type { CopyResolver } from "@/lib/utils/copy";
import type { LandingCopyKey } from "@/lib/constants/landingCopy";
import { toResumeName } from "@/lib/utils/resumeName";

// The form a request belongs to is its categories; the user's own name is the same on
// every row, so it only serves as a fallback for a request with no category.
export const formName = (item: IArtistItem) =>
  item.categories?.map((c) => toResumeName(c.faName, item.status)).join("، ") ?? "";

// An approved request is a resume.
export const viewKey = (item: IArtistItem): LandingCopyKey =>
  item.status === EArtistRequestStatus.APPROVED ? "profileResumeView" : "profileFormView";

export const generateColumns = (
  onEdit: (item: IArtistItem) => void,
  onView: (item: IArtistItem) => void,
  onOpenPublic: (item: IArtistItem) => void,
  onPay: (item: IArtistItem) => void,
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
        <p className="font-p1-regular">
          {formName(data) || `${data.user.firstName}  ${data.user.lastName}`}
        </p>
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
      <div className="flex justify-center gap-1">
        <Button
          variant="text"
          title={copy("profileFormEdit")}
          aria-label={copy("profileFormEdit")}
          onClick={() => onEdit(data)}
        >
          <Pencil size={18} />
        </Button>

        <Button
          variant="text"
          title={copy(viewKey(data))}
          aria-label={copy(viewKey(data))}
          onClick={() => onView(data)}
        >
          <Eye size={18} />
        </Button>

        {data.status === EArtistRequestStatus.PENDING_PAYMENT && (
          <Button
            variant="text"
            title={copy("profileFormPay")}
            aria-label={copy("profileFormPay")}
            onClick={() => onPay(data)}
          >
            <CreditCard size={18} />
          </Button>
        )}

        {data.status === EArtistRequestStatus.APPROVED && (
          <Button
            variant="text"
            title={copy("profileFormPublicPage")}
            aria-label={copy("profileFormPublicPage")}
            onClick={() => onOpenPublic(data)}
          >
            <ExternalLink size={18} />
          </Button>
        )}
      </div>
    ),
  },
];
