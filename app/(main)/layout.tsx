"use client";

import { MobileBottomNav } from "@/components/site/MobileBottomNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { MobileCopyright } from "@/components/site/MobileCopyright";
import { SiteHeader } from "@/components/site/SiteHeader";
import LoginDrawer from "@/components/login/LoginDrawer";
import ProfileCompletionChecker from "@/components/login/ProfileCompletionChecker";
import { PageProgressBar } from "@/components/site/PageProgressBar";
import "../globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useMemo } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const queryClient = useMemo(() => new QueryClient(), []);

  return (
    <QueryClientProvider client={queryClient}>
      <PageProgressBar />
      <div className="flex min-h-dvh flex-col  text-zinc-100 antialiased">
        <SiteHeader />
        <main className="flex-1 md:mt-10 pb-safe-24 lg:pb-8 overflow-hidden">{children}</main>
        <div className="hidden lg:block"><SiteFooter /></div>
        {/* ponytail: mobile has no footer, only the copyright line matters there */}
        <p className="lg:hidden px-4 pt-6 pb-safe-28 text-center text-xs text-zinc-500">
          <MobileCopyright />
        </p>
        <MobileBottomNav />
        <LoginDrawer />
        <ProfileCompletionChecker />
      </div>
    </QueryClientProvider>
  );
}
