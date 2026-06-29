"use client";

import {
  ChevronLeft,
  Headphones,
  HelpCircle,
  Info,
  Menu,
  UserRound,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Button from "../common/Button";
import useLoginDrawerStore from "@/lib/stores/useLoginDrawerStore";
import useAuthStore from "@/lib/stores/useAuthStore";
import Image from "next/image";
import { isMobile } from "react-device-detect";

const navItems = [
  { href: "/", label: "خانه" },
  { href: "/artists", label: "جستجوی هنرمندان" },
  { href: "/support", label: "پشتیبانی" },
  { href: "/faq", label: "سوالات متداول" },
  { href: "/about", label: "درباره ما" },
];

const sidebarItems = [
  { href: "/about", label: "درباره ما", icon: Info },
  { href: "/faq", label: "سوالات متداول", icon: HelpCircle },
  { href: "/support", label: "پشتیبانی", icon: Headphones },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { open: openLoginDrawer } = useLoginDrawerStore();
  const { isLoggedIn } = useAuthStore();

  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  const handleClose = () => setSidebarOpen(false);

  return (
    <>
      <header className="sticky top-0 z-50 bg-zinc-950/40 backdrop-blur-sm md:bg-transparent md:backdrop-blur-none">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-4 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:items-center">
          {isMobile ? (
            <div className="flex min-w-0 flex-1 items-center justify-start">
              <Menu
                onClick={() => setSidebarOpen(true)}
                size={24}
                className="text-zinc-300"
                aria-label="منو"
              />
            </div>
          ) : (
            <div className="flex gap-2 items-center">
              <Image
                src="/assets/images/logo.svg"
                alt="logo"
                width={60}
                height={60}
              />
              <span className="text-xl font-semibold text-error-500 text-nowrap">
                آرشیو هنر
              </span>
            </div>
          )}

          <nav className="flex min-w-0 flex-1 items-center justify-center lg:justify-center">
            {isMobile && (
              <div className="flex gap-1 items-center">
                <Image
                  src="/assets/images/logo.svg"
                  alt="logo"
                  width={60}
                  height={60}
                />
                <span className="text-xl font-semibold text-error-500 text-nowrap">
                  آرشیو هنر
                </span>
              </div>
            )}
            <div className="hidden lg:flex items-center justify-center gap-2 rounded-full bg-zinc-800/80 p-2 border border-zinc-800 backdrop-blur-xs">
              {navItems.map((item) => {
                const active = isActive(pathname, item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={[
                      "rounded-full px-6 py-2 text-base transition-colors text-nowrap border border-transparent",
                      active
                        ? "bg-zinc-700 text-error-500!"
                        : "text-zinc-300 hover:bg-zinc-800/60 hover:border-zinc-700",
                    ].join(" ")}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </nav>

          <div className="flex min-w-0 flex-1 items-center justify-end">
            <Button
              onClick={
                isLoggedIn ? () => router.push("/profile") : openLoginDrawer
              }
              size="small"
              rightIcon={<UserRound size={20} />}
              className="rounded-full! hidden! md:flex!"
            >
              {isLoggedIn ? "پروفایل" : "ورود / ثبت‌نام کاربر"}
            </Button>
            <div className="w-11 lg:hidden" />
          </div>
        </div>
      </header>
      <div
        className={[
          "fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ease-out",
          sidebarOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none",
        ].join(" ")}
        aria-hidden={!sidebarOpen}
      >
        <button
          type="button"
          onClick={handleClose}
          className={[
            "absolute inset-0 bg-black/60 transition-opacity duration-300 ease-out",
            sidebarOpen ? "opacity-100" : "opacity-0",
          ].join(" ")}
          aria-label="بستن منو"
        />
        <div
          className={[
            "absolute top-0 bottom-0 right-0 w-[min(85vw,320px)] bg-zinc-900 border-l border-zinc-800 shadow-xl transform transition-all duration-300 ease-out will-change-transform",
            sidebarOpen
              ? "translate-x-0 opacity-100"
              : "translate-x-full opacity-0",
          ].join(" ")}
          role="dialog"
          aria-modal="true"
          aria-label="منوی اصلی"
        >
          <div className="flex flex-col h-full p-4">
            <div className="flex items-center justify-between mb-6">
              <span className="text-lg font-semibold text-error-500">
                آرشیو هنر
              </span>
              <button
                type="button"
                onClick={handleClose}
                className="rounded-xl p-2 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
                aria-label="بستن"
              >
                <X size={24} />
              </button>
            </div>
            <nav className="flex flex-col gap-1">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(pathname, item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={handleClose}
                    className={[
                      "flex items-center justify-between rounded-xl px-4 py-3 text-zinc-300 transition-colors",
                      active
                        ? "bg-zinc-800 text-error-500"
                        : "hover:bg-zinc-800/80 hover:text-zinc-200",
                    ].join(" ")}
                  >
                    <div className="flex justify-center items-center gap-2">
                      <Icon size={16} className="text-zinc-400" />
                      {item.label}
                    </div>
                    <div className="flex items-center gap-3">
                      {/* <span className="flex size-8 items-center justify-center rounded-full bg-zinc-700/80 text-zinc-400">
                        <Icon size={16} />
                      </span> */}
                      <ChevronLeft size={20} className="text-zinc-200" />
                    </div>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>
    </>
  );
}
