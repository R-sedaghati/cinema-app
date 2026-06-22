import { useAdminArtistStatusUpdate } from "@/lib/services/admin/hook";
import { EArtistRequestStatus } from "@/lib/services/admin/type";
import getDrawerPosition from "@/lib/utils/getDrawerPosition";
import getDrawerWidth from "@/lib/utils/getDrawerWidth";
import { Button, Drawer, Textarea } from "@dgshahr/ui-kit";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

interface IRequestDetailProps {
  open: boolean;
  onClose: () => void;
  id: number;
}

const ArtistRevisionDrawer = ({ open, onClose, id }: IRequestDetailProps) => {
  const router = useRouter();
  const { mutate, isPending } = useAdminArtistStatusUpdate(id);

  const [rejectedReason, setRejectedReason] = useState("");

  const handleSubmit = () => {
    mutate(
      {
        status: EArtistRequestStatus.NEED_TO_REVISION,
        rejected_reason: rejectedReason,
      },
      {
        onSuccess: () => {
          toast.success("با موفقیت تغییر کرد");
          setRejectedReason("");
          onClose();
          router.push("/admin/artist-registration");
        },
      },
    );
  };

  return (
    <Drawer
      header={{
        title: "ارسال اصلاحیه",
        haveCloseIcon: true,
      }}
      footer={{
        element: (
          <div className="flex justify-end gap-3">
            <Button onClick={() => onClose} variant="outline" color="error">
              انصراف
            </Button>
            <Button
              onClick={handleSubmit}
              isLoading={isPending}
              disabled={isPending || !rejectedReason.trim()}
              variant="primary"
              color="error"
            >
              ارسال به کاربر
            </Button>
          </div>
        ),
      }}
      width={getDrawerWidth(700)}
      position={getDrawerPosition()}
      open={open}
      onClose={onClose}
    >
      <Textarea
        value={rejectedReason}
        onChange={(e) => setRejectedReason(e.target.value)}
        labelContent="متن نمایشی برای کاربر:"
        placeholder="متن ورودی"
      />
    </Drawer>
  );
};

export default ArtistRevisionDrawer;
