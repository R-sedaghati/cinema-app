"use client";

import { MobileBottomNav } from "@/components/site/MobileBottomNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { MobileCopyright } from "@/components/site/MobileCopyright";
import { SiteHeader } from "@/components/site/SiteHeader";
import LoginDrawer from "@/components/login/LoginDrawer";
import ProfileCompletionChecker from "@/components/login/ProfileCompletionChecker";
import { PageProgressBar } from "@/components/site/PageProgressBar";
import { PageBackground } from "@/components/site/PageBackground";
import { PageLayoutMain } from "@/components/site/PageLayoutMain";
import "../globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useMemo } from "react";
import Script from "next/script";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const queryClient = useMemo(() => new QueryClient(), []);

  return (
    <QueryClientProvider client={queryClient}>
      <PageProgressBar />
      <PageBackground />
      <div className="flex min-h-dvh flex-col  text-zinc-100 antialiased">
        <SiteHeader />
        <PageLayoutMain className="flex-1 md:mt-10 pb-safe-24 lg:pb-8 overflow-hidden">{children}</PageLayoutMain>
        <div className="hidden lg:block"><SiteFooter /></div>
        {/* ponytail: mobile has no footer, only the copyright line matters there */}
        <p className="lg:hidden px-4 pt-6 pb-safe-28 text-center text-xs text-zinc-500">
          <MobileCopyright />
        </p>
        <MobileBottomNav />
        <LoginDrawer />
        <ProfileCompletionChecker />
      </div>
      <Script
        id="goftino-widget"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `!function(){var i="3tkMmF",a=window,d=document;function g(){var g=d.createElement("script"),s="https://www.goftino.com/widget/"+i,l=localStorage.getItem("goftino_"+i);g.async=!0,g.src=l?s+"?o="+l:s;d.getElementsByTagName("head")[0].appendChild(g);}"complete"===d.readyState?g():a.attachEvent?a.attachEvent("onload",g):a.addEventListener("load",g,!1);}();`,
        }}
      />
    </QueryClientProvider>
  );
}
