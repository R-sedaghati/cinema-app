"use client";

import { useEffect } from "react";

// ponytail: auto-reload, throttled to 1/30s so boot crashes cannot loop.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[crash]", error);
    // reload at most once per 30s so a crash-on-boot can't loop forever
    let last = Date.now();
    try {
      last = Number(sessionStorage.getItem("crash-reloaded-at") ?? 0);
      sessionStorage.setItem("crash-reloaded-at", String(Date.now()));
    } catch {
      // storage blocked — skip auto reload, user can tap the button
    }
    if (Date.now() - last > 30_000) {
      const t = setTimeout(() => window.location.reload(), 500);
      return () => clearTimeout(t);
    }
  }, [error]);

  return (
    <html lang="fa" dir="rtl">
      <body className="font-sans min-h-dvh">
        <div
          className="px-4 py-16 flex items-center justify-center min-h-dvh"
          style={{ background: "#24363f" }}
        >
          <div className="rounded-3xl border border-zinc-800 bg-zinc-950/30 p-10 text-center">
            <div className="text-2xl font-bold text-zinc-50">
              مشکلی پیش آمد
            </div>
            <div className="mt-3 text-sm leading-7 text-zinc-400">
              در حال بارگذاری مجدد…
            </div>
            <button
              onClick={() => {
                reset();
              }}
              className="mt-8 rounded-full bg-amber-500 px-6 py-2 text-sm font-bold text-zinc-900"
            >
              تلاش مجدد
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
