import { FirstLevelSidebarItem } from "@dgshahr/ui-kit/Sidebar";
import { usePathname } from "next/navigation";
import {
  User,
  Settings,
  ChartColumnIncreasing,
  CircleDollarSign,
  Handshake,
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
  secondaryMenuItems: FirstLevelSidebarItem;
  firstAllowedRoute: string | undefined;
} => {
  const pathname = usePathname() || "";

  const filterAndMapChildren = (
    items: SidebarChild[],
    pathname: string,
  ): Omit<SidebarChild, "permitted">[] =>
    items
      .filter(({ permitted }) => permitted === undefined || permitted)
      .map(({ title, link }) => ({
        title,
        link,
        active: pathname?.startsWith(link),
      }));

  const mainMenuItems: FirstLevelSidebarItem = {
    title: "منوی اصلی",
    children: [
      {
        icon: <User />,
        title: "لیست هنرمندان",
        link: "/admin/artists",
        active: pathname.startsWith("/admin/artists"),
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
    ],
  };

  const secondaryMenuItems: FirstLevelSidebarItem = {
    title: "",
    children: [
      {
        icon: <Settings />,
        title: "تنظیمات",
        // children: filterAndMapChildren(
        //   [
        //     { title: "قرارداد‌ها", link: "/panel/admin/contracts" },
        //     {
        //       title: "مدل‌های اعتباری",
        //       link: "/panel/admin/credits",
        //     },
        //   ],
        //   pathname,
        // ),
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
    secondaryMenuItems,
    firstAllowedRoute,
  };
};
