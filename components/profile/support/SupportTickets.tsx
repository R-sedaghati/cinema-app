"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, Plus } from "lucide-react";
import { toast } from "react-toastify";
import ContentCard from "../ContentCard";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import Textarea from "@/components/common/Textarea";
import { useCreateUserSupport, useUserProfile, useUserSupport } from "@/lib/services/landing/hook";
import { IPagination } from "@/lib/services/landing/type";
import { useLandingCopy } from "@/lib/hooks/useLandingCopy";
import convertGregorianTimeToShamsiTime from "@/lib/utils/convertGregorianTimeToShamsiTime";
import SupportStatusPill from "./SupportStatusPill";
import TicketThread from "./TicketThread";

function NewTicketForm({ onDone }: Readonly<{ onDone: () => void }>) {
  const copy = useLandingCopy();
  const { data: profile } = useUserProfile();
  const { mutate, isPending } = useCreateUserSupport();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!subject.trim() || !message.trim()) {
      toast.error(copy("profileSupportRequired"));
      return;
    }

    // Identity comes from the account; the backend overrides it from the token anyway.
    mutate(
      {
        first_name: profile?.firstName ?? "",
        last_name: profile?.lastName ?? "",
        email: profile?.email ?? "",
        phone_number: profile?.phone_number ?? "",
        category_id: null,
        subject: subject.trim(),
        message: message.trim(),
      },
      {
        onSuccess: () => {
          toast.success(copy("profileSupportCreated"));
          onDone();
        },
        onError: () => toast.error(copy("profileSupportError")),
      },
    );
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <Input
        id="support-subject"
        labelContent={copy("profileSupportSubject")}
        placeholder={copy("profileSupportSubject")}
        required
        wrapperClassName="w-full"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
      />
      <Textarea
        labelContent={copy("profileSupportMessage")}
        placeholder={copy("profileSupportMessage")}
        required
        rows={6}
        wrapperClassName="w-full"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <div className="flex gap-3 justify-end">
        <Button type="button" variant="text" onClick={onDone} disabled={isPending}>
          {copy("profileSupportCancel")}
        </Button>
        <Button type="submit" isLoading={isPending} disabled={isPending} className="rounded-full!">
          {copy("profileSupportSubmit")}
        </Button>
      </div>
    </form>
  );
}

export default function SupportTickets() {
  const copy = useLandingCopy();
  const [view, setView] = useState<"list" | "new" | number>("list");
  const [pagination, setPagination] = useState<IPagination>({ page: 1, count: 20 });

  const { data, isPending } = useUserSupport(pagination);
  const items = useMemo(() => data?.result ?? [], [data?.result]);
  const hasMore = (data?.count ?? 0) > items.length;

  if (typeof view === "number") {
    return (
      <ContentCard title={copy("profileSupportTitle")}>
        <TicketThread id={view} onBack={() => setView("list")} />
      </ContentCard>
    );
  }

  return (
    <ContentCard title={copy("profileSupportTitle")}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row gap-3 md:items-center justify-between">
          <p className="text-sm leading-7 text-zinc-300">
            <span style={copy.style("profileSupportDesc")}>{copy("profileSupportDesc")}</span>
          </p>
          {view === "list" && (
            <Button
              leftIcon={<Plus size={16} />}
              className="rounded-full! shrink-0 self-start md:self-auto"
              onClick={() => setView("new")}
            >
              {copy("profileSupportNew")}
            </Button>
          )}
        </div>

        {view === "new" && <NewTicketForm onDone={() => setView("list")} />}

        {view === "list" && (
          <div className="flex flex-col gap-3">
            {isPending &&
              ["sk-1", "sk-2"].map((k) => (
                <div
                  key={k}
                  className="animate-pulse rounded-2xl bg-zinc-900/70 border border-zinc-800/60 px-4 py-4 flex flex-col gap-3"
                >
                  <div className="h-4 w-1/2 rounded bg-zinc-800" />
                  <div className="h-3 w-24 rounded bg-zinc-800/60" />
                </div>
              ))}

            {!isPending && items.length === 0 && (
              <p className="py-8 text-center text-sm text-zinc-500">{copy("profileSupportEmpty")}</p>
            )}

            {!isPending &&
              items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setView(item.id)}
                  className="text-start rounded-2xl bg-zinc-900/70 border border-zinc-800/60 hover:border-zinc-600 transition-colors px-4 py-4 flex items-center justify-between gap-3"
                >
                  <div className="flex flex-col gap-2 min-w-0">
                    <span className="text-sm text-zinc-100 truncate">{item.subject}</span>
                    <span className="text-xs text-zinc-500">
                      #{item.id} · {convertGregorianTimeToShamsiTime(item.createdAt)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <SupportStatusPill status={item.status} />
                    <ChevronLeft size={16} className="text-zinc-500" />
                  </div>
                </button>
              ))}

            {hasMore && (
              <Button
                variant="text"
                className="text-sm self-center"
                onClick={() => setPagination((state) => ({ ...state, count: state.count + 20 }))}
              >
                {copy("actionMore")}
              </Button>
            )}
          </div>
        )}
      </div>
    </ContentCard>
  );
}
