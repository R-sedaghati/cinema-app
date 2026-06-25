import { useAdminSupportRetrieve, useAdminSupportUpdate } from "@/lib/services/admin/hook";
import { ESupportStatus } from "@/lib/services/admin/type";
import getDrawerPosition from "@/lib/utils/getDrawerPosition";
import getDrawerWidth from "@/lib/utils/getDrawerWidth";
import { Badge, Button, Drawer, Input } from "@dgshahr/ui-kit";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

interface IRequestDetailProps {
  open: boolean;
  onClose: () => void;
  selectedArtistId: number | undefined;
}

const RequestDetailModal = ({
  open,
  onClose,
  selectedArtistId,
}: IRequestDetailProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: retriveData } = useAdminSupportRetrieve(selectedArtistId);
  const data = retriveData?.result;

  const { mutate: updateStatus, isPending } = useAdminSupportUpdate();

  const handleStatusUpdate = (status: ESupportStatus) => {
    if (!selectedArtistId) return;
    updateStatus(
      { id: selectedArtistId, status },
      {
        onSuccess: () => {
          toast.success("وضعیت با موفقیت تغییر کرد");
          queryClient.invalidateQueries({ queryKey: ["supportList"] });
          onClose();
        },
        onError: () => {
          toast.error("خطا در تغییر وضعیت");
        },
      },
    );
  };

  return (
    <Drawer
      header={{
        title: "مشاهده درخواست",
        haveCloseIcon: true,
      }}
      footer={{
        element: (
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              color="error"
              isLoading={isPending}
              disabled={isPending}
              onClick={() => handleStatusUpdate(ESupportStatus.REJECTED)}
            >
              موافقت نشد
            </Button>
            <Button
              variant="primary"
              color="error"
              isLoading={isPending}
              disabled={isPending}
              onClick={() => handleStatusUpdate(ESupportStatus.ACCEPTED)}
            >
              تایید برای مشاهده
            </Button>
          </div>
        ),
      }}
      width={getDrawerWidth(700)}
      position={getDrawerPosition()}
      open={open}
      onClose={onClose}
    >
      <div className="flex flex-col gap-3">
        <div className="flex justify-between gap-2">
          <Input
            wrapperClassName="w-full"
            labelContent="درخواست دهنده"
            placeholder="درخواست دهنده"
            value={`${data?.firstName ?? ""} ${data?.lastName ?? ""}`}
          />
          <Input
            wrapperClassName="w-full"
            labelContent="شماره موبایل"
            placeholder="شماره موبایل"
            value={data?.phoneNumber ?? ""}
          />
        </div>
        <p className="font-p1-medium text-gray-500">جزئیات درخواست</p>
        <div className="border border-solid border-gray-300 rounded-xl p-4">
          <div className="flex flex-col gap-3">
            <div className="flex gap-3 items-center">
              <div className="flex gap-2 items-center">
                <p className="font-p1-regular text-gray-500">هنرمند:</p>
                <p className="font-p1-regular text-gray-800">{`${data?.firstName ?? ""} ${data?.lastName ?? ""}`}</p>
              </div>
              <Button
                onClick={() => router.push(`/admin/users/${data?.id}`)}
                variant="text"
                leftIcon={<ChevronLeft />}
                color="error"
              >
                مشاهده پروفایل
              </Button>
            </div>
            <div className="flex gap-3 items-center">
              <div className="flex gap-2 items-center">
                <p className="font-p1-regular text-gray-500">وضعیت پرداخت:</p>
                <Badge value={"پرداخت شده"} type="twoTone" color="success" />
              </div>
              <Button variant="text" leftIcon={<ChevronLeft />} color="error">
                مشاهده تراکنش
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Drawer>
  );
};

export default RequestDetailModal;
