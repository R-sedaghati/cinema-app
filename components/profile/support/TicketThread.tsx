"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { toast } from "react-toastify";
import Button from "@/components/common/Button";
import Textarea from "@/components/common/Textarea";
import { useUserSupportDetail, useUserSupportReply } from "@/lib/services/landing/hook";
import { ESupportStatus } from "@/lib/services/admin/type";
import { useLandingCopy } from "@/lib/hooks/useLandingCopy";
import convertGregorianTimeToShamsiTime from "@/lib/utils/convertGregorianTimeToShamsiTime";
import SupportStatusPill from "./SupportStatusPill";

function Bubble({
  mine,
  author,
  body,
  createdAt,
}: Readonly<{ mine: boolean; author: string; body: string | null; createdAt: string | null }>) {
  return (
    <div className={`flex ${mine ? "justify-start" : "justify-end"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 flex flex-col gap-2 border ${
          mine
            ? "bg-zinc-900/70 border-zinc-800/60"
            : "bg-error-500/10 border-error-500/30"
        }`}
      >
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <span className="text-zinc-300">{author}</span>
          <span>{convertGregorianTimeToShamsiTime(createdAt)}</span>
        </div>
        <p data-el="body" className="text-sm leading-7 text-zinc-100 whitespace-pre-wrap break-words">{body}</p>
      </div>
    </div>
  );
}

export default function TicketThread({ id, onBack }: Readonly<{ id: number; onBack: () => void }>) {
  const copy = useLandingCopy();
  const { data, isPending } = useUserSupportDetail(id);
  const { mutate, isPending: isSending } = useUserSupportReply();
  const [body, setBody] = useState("");

  const ticket = data?.result;

  const handleSend = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!body.trim()) return;

    mutate(
      { id, body: body.trim() },
      {
        onSuccess: () => setBody(""),
        onError: () => toast.error(copy("profileSupportError")),
      },
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <Button
        variant="text"
        leftIcon={<ChevronRight size={16} />}
        className="p-0! text-sm self-start"
        onClick={onBack}
      >
        <span style={copy.style("profileSupportBack")}>{copy("profileSupportBack")}</span>
      </Button>

      {isPending && <div className="animate-pulse h-24 rounded-2xl bg-zinc-900/70" />}

      {ticket && (
        <>
          <div className="flex items-center justify-between gap-3">
            <h3 data-el="card-title" className="text-base text-zinc-50">
              {ticket.subject} <span className="text-xs text-zinc-500">#{ticket.id}</span>
            </h3>
            <SupportStatusPill status={ticket.status} />
          </div>

          <div className="flex flex-col gap-3">
            <Bubble
              mine
              author={copy("profileSupportYou")}
              body={ticket.message}
              createdAt={ticket.createdAt}
            />
            {ticket.messages?.map((message) => (
              <Bubble
                key={message.id}
                mine={!message.admin}
                author={copy(message.admin ? "profileSupportStaff" : "profileSupportYou")}
                body={message.body}
                createdAt={message.createdAt}
              />
            ))}
          </div>

          {ticket.status === ESupportStatus.CLOSED ? (
            <p data-el="body" className="py-4 text-center text-sm text-zinc-500"><span style={copy.style("profileSupportClosed")}>{copy("profileSupportClosed")}</span></p>
          ) : (
            <form onSubmit={handleSend} className="flex flex-col gap-3">
              <Textarea
                placeholder={copy("profileSupportReplyPlaceholder")}
                rows={3}
                wrapperClassName="w-full"
                value={body}
                onChange={(e) => setBody(e.target.value)}
              />
              <Button
                type="submit"
                isLoading={isSending}
                disabled={isSending || !body.trim()}
                className="rounded-full! self-end"
              >
                <span style={copy.style("profileSupportSend")}>{copy("profileSupportSend")}</span>
              </Button>
            </form>
          )}
        </>
      )}
    </div>
  );
}
