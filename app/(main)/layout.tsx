"use client";

import { MobileBottomNav } from "@/components/site/MobileBottomNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import LoginDrawer from "@/components/login/LoginDrawer";
import ProfileCompletionChecker from "@/components/login/ProfileCompletionChecker";
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
      <div className="flex min-h-dvh flex-col  text-zinc-100 antialiased">
        <SiteHeader />
        <main className="flex-1 md:mt-10 pb-24 lg:pb-8">{children}</main>
        <SiteFooter />
        <MobileBottomNav />
        <LoginDrawer />
        <ProfileCompletionChecker />
      </div>
    </QueryClientProvider>
  );
}
