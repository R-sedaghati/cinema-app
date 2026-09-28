import { FirstLevelSidebarItem } from "@dgshahr/ui-kit/Sidebar";
import { usePathname } from "next/navigation";
import { useAdminBadgeCounts } from "@/lib/services/admin/hook";
import {
  User,
  ChartColumnIncreasing,
  CircleDollarSign,
  Handshake,
  LayoutTemplate,
  TableOfContents,
  ClipboardList,
  GalleryHorizontal,
  Video,
  Plus,
  BookOpen,
  Settings,
  MessageSquare,
  Wallpaper,
  Activity,
  Bell,
  FileText,
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
  const counts = useAdminBadgeCounts().data?.result;

  const mainMenuItems: FirstLevelSidebarItem = {
    title: "منوی اصلی",
    children: [
      {
        icon: <Bell />,
        title: "اعلان‌ها",
        link: "/admin/notifications",
        active: pathname.startsWith("/admin/notifications"),
        badgeCount: counts?.notifications || undefined,
      },
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
        badgeCount: counts?.registrations || undefined,
      },
      {
        icon: <ChartColumnIncreasing />,
        title: "مدیریت دسته‌بندی و فرم‌ها",
        link: "/admin/categories",
        active:
          pathname.startsWith("/admin/categories") &&
          pathname !== "/admin/categories/new",
      },
      {
        icon: <Plus />,
        title: "افزودن دسته‌بندی",
        link: "/admin/categories/new",
        active: pathname === "/admin/categories/new",
      },
      {
        icon: <Handshake />,
        title: "تیکت‌های پشتیبانی",
        link: "/admin/requests",
        active: pathname.startsWith("/admin/requests"),
        badgeCount: counts?.supports || undefined,
      },
      {
        icon: <CircleDollarSign />,
        title: "درخواست‌های مشاهده رزومه",
        link: "/admin/transactions",
        active: pathname.startsWith("/admin/transactions"),
        badgeCount: counts?.contactRequests || undefined,
      },
      {
        icon: <FileText />,
        title: "فرم درخواست مشاهده رزومه",
        // ponytail: editor lives in content-management; hash jumps to its card
        link: "/admin/content-management#resume-request-form",
      },
      {
        icon: <Activity />,
        title: "گزارش درگاه پرداخت",
        link: "/admin/gateway-logs",
        active: pathname.startsWith("/admin/gateway-logs"),
      },
      {
        icon: <LayoutTemplate />,
        title: "صفحه‌ساز صفحه اصلی",
        link: "/admin/page-builder",
        active: pathname.startsWith("/admin/page-builder"),
      },
      {
        icon: <LayoutTemplate />,
        title: "صفحه‌ساز صفحه ثبت‌نام",
        link: "/admin/registration-builder",
        active: pathname.startsWith("/admin/registration-builder"),
      },
      {
        icon: <Wallpaper />,
        title: "ظاهر صفحات",
        link: "/admin/page-backgrounds",
        active: pathname.startsWith("/admin/page-backgrounds"),
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
      {
        icon: <MessageSquare />,
        title: "پیامک‌های خودکار",
        link: "/admin/sms",
        active: pathname.startsWith("/admin/sms"),
      },
      {
        icon: <Settings />,
        title: "تنظیمات",
        link: "/admin/settings",
        active: pathname.startsWith("/admin/settings"),
      },
      {
        icon: <BookOpen />,
        title: "راهنمای پنل",
        link: "/admin/guide",
        active: pathname.startsWith("/admin/guide"),
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
