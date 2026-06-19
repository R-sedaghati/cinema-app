import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <div className="rounded-3xl border border-zinc-800 bg-zinc-950/40 p-10 text-center">
        <div className="text-2xl font-bold text-zinc-50">صفحه پیدا نشد</div>
        <div className="mt-3 text-sm leading-7 text-zinc-400">
          آدرسی که وارد کردید وجود ندارد یا حذف شده است.
        </div>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="rounded-2xl bg-red-600 px-5 py-3 text-sm font-semibold text-zinc-950 hover:bg-red-500"
          >
            بازگشت به خانه
          </Link>
          <Link
            href="/artists"
            className="rounded-2xl border border-zinc-800 bg-zinc-950/40 px-5 py-3 text-sm font-semibold text-zinc-100 hover:bg-zinc-900"
          >
            جستجوی هنرمندان
          </Link>
        </div>
      </div>
    </div>
  );
}

