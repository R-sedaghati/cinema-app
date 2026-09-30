"use client";

import { useSidebarItems } from "@/lib/hooks/useSidebarItems";
import { useSiteLogo } from "@/lib/hooks/useSiteLogo";
import useAdminAuthStore from "@/lib/stores/useAdminAuthStore";
import { useAdminBadgeCounts, useAdminProfile } from "@/lib/services/admin/hook";
import { Bell } from "lucide-react";
import Link from "next/link";
import { Sidebar } from "@dgshahr/ui-kit";
import clsx from "clsx";
import { usePathname, useRouter } from "next/navigation";
import React, { ReactNode, useState } from "react";
import { isMobile } from "react-device-detect";

interface Props {
  children: ReactNode;
  className?: string;
}
const AdminMainLayout = (props: Props) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(!isMobile);
  const router = useRouter();

  const { logout, userName } = useAdminAuthStore();
  const pathname = usePathname();

  const hideSidebar = /\/document\/[^/]+\/?$/.test(pathname);

  const { mainMenuItems } = useSidebarItems();
  const logo = useSiteLogo() ?? "/assets/images/logo.svg";
  const profile = useAdminProfile().data?.result;
  const unread = useAdminBadgeCounts().data?.result.notifications ?? 0;

  if (usePathname() === "/home")
    return <React.Fragment>{props.children}</React.Fragment>;

  return (
    <main className="max-w-full">
      {!hideSidebar && (
        <Sidebar
          logo={{
            close: logo,
            loading: "eager",
            open: logo,
          }}
          items={[mainMenuItems]}
          setIsOpen={setIsSidebarOpen}
          isOpen={isSidebarOpen}
          searchInput={false}
          hideOnClose={isMobile}
          className="z-15 absolute top-0 left-0 h-screen text-xl"
          userProfile={{
            image:
              profile?.avatar ??
              "https://lend-front.s3.ir-thr-at1.arvanstorage.ir/images/Profile.png",
            name:
              [profile?.firstName, profile?.lastName].filter(Boolean).join(" ") ||
              userName,
            link: "/admin/settings",
          }}
          onLogout={() => {
            logout();
            router.push("/admin/login");
          }}
          showMask={isSidebarOpen && isMobile}
        />
      )}

      <div
        className={clsx(
          "pt-2 mb-15 md:mb-0 relative transition-all duration-300",
          {
            "mr-52": isSidebarOpen && !isMobile,
          },
          props.className,
        )}
      >
        <Link
          href="/admin/notifications"
          aria-label="اعلان‌ها"
          className="absolute top-3 left-4 z-10 p-2 rounded-full bg-white border border-gray-200 hover:bg-gray-50"
        >
          <Bell className="size-5 text-gray-600" />
          {unread > 0 && (
            <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
              {unread > 99 ? "99+" : unread}
            </span>
          )}
        </Link>
        {props.children}
      </div>
    </main>
  );
};

export default AdminMainLayout;
