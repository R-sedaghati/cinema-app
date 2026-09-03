"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import ContentCard from "../ContentCard";
import Button from "@/components/common/Button";
import { useUserMessageRead, useUserMessages } from "@/lib/services/landing/hook";
import { IPagination, IUserMessage } from "@/lib/services/landing/type";
import { ESmsEvent } from "@/lib/services/admin/type";
import { useLandingCopy } from "@/lib/hooks/useLandingCopy";
import convertGregorianTimeToShamsiTime from "@/lib/utils/convertGregorianTimeToShamsiTime";

export default function MessagesList() {
  const router = useRouter();
  const copy = useLandingCopy();
  const queryClient = useQueryClient();

  const [pagination, setPagination] = useState<IPagination>({
    page: 1,
    count: 20,
  });

  const { data, isPending } = useUserMessages(pagination);
  const { mutate: markRead } = useUserMessageRead();

  const items = useMemo(() => data?.result ?? [], [data?.result]);

  // Opening the section is the read receipt. The list refetches every 30s, so an
  // id is only ever sent once — otherwise every tick would re-PATCH the same rows.
  const attempted = useRef<Set<number>>(new Set());

  useEffect(() => {
    const unread = items.filter(
      (item) => !item.readAt && !attempted.current.has(item.id),
    );
    if (unread.length === 0) return;

    unread.forEach((item) => {
      attempted.current.add(item.id);
      markRead(item.id, {
        onSuccess: () =>
          queryClient.invalidateQueries({ queryKey: ["userMessages"] }),
      });
    });
  }, [items, markRead, queryClient]);

  // A revision notice is the one message with somewhere to go: back into the form.
  const editableRequestId = (item: IUserMessage) =>
    item.event === ESmsEvent.NEED_REVISION ? item.artistRequestId : null;

  const hasMore = (data?.count ?? 0) > items.length;

  return (
    <ContentCard title={copy("profileMessagesTitle")}>
      <div className="flex flex-col gap-3">
        {isPending &&
          ["sk-1", "sk-2", "sk-3"].map((k) => (
            <div
              key={k}
              className="animate-pulse rounded-2xl bg-zinc-900/70 border border-zinc-800/60 px-4 py-4 flex flex-col gap-3"
            >
              <div className="h-3 w-24 rounded bg-zinc-800/60" />
              <div className="h-4 w-full rounded bg-zinc-800" />
              <div className="h-4 w-2/3 rounded bg-zinc-800" />
            </div>
          ))}

        {!isPending && items.length === 0 && (
          <p className="py-8 text-center text-sm text-zinc-500">
            {copy("profileMessagesEmpty")}
          </p>
        )}

        {!isPending &&
          items.map((item) => {
            const requestId = editableRequestId(item);

            return (
              <div
                key={item.id}
                className="rounded-2xl bg-zinc-900/70 border border-zinc-800/60 px-4 py-4 flex flex-col gap-3"
              >
                <div className="flex items-center gap-2 text-xs text-zinc-500">
                  {!item.readAt && (
                    <span className="h-2 w-2 rounded-full bg-error-500 shrink-0" />
                  )}
                  <span>{convertGregorianTimeToShamsiTime(item.createdAt)}</span>
                </div>

                <p className="text-sm leading-7 text-zinc-100 whitespace-pre-wrap">
                  {item.body}
                </p>

                {requestId && (
                  <div className="flex justify-start">
                    <Button
                      variant="text"
                      leftIcon={<ChevronLeft size={16} />}
                      onClick={() => router.push(`/artist-registration/${requestId}`)}
                      className="p-0! text-sm"
                    >
                      {copy("profileFormEdit")}
                    </Button>
                  </div>
                )}
              </div>
            );
          })}

        {hasMore && (
          <Button
            variant="text"
            className="text-sm self-center"
            onClick={() =>
              setPagination((state) => ({ ...state, count: state.count + 20 }))
            }
          >
            {copy("actionMore")}
          </Button>
        )}
      </div>
    </ContentCard>
  );
}
