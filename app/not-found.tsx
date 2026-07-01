"use client";

import Button from "@/components/common/Button";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div
      className="px-4 py-16 flex items-center justify-center min-h-dvh"
      style={{ background: "#24363f" }}
    >
      <div className="rounded-3xl border border-zinc-800 bg-zinc-950/30 p-10 text-center w-2/3">
        <div className="text-2xl font-bold text-zinc-50">صفحه پیدا نشد</div>
        <div className="mt-3 text-sm leading-7 text-zinc-400">
          آدرسی که وارد کردید وجود ندارد یا حذف شده است.
        </div>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button
            onClick={() => router.push("/")}
            color="warning"
            className="rounded-full!"
          >
            بازگشت به خانه
          </Button>
          <Button
            onClick={() => router.back()}
            color="primary"
            className="rounded-full!"
          >
            بازگشت به صفحه قبل
          </Button>
          <Button
            onClick={() => router.push("/artists")}
            color="gray"
            className="rounded-full!"
          >
            جستجوی هنرمندان
          </Button>
        </div>
      </div>
    </div>
  );
}
