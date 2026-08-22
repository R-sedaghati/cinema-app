"use client";

import { PropsWithChildren, Suspense, useEffect, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import AdminMainLayout from "@/components/layout/AdminMainLayout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import useAdminAuthStore from "@/lib/stores/useAdminAuthStore";

export default function RootLayout({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const router = useRouter();

  const isLoggedIn = useAdminAuthStore((s) => !!s.accessToken);
  const hasHydrated = useAdminAuthStore((s) => s.hasHydrated);

  const excludedPaths = ["/admin/login"];
  const isLoginPage = excludedPaths.includes(pathname);

  const queryClient = useMemo(() => new QueryClient(), []);

  useEffect(() => {
    if (hasHydrated && !isLoggedIn && !isLoginPage) {
      router.replace("/admin/login");
    }
  }, [hasHydrated, isLoggedIn, isLoginPage, router]);

  // Until the persisted token is read back, "no token" is not the same as
  // "logged out" — rendering the guard early would bounce a valid session.
  if (!isLoginPage && (!hasHydrated || !isLoggedIn)) {
    return <div className="dot-flashing" />;
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
