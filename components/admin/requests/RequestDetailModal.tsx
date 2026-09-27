import { useState } from "react";
import {
  useAdminSupportReply,
  useAdminSupportRetrieve,
  useAdminSupportUpdate,
} from "@/lib/services/admin/hook";
import { ESupportStatus } from "@/lib/services/admin/type";
import getDrawerPosition from "@/lib/utils/getDrawerPosition";
import getDrawerWidth from "@/lib/utils/getDrawerWidth";
import convertGregorianTimeToShamsiTime from "@/lib/utils/convertGregorianTimeToShamsiTime";
import { Button, Drawer } from "@dgshahr/ui-kit";
import Input from "@/components/common/Input";
import Textarea from "@/components/common/Textarea";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import RequestStatus from "./RequestStatus";

interface IRequestDetailProps {
  open: boolean;
  onClose: () => void;
  selectedArtistId: number | undefined;
}

function Bubble({
  staff,
  author,
  body,
  createdAt,
}: Readonly<{ staff: boolean; author: string; body: string | null; createdAt: string | null }>) {
  return (
    <div className={`flex ${staff ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-xl p-3 flex flex-col gap-1 border border-solid ${
          staff ? "bg-error-50 border-error-200" : "bg-gray-50 border-gray-200"
        }`}
      >
        <div className="flex gap-2 font-p3-regular text-gray-500">
          <span className="text-gray-700">{author}</span>
          <span>{convertGregorianTimeToShamsiTime(createdAt)}</span>
        </div>
        <p className="font-p1-regular text-gray-800 whitespace-pre-wrap break-words">{body}</p>
      </div>
    </div>
  );
}

const RequestDetailModal = ({
  open,
  onClose,
  selectedArtistId,
}: IRequestDetailProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [reply, setReply] = useState("");

  const { data: retriveData } = useAdminSupportRetrieve(selectedArtistId);
  const data = retriveData?.result;
  const isClosed = data?.status === ESupportStatus.CLOSED;

  const { mutate: updateStatus, isPending } = useAdminSupportUpdate();
  const { mutate: sendReply, isPending: isSending } = useAdminSupportReply();

  const handleStatusUpdate = (status: ESupportStatus) => {
    if (!selectedArtistId) return;
    updateStatus(
      { id: selectedArtistId, status },
      {
        onSuccess: () => {
          toast.success("وضعیت با موفقیت تغییر کرد");
          queryClient.invalidateQueries({ queryKey: ["supportList"] });
          queryClient.invalidateQueries({ queryKey: ["supportRetirive"] });
        },
        onError: () => {
          toast.error("خطا در تغییر وضعیت");
        },
      },
    );
  };

  const handleReply = () => {
    if (!selectedArtistId || !reply.trim()) return;
    sendReply(
      { id: selectedArtistId, body: reply.trim() },
      {
        onSuccess: () => {
          toast.success("پاسخ ارسال شد");
          setReply("");
        },
        onError: () => {
          toast.error("خطا در ارسال پاسخ");
        },
      },
    );
  };

  const fullName = `${data?.firstName ?? ""} ${data?.lastName ?? ""}`.trim();

  return (
    <Drawer
      header={{
        title: data ? `تیکت #${data.id}` : "مشاهده تیکت",
        haveCloseIcon: true,
      }}
      footer={{
        element: (
          <div className="flex justify-end gap-3">
            {isClosed ? (
              <Button
                variant="outline"
                color="error"
                isLoading={isPending}
                disabled={isPending}
                onClick={() => handleStatusUpdate(ESupportStatus.OPEN)}
              >
                بازگشایی تیکت
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  color="error"
                  isLoading={isPending}
                  disabled={isPending}
                  onClick={() => handleStatusUpdate(ESupportStatus.CLOSED)}
                >
                  بستن تیکت
                </Button>
                <Button
                  variant="primary"
                  color="error"
                  isLoading={isSending}
                  disabled={isSending || !reply.trim()}
                  onClick={handleReply}
                >
                  ارسال پاسخ
                </Button>
              </>
            )}
          </div>
        ),
      }}
      width={getDrawerWidth(700)}
      position={getDrawerPosition()}
      open={open}
      onClose={onClose}
    >
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-2">
          <Input
            wrapperClassName="w-full"
            labelContent="درخواست دهنده"
            placeholder="درخواست دهنده"
            value={fullName}
            readOnly
          />
          <Input
            wrapperClassName="w-full"
            labelContent="شماره موبایل"
            placeholder="شماره موبایل"
            value={data?.phoneNumber ?? ""}
            readOnly
          />
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <p className="font-p1-medium text-gray-800">{data?.subject}</p>
            {data?.status && <RequestStatus status={data.status} isSolid={false} />}
          </div>
          {data?.userId && (
            <Button
              onClick={() => router.push(`/admin/users/${data.userId}`)}
              variant="text"
              leftIcon={<ChevronLeft />}
              color="error"
            >
              مشاهده کاربر
            </Button>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <Bubble
            staff={false}
            author={fullName || "کاربر"}
            body={data?.message ?? null}
            createdAt={data?.createdAt ?? null}
          />
          {data?.messages?.map((message) => (
            <Bubble
              key={message.id}
              staff={Boolean(message.admin)}
              author={
                message.admin
                  ? `${message.admin.firstName ?? ""} ${message.admin.lastName ?? ""}`.trim() ||
                    "پشتیبانی"
                  : fullName || "کاربر"
              }
              body={message.body}
              createdAt={message.createdAt}
            />
          ))}
        </div>

        {!isClosed && (
          <Textarea
            labelContent="پاسخ به کاربر"
            placeholder="متن پاسخ (برای کاربر پیامک هم ارسال می‌شود)"
            wrapperClassName="w-full"
            rows={4}
            value={reply}
            onChange={(e) => setReply(e.target.value)}
          />
        )}
      </div>
    </Drawer>
  );
};

export default RequestDetailModal;
