"use client";

import { GUIDE_TOPICS } from "@/lib/constants/guide/content";
import withNoSSR from "@/lib/utils/withNoSSR";
import { Card, Divider } from "@dgshahr/ui-kit";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import React from "react";

function GuideIndex() {
  return (
    <div className="flex flex-col pt-6 px-4">
      <h2 className="mb-2 text-lg font-semibold">راهنمای پنل</h2>
      <p className="mb-6 text-sm text-gray-600">
        راهنمای کامل هر بخش پنل، ارتباط آن با سایت، و گردش‌کارهای کاری. اگر
        تازه‌کار هستید از «شروع به کار» آغاز کنید.
      </p>
      <Divider className="mb-5" color="gray" size="thin" type="horizontal" />

      <div className="grid grid-cols-1 gap-4 pb-8 md:grid-cols-2 xl:grid-cols-3">
        {GUIDE_TOPICS.map((topic) => (
          <Link key={topic.slug} href={`/admin/guide/${topic.slug}`}>
            <Card className="h-full transition-colors hover:border-error-500">
              <div className="flex h-full flex-col gap-2">
                <div className="flex items-center gap-2 text-error-500">
                  {topic.icon}
                  <p className="font-h5-bold">{topic.title}</p>
                </div>
                <p className="grow text-sm leading-7 text-gray-600">
                  {topic.summary}
                </p>
                <div className="flex items-center gap-1 text-sm text-error-500">
                  مطالعه راهنما
                  <ChevronLeft size={16} />
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default withNoSSR(GuideIndex);
