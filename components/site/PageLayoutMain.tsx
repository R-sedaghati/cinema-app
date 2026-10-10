"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { useUserSiteContent } from "@/lib/services/landing/hook";
import { pageLayoutProps, resolvePageLayout } from "@/lib/utils/pageLayout";

/** `<main>` carrying the admin-set page layout vars (rules in `app/pageLayout.css`). */
export function PageLayoutMain(props: React.ComponentProps<"main">) {
  const pathname = usePathname();
  const { data } = useUserSiteContent();
  const { style, ...gates } = pageLayoutProps(resolvePageLayout(data?.result?.pageLayouts, pathname));

  // `data-area` scopes the admin site-styles rules (`components/site/SiteStyles.tsx`) to this page.
  return <main data-area={pathname.split("/")[1] || "home"} {...gates} {...props} style={{ ...style, ...props.style }} />;
}
