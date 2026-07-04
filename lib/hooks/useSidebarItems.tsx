import { FirstLevelSidebarItem } from "@dgshahr/ui-kit/Sidebar";
import { usePathname } from "next/navigation";
import {
  User,
  ChartColumnIncreasing,
  CircleDollarSign,
  Handshake,
  TableOfContents,
  ClipboardList,
  GalleryHorizontal,
  Video,
} from "lucide-react";

type SidebarChild = {
  title: string;
  link: string;
  active?: boolean;
  permitted?: boolean;
};

type SidebarParent = {
  title: string;
  icon?: React.ReactNode;
  link?: string;
  active?: boolean;
  children?: SidebarChild[];
};

export const useSidebarItems = (): {
  mainMenuItems: FirstLevelSidebarItem;
  firstAllowedRoute: string | undefined;
} => {
  const pathname = usePathname() || "";

  const mainMenuItems: FirstLevelSidebarItem = {
    title: "منوی اصلی",
    children: [
      {
        icon: <User />,
        title: "لیست هنرمندان",
        link: "/admin/users",
        active: pathname.startsWith("/admin/users"),
      },
      {
        icon: <ClipboardList />,
        title: "لیست فرم‌های ثبت‌نامی",
        link: "/admin/artist-registration",
        active: pathname.startsWith("/admin/artist-registration"),
      },
      {
        icon: <ChartColumnIncreasing />,
        title: "مدیریت دسته‌بندی و فرم‌ها",
        link: "/admin/categories",
        active: pathname.startsWith("/admin/categories"),
      },
      {
        icon: <Handshake />,
        title: "لیست درخواست‌های ارتباط",
        link: "/admin/requests",
        active: pathname.startsWith("/admin/requests"),
      },
      {
        icon: <CircleDollarSign />,
        title: "لیست تراکنش‌ها",
        link: "/admin/transactions",
        active: pathname.startsWith("/admin/transactions"),
      },
      {
        icon: <TableOfContents />,
        title: "مدیریت محتوای لندینگ",
        link: "/admin/content-management",
        active: pathname.startsWith("/admin/content-management"),
      },
      {
        icon: <GalleryHorizontal />,
        title: "مدیریت اسلایدرهای صفحه اصلی",
        link: "/admin/sliders",
        active: pathname.startsWith("/admin/sliders"),
      },
      {
        icon: <Video />,
        title: "مدیریت آموزش‌ها",
        link: "/admin/tutorials",
        active: pathname.startsWith("/admin/tutorials"),
      },
    ],
  };

  const activateParents = (menu: FirstLevelSidebarItem) => {
    menu.children?.forEach((parent: SidebarParent) => {
      if (parent.children?.some((child) => child.active)) {
        parent.active = true;
      }
    });
  };

  activateParents(mainMenuItems);

  const firstAllowedRoute =
    mainMenuItems.children?.[0]?.link ??
    mainMenuItems.children?.[0]?.children?.[0]?.link ??
    undefined;

  return {
    mainMenuItems,
    firstAllowedRoute,
  };
};
