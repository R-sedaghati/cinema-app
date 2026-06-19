"use client";

import { PropsWithChildren, Suspense, useEffect, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import AdminMainLayout from "@/components/layout/AdminMainLayout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import useAdminAuthStore from "@/lib/stores/useAdminAuthStore";

export default function RootLayout({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const router = useRouter();

  const { isLoggedIn } = useAdminAuthStore();
  console.log(isLoggedIn);

  const excludedPaths = ["/admin/login"];
  const isLoginPage = excludedPaths.includes(pathname);

  const queryClient = useMemo(() => new QueryClient(), []);

  useEffect(() => {
    if (!isLoggedIn && !isLoginPage) {
      router.replace("/admin/login");
    }
  }, [isLoggedIn, isLoginPage, router]);

  if (!isLoggedIn && !isLoginPage) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<div className="dot-flashing" />}>
        {isLoginPage ? (
          children
        ) : (
          <AdminMainLayout className="min-h-screen">{children}</AdminMainLayout>
        )}
      </Suspense>
    </QueryClientProvider>
  );
}
