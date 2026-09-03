"use client";

import { useEffect, useState } from "react";
import { Button, Datepicker, Drawer, Select, Textarea } from "@dgshahr/ui-kit";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import {
  useAdminAdminList,
  useAdminArtistCrmUpdate,
  useAdminCrmNoteCreate,
  useAdminCrmNoteList,
} from "@/lib/services/admin/hook";
import {
  CrmStageLabel,
  ECrmNoteChannel,
  ECrmStage,
  IArtistItem,
} from "@/lib/services/admin/type";
import convertGregorianTimeToShamsiTime from "@/lib/utils/convertGregorianTimeToShamsiTime";
import getDrawerPosition from "@/lib/utils/getDrawerPosition";
import getDrawerWidth from "@/lib/utils/getDrawerWidth";

interface CrmDrawerProps {
  open: boolean;
  onClose: () => void;
  artist: IArtistItem | null;
}

const stageOptions = Object.values(ECrmStage).map((stage) => ({
  label: CrmStageLabel[stage],
  value: stage,
}));

const CrmDrawer = ({ open, onClose, artist }: CrmDrawerProps) => {
  const queryClient = useQueryClient();
  const id = artist?.id ?? 0;

  const { data: adminData } = useAdminAdminList();
  const { data: noteData, isPending: notesPending } = useAdminCrmNoteList(
    open && id ? id : undefined,
  );
  const { mutate: updateCrm, isPending: savingCrm } = useAdminArtistCrmUpdate(id);
  const { mutate: createNote, isPending: savingNote } = useAdminCrmNoteCreate(id);

  const [stage, setStage] = useState<ECrmStage>(ECrmStage.NEW);
  const [assignedAdminId, setAssignedAdminId] = useState<number | null>(null);
  const [followUpAt, setFollowUpAt] = useState<Date | null>(null);

  const [note, setNote] = useState("");
  const [channel, setChannel] = useState<ECrmNoteChannel>(
    ECrmNoteChannel.INTERNAL,
  );
  // SMS costs money and cannot be recalled, so sending takes a second deliberate click.
  const [smsConfirming, setSmsConfirming] = useState(false);

  // Re-seed the form whenever a different request is opened.
  useEffect(() => {
    if (!artist) return;
    setStage(artist.crmStage ?? ECrmStage.NEW);
    setAssignedAdminId(artist.assignedAdmin?.id ?? null);
    setFollowUpAt(artist.followUpAt ? new Date(artist.followUpAt) : null);
    setNote("");
    setChannel(ECrmNoteChannel.INTERNAL);
    setSmsConfirming(false);
  }, [artist]);

  const phoneNumber = artist?.user?.phoneNumber;

  const handleSaveCrm = () => {
    updateCrm(
      {
        crmStage: stage,
        assignedAdminId,
        followUpAt: followUpAt ? followUpAt.toISOString() : null,
      },
      {
        onSuccess: () => {
          toast.success("اطلاعات پیگیری ذخیره شد");
          queryClient.invalidateQueries({ queryKey: ["artistList"] });
          queryClient.invalidateQueries({ queryKey: ["artistRetrieve", id] });
        },
      },
    );
  };

  const handleAddNote = () => {
    if (channel === ECrmNoteChannel.SMS && !smsConfirming) {
      setSmsConfirming(true);
      return;
    }

    createNote(
      { body: note.trim(), channel },
      {
        onSuccess: () => {
          toast.success(
            channel === ECrmNoteChannel.SMS
              ? "پیامک ارسال و در تاریخچه ثبت شد"
              : "یادداشت ثبت شد",
          );
          setNote("");
          setChannel(ECrmNoteChannel.INTERNAL);
          setSmsConfirming(false);
          queryClient.invalidateQueries({ queryKey: ["crmNoteList", id] });
        },
        // The note is stored even when the SMS provider rejects it, so the timeline
        // is refreshed on failure too — the draft stays put for a retry.
        onError: () => {
          setSmsConfirming(false);
          queryClient.invalidateQueries({ queryKey: ["crmNoteList", id] });
        },
      },
    );
  };

  const notes = noteData?.result ?? [];

  return (
    <Drawer
      header={{
        title: "پیگیری درخواست",
        haveCloseIcon: true,
      }}
      width={getDrawerWidth(700)}
      position={getDrawerPosition()}
      open={open}
      onClose={onClose}
    >
      <div className="flex flex-col gap-6 ss02">
        <div className="flex flex-col gap-1">
          <p className="font-p1-medium">
            {`${artist?.user?.firstName ?? ""} ${artist?.user?.lastName ?? ""}`.trim() ||
              "—"}
          </p>
          <p className="font-p2-regular text-gray-500">{phoneNumber ?? "—"}</p>
        </div>

        <div className="flex flex-col gap-3">
          <Select
            searchable={false}
            inputProps={{ labelContent: "مرحله پیگیری" }}
            value={stage}
            options={stageOptions}
            onChange={(value) => setStage(value as ECrmStage)}
          />

          <Select
            searchable={false}
            inputProps={{ labelContent: "مسئول پیگیری" }}
            value={assignedAdminId ?? ""}
            options={[
              { label: "بدون مسئول", value: "" },
              ...(adminData?.result ?? []).map((admin) => ({
                label:
                  `${admin.firstName ?? ""} ${admin.lastName ?? ""}`.trim() ||
                  admin.username,
                value: admin.id,
              })),
            ]}
            onChange={(value) =>
              setAssignedAdminId(value === "" ? null : Number(value))
            }
          />

          <div className="flex gap-2 items-end">
            <Datepicker
              wrapperClassName="grow"
              inputProps={{ labelContent: "تاریخ پیگیری بعدی" }}
              value={followUpAt}
              onChange={(date: Date) => setFollowUpAt(date)}
            />
            {followUpAt && (
              <Button
                onClick={() => setFollowUpAt(null)}
                variant="outline"
                color="error"
              >
                حذف تاریخ
              </Button>
            )}
          </div>

          <Button
            onClick={handleSaveCrm}
            isLoading={savingCrm}
            disabled={savingCrm}
            variant="primary"
            color="error"
          >
            ذخیره
          </Button>
        </div>

        <div className="flex flex-col gap-3">
          <p className="font-p1-medium">افزودن یادداشت</p>

          <div className="flex gap-2">
            <Button
              onClick={() => {
                setChannel(ECrmNoteChannel.INTERNAL);
                setSmsConfirming(false);
              }}
              variant={
                channel === ECrmNoteChannel.INTERNAL ? "primary" : "outline"
              }
              color="error"
            >
              یادداشت داخلی
            </Button>
            <Button
              onClick={() => setChannel(ECrmNoteChannel.SMS)}
              variant={channel === ECrmNoteChannel.SMS ? "primary" : "outline"}
              color="error"
              disabled={!phoneNumber}
            >
              پیامک به متقاضی
            </Button>
          </div>

          <Textarea
            value={note}
            onChange={(e) => {
              setNote(e.target.value);
              setSmsConfirming(false);
            }}
            placeholder={
              channel === ECrmNoteChannel.SMS
                ? "متن پیامک (حداکثر ۵۰۰ کاراکتر)"
                : "متن یادداشت"
            }
          />

          {channel === ECrmNoteChannel.SMS && (
            <p className="font-p2-regular text-warning-600">
              {`این متن به شماره ${phoneNumber ?? "—"} پیامک می‌شود و قابل بازگشت نیست.`}
            </p>
          )}

          <Button
            onClick={handleAddNote}
            isLoading={savingNote}
            disabled={
              savingNote ||
              !note.trim() ||
              (channel === ECrmNoteChannel.SMS && note.trim().length > 500)
            }
            variant="primary"
            color="error"
          >
            {channel === ECrmNoteChannel.SMS
              ? smsConfirming
                ? "تایید و ارسال پیامک"
                : "ارسال پیامک"
              : "ثبت یادداشت"}
          </Button>
        </div>

        <div className="flex flex-col gap-3">
          <p className="font-p1-medium">تاریخچه</p>

          {notesPending && <p className="font-p2-regular">در حال بارگذاری…</p>}

          {!notesPending && notes.length === 0 && (
            <p className="font-p2-regular text-gray-500">
              هنوز یادداشتی ثبت نشده است.
            </p>
          )}

          {notes.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-1 p-3 rounded-lg border border-gray-200"
            >
              <div className="flex gap-2 justify-between items-center">
                <p className="font-p2-medium">
                  {item.admin
                    ? `${item.admin.firstName ?? ""} ${item.admin.lastName ?? ""}`.trim() ||
                      item.admin.username
                    : "—"}
                </p>
                <p className="font-p2-regular text-gray-500">
                  {convertGregorianTimeToShamsiTime(item.createdAt)}
                </p>
              </div>
              <p className="font-p1-regular whitespace-pre-wrap">{item.body}</p>
              {item.channel === ECrmNoteChannel.SMS && (
                <p
                  className={
                    item.smsDelivered
                      ? "font-p2-regular text-success-600"
                      : "font-p2-regular text-error-500"
                  }
                >
                  {item.smsDelivered ? "ارسال شده با پیامک" : "ارسال پیامک ناموفق"}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </Drawer>
  );
};

export default CrmDrawer;
