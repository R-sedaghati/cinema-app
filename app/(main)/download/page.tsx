"use client";

import { DownloadSections } from "@/components/download/DownloadSections";
import { useUserSiteContent } from "@/lib/services/landing/hook";

export default function DownloadPage() {
  const { data, isLoading } = useUserSiteContent();

  if (isLoading) return null;

  return <DownloadSections page={data?.result?.downloadPage} />;
}
