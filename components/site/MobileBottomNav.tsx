"use client";

import useAuthStore from "@/lib/stores/useAuthStore";
import useLoginDrawerStore from "@/lib/stores/useLoginDrawerStore";
import { Home, LogIn, PenLine, Search, User, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const bottomNavItems = [
  { href: "/", label: "خانه", icon: Home },
  { href: "/artist-registration", label: "فرم‌ها", icon: PenLine },
  { href: "/artists", label: "هنرمندان", icon: Users },
  { href: "/profile", label: "پروفایل", icon: User },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function MobileBottomNav() {
  const pathname = usePathname();
  const { isLoggedIn } = useAuthStore();
  const { open } = useLoginDrawerStore();

  const bottomNavItems = [
    { href: "/", label: "خانه", icon: Home },
    { href: "/artists", label: "جستجو", icon: Search },
    isLoggedIn
      ? { href: "/profile", label: "پروفایل", icon: User }
      : { href: "#", label: "ورود", icon: LogIn },
  ];

  return (
    <nav
      className="fixed bottom-safe-6 left-1/2 z-40 -translate-x-1/2 lg:hidden"
      aria-label="ناوبری اصلی"
    >
      <div className="flex items-center gap-1 rounded-full bg-zinc-900/95 px-2 py-2 shadow-lg ring-1 ring-zinc-800 backdrop-blur-sm">
        {bottomNavItems.map((item) => {
          const active = item.href !== "#" && isActive(pathname, item.href);
          const Icon = item.icon;

          if (!isLoggedIn && item.label === "ورود") {
            return (
              <button
                key={item.label}
                type="button"
                onClick={open}
                className="flex flex-col items-center gap-1 rounded-full px-5 py-2 text-zinc-400 transition-colors hover:text-zinc-300"
              >
                <Icon size={22} strokeWidth={1.5} />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "flex flex-col items-center gap-1 rounded-full px-5 py-2 transition-colors",
                active ? "text-error-500" : "text-zinc-400 hover:text-zinc-300",
              ].join(" ")}
            >
              <Icon
                size={22}
                className={active ? "text-error-500" : "text-zinc-400"}
                strokeWidth={active ? 2.5 : 1.5}
              />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
