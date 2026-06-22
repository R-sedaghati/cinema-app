"use client";

import { useSidebarItems } from "@/lib/hooks/useSidebarItems";
import useAdminAuthStore from "@/lib/stores/useAdminAuthStore";
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

  if (usePathname() === "/home")
    return <React.Fragment>{props.children}</React.Fragment>;

  return (
    <main className="max-w-full">
      {!hideSidebar && (
        <Sidebar
          logo={{
            close: "/assets/images/logo.svg",
            loading: "eager",
            open: "/assets/images/logo.svg",
          }}
          items={[mainMenuItems]}
          setIsOpen={setIsSidebarOpen}
          isOpen={isSidebarOpen}
          searchInput={false}
          hideOnClose={isMobile}
          className="z-15 absolute top-0 left-0 h-screen text-xl"
          userProfile={{
            image:
              "https://lend-front.s3.ir-thr-at1.arvanstorage.ir/images/Profile.png",
            name: userName,
            link: "/panel/admin/settings",
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
        {props.children}
      </div>
    </main>
  );
};

export default AdminMainLayout;
