import { Instagram, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="bg-[#0E0E0E] text-white">
      <div className="mx-auto max-w-7xl px-6 py-16 flex flex-col gap-14">
        {/* top */}
        <div className="flex flex-col md:flex-row gap-5 justify-between items-center">
          <h3 className="text-3xl text-error-500 font-extrabold">آرشیو هنر</h3>
          <div className="flex items-center font-bold gap-6 text-zinc-400 text-sm">
            <span className="tracking-wider ss02">
              تلفن پشتیبانی ۰۹۱۹۸۶۱۲۲۶۱
            </span>
            <Instagram />
            <Phone />
          </div>
        </div>

        {/* mid */}
        <nav className="flex flex-col font-bold gap-4 text-sm text-zinc-300">
          <Link href="/artists" className="hover:text-white transition-colors">
            جستجوی هنرمندان
          </Link>
          <Link href="/about" className="hover:text-white transition-colors">
            درباره ما
          </Link>
          <Link href="/contact" className="hover:text-white transition-colors">
            تماس با ما
          </Link>
          <Link href="/faq" className="hover:text-white transition-colors">
            سوالات متداول
          </Link>
          <Link href="/support" className="hover:text-white transition-colors">
            پشتیبانی
          </Link>
        </nav>
        {/* bottom */}
        <div className="flex flex-col md:flex-row justify-between gap-5 items-center">
          <div className="flex flex-col items-start justify-center gap-8">
            <h3 className="text-xl font-semibold text-white">
              دریافت اپلیکیشن
            </h3>

            <div className="flex flex-col md:flex-row gap-4 w-full">
              <Image
                src="/download-android.svg"
                alt="App Store"
                className="h-18.75 w-64"
                width={256}
                height={75}
              />
              <Image
                src="/download-bazar.svg"
                alt="App Store"
                className="h-18.75 w-64"
                width={256}
                height={75}
              />
            </div>
          </div>
          <div className="flex items-center gap-10 opacity-70">
            <div className="h-24 w-24 rounded-xl bg-zinc-800" />
            <div className="h-24 w-24 rounded-xl bg-zinc-800" />
          </div>
        </div>
      </div>
    </footer>
  );
}

{
  /* <div className="flex flex-col">
          
          <div className="flex flex-col items-start gap-8 lg:items-end text-right">
            <h2 className="text-3xl font-bold text-red-500">آرشیو هنرمندان</h2>

            <nav className="flex flex-col gap-4 text-sm text-zinc-300">
              <Link
                href="/artists"
                className="hover:text-white transition-colors"
              >
                جستجوی هنرمندان
              </Link>
              <Link
                href="/about"
                className="hover:text-white transition-colors"
              >
                درباره ما
              </Link>
              <Link
                href="/contact"
                className="hover:text-white transition-colors"
              >
                تماس با ما
              </Link>
              <Link href="/faq" className="hover:text-white transition-colors">
                سوالات متداول
              </Link>
              <Link
                href="/support"
                className="hover:text-white transition-colors"
              >
                پشتیبانی
              </Link>
            </nav>
          </div>

          
          <div className="flex flex-col items-center justify-center gap-8">
            <h3 className="text-xl font-semibold text-white">
              دریافت اپلیکیشن
            </h3>

            <div className="flex flex-col gap-4 w-full max-w-md">
              <button className="flex items-center justify-between rounded-2xl border border-zinc-700 bg-zinc-900 px-6 py-4 text-sm hover:border-zinc-500 transition-colors">
                <span className="text-zinc-300">
                  دریافت نسخه اندروید از
                  <span className="block text-lg font-bold text-white">
                    لینک مستقیم
                  </span>
                </span>
                <span className="text-3xl">🤖</span>
              </button>

              <button className="flex items-center justify-between rounded-2xl border border-zinc-700 bg-zinc-900 px-6 py-4 text-sm hover:border-zinc-500 transition-colors">
                <span className="text-zinc-300">
                  دریافت نسخه اندروید از
                  <span className="block text-lg font-bold text-white">
                    بازار
                  </span>
                </span>
                <span className="text-3xl">🛍️</span>
              </button>
            </div>
          </div>

          
          <div className="flex flex-col items-start gap-10 text-left">
            <div className="flex items-center gap-6 text-zinc-400 text-sm">
              <span>📱</span>
              <span>📷</span>
              <span className="tracking-wider">09198613261 تلفن پشتیبانی</span>
            </div>

            <div className="flex items-center gap-10 opacity-70">
              <div className="h-24 w-24 rounded-xl bg-zinc-800" />
              <div className="h-24 w-24 rounded-xl bg-zinc-800" />
            </div>
          </div>
        </div> */
}
