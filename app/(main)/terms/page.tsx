"use client";

import { useUserSiteContent } from "@/lib/services/landing/hook";

export default function TermsPage() {
  const { data } = useUserSiteContent();
  const terms = data?.result?.terms;

  return (
    <div className="relative mx-auto max-w-6xl px-4 py-10 text-right">
      <h3 className="text-4xl font-h1-regular mb-10">
        {terms?.title ?? "قوانین و حریم خصوصی"}
      </h3>

      <div className="relative backdrop-blur-sm border-2 border-error-500/30 shadow-card text-xl rounded-4xl p-5 md:p-20 bg-zinc-900/40 w-full whitespace-pre-line">
        {terms?.content}
      </div>
    </div>
  );
}
