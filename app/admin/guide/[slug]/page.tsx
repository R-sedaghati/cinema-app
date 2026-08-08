"use client";

import GuideBlocks from "@/components/admin/guide/GuideBlocks";
import { GUIDE_TOPICS } from "@/lib/constants/guide/content";
import withNoSSR from "@/lib/utils/withNoSSR";
import { Button, Card, Divider } from "@dgshahr/ui-kit";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React from "react";

function GuideTopicPage() {
  const params = useParams();
  const router = useRouter();

  const index = GUIDE_TOPICS.findIndex((item) => item.slug === params.slug);

  if (index === -1) {
    return (
      <div className="flex flex-col pt-6 px-4">
        <h2 className="mb-6 text-lg font-semibold">راهنمای پنل</h2>
        <Divider className="mb-5" color="gray" size="thin" type="horizontal" />
        <Card>
          <div className="flex flex-col items-start gap-4">
            <p className="text-sm text-gray-700">
              این صفحه از راهنما پیدا نشد.
            </p>
            <Button
              variant="outline"
              color="error"
              size="small"
              onClick={() => router.push("/admin/guide")}
            >
              بازگشت به فهرست راهنما
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const topic = GUIDE_TOPICS[index];
  const prev = GUIDE_TOPICS[index - 1];
  const next = GUIDE_TOPICS[index + 1];

  return (
    <div className="flex flex-col pt-6 px-4 pb-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => router.push("/admin/guide")}
          className="flex items-center gap-2 text-lg font-semibold"
        >
          <ChevronRight size={20} />
          {topic.title}
        </button>

        {topic.adminLink && (
          <Button
            variant="outline"
            color="error"
            size="small"
            onClick={() => router.push(topic.adminLink!)}
          >
            رفتن به این بخش
          </Button>
        )}
      </div>

      <Divider className="mb-5" color="gray" size="thin" type="horizontal" />

      <Card>
        <GuideBlocks blocks={topic.blocks} />
      </Card>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        {prev ? (
          <Link
            href={`/admin/guide/${prev.slug}`}
            className="flex items-center gap-1 text-sm text-error-500"
          >
            <ChevronRight size={16} />
            {prev.title}
          </Link>
        ) : (
          <span />
        )}

        {next && (
          <Link
            href={`/admin/guide/${next.slug}`}
            className="flex items-center gap-1 text-sm text-error-500"
          >
            {next.title}
            <ChevronLeft size={16} />
          </Link>
        )}
      </div>
    </div>
  );
}

export default withNoSSR(GuideTopicPage);
