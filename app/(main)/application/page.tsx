"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { Search, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { userArtsitList, userCategoryList } from "@/lib/services/landing/api";
import { IArtistItem } from "@/lib/services/admin/type";
import { artistCategories } from "@/lib/mock/artists";
import { useArtistRegistrationStore } from "@/lib/stores/useUserArtist";
import { useArtistFilterStore } from "@/lib/stores/useArtistFilter";

const bannerSlides = [
  {
    title: "ثبت‌نام هنرمندان",
    subtitle: "مسیر حرفه‌ای خود را آغاز کنید",
    gradient: "from-zinc-950 via-amber-950/50 to-zinc-900",
    img: "/camera-1.svg",
    cta: "ثبت‌نام",
    href: "/artist-registration",
  },
  {
    title: "آرشیو سینما",
    subtitle: "کشف استعدادهای برتر",
    gradient: "from-zinc-950 via-zinc-800/60 to-zinc-900",
    img: "/film-1.svg",
    cta: "مشاهده",
    href: "/artists",
  },
  {
    title: "همکاری سینمایی",
    subtitle: "ارتباط با هنرمندان",
    gradient: "from-amber-950/50 via-zinc-900 to-zinc-950",
    img: "/action-1.svg",
    cta: "کاوش",
    href: "/artists",
  },
];

export default function ApplicationPage() {
  const router = useRouter();
  const { setSelectedCategory, setStep, reset, setField } = useArtistRegistrationStore();
  const { setFilters: setArtistFilters, reset: resetArtistFilters } = useArtistFilterStore();
  const [search, setSearch] = useState("");

  const handleCategoryShortcut = (id: number, title: string) => {
    reset();
    setField("categoryId", [id]);
    setSelectedCategory(id, title);
    setStep(1);
    router.push("/artist-registration");
  };

  const { data: artistData, isLoading: artistsLoading } = useQuery({
    queryKey: ["applicationArtists"],
    queryFn: () => userArtsitList(undefined),
    refetchInterval: 30_000,
    refetchOnWindowFocus: false,
  });

  const { data: categoryData } = useQuery({
    queryKey: ["applicationCategories"],
    queryFn: () => userCategoryList({ page: 1, count: 20 }),
    refetchInterval: 30_000,
    refetchOnWindowFocus: false,
  });

  const artists = artistData?.result ?? [];
  const categories = categoryData?.result ?? [];

  const filtered = useMemo(() => {
    let result = artists;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (a) =>
          `${a.user.firstName ?? ""} ${a.user.lastName ?? ""}`
            .toLowerCase()
            .includes(q) ||
          a.categories?.some((c) => c.faName.includes(search)),
      );
    }
    return result;
  }, [artists, search]);

  return (
    <div className="min-h-screen pb-safe-32">
      {/* Banner Slider */}
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 3500, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop
        className="application-banner h-52 md:h-72"
      >
        {bannerSlides.map((slide) => (
          <SwiperSlide key={slide.title}>
            <div
              className={`relative h-full w-full bg-linear-to-bl ${slide.gradient} flex items-center px-6 overflow-hidden`}
            >
              <div className="relative z-10 flex-1">
                <p className="text-error-400 text-sm font-medium mb-1">
                  {slide.subtitle}
                </p>
                <h2 className="text-white text-2xl font-bold mb-4">
                  {slide.title}
                </h2>
                <Link
                  href={slide.href}
                  className="inline-flex items-center gap-1.5 rounded-full bg-error-500 px-4 py-2 text-sm font-semibold text-zinc-950"
                >
                  {slide.cta}
                  <ArrowLeft size={14} />
                </Link>
              </div>
              <div className="absolute left-2 bottom-0 opacity-15 w-44 h-44 pointer-events-none">
                <Image src={slide.img} alt="" fill className="object-contain" />
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Header + Search */}
      <div className="px-4 pt-5 pb-3 space-y-3">
        <div>
          <h1 className="text-xl font-bold text-zinc-100">کاوش</h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            هنرمندان سینما را کشف کنید
          </p>
        </div>
        <div className="relative">
          <Search
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500"
            size={18}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="جستجوی هنرمندان، دسته‌بندی‌ها..."
            className="w-full rounded-2xl py-3.5 pr-10 pl-4 text-sm outline-none focus:ring-1 focus:ring-error-500/60 border border-zinc-700/40 bg-zinc-900/60"
          />
        </div>
      </div>

      {/* Category filter chips */}
      {categories.length > 0 && (
        <div className="overflow-x-auto scrollbar-hidden pb-1">
          <div className="flex gap-2 px-4 w-max">
            <button
              onClick={() => { resetArtistFilters(); router.push("/artists"); }}
              className="rounded-full px-4 py-2 text-xs font-medium transition-colors whitespace-nowrap bg-zinc-800 text-zinc-400 hover:text-zinc-200"
            >
              همه
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setArtistFilters({ categoryId__in: [cat.id] });
                  router.push("/artists");
                }}
                className="rounded-full px-4 py-2 text-xs font-medium transition-colors whitespace-nowrap bg-zinc-800 text-zinc-400 hover:text-zinc-200"
              >
                {cat.faName}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="px-4 mt-5 space-y-8">
        {/* Artist Registration — horizontal scroll */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-zinc-100">
              ثبت‌نام هنرمند
            </h2>
            <Link href="/artist-registration" className="text-xs text-error-500">
              شروع
            </Link>
          </div>
          <div className="overflow-x-auto scrollbar-hidden">
            <div className="flex gap-3 w-max pb-1">
              {artistCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryShortcut(cat.id, cat.title)}
                  className="relative overflow-hidden w-32 h-20 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-error-500/50 transition-colors flex flex-col justify-end p-3 active:scale-[.98] shrink-0"
                >
                  <Image
                    src={`/cat-${cat.id}.svg`}
                    alt={cat.title}
                    width={48}
                    height={48}
                    className="absolute left-2 top-1/2 -translate-y-1/2 opacity-30 w-12 h-12"
                  />
                  <p className="text-xs font-medium text-zinc-100 z-10 relative leading-tight">
                    {cat.title}
                  </p>
                  <ArrowLeft
                    className="text-error-500 mt-1 z-10 relative"
                    size={12}
                  />
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Artist Grid */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-zinc-100">هنرمندان</h2>
            <Link href="/artists" className="text-xs text-error-500">
              همه
            </Link>
          </div>

          <ArtistSection loading={artistsLoading} artists={filtered} />
        </section>
        {/* Support CTA */}
        <Link
          href="/support"
          className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-900/60 px-4 py-4 hover:border-error-500/40 transition-colors group active:scale-[.99]"
        >
          <div>
            <p className="text-sm font-semibold text-zinc-100">پشتیبانی</p>
            <p className="text-xs text-zinc-500 mt-0.5">
              با تیم ما در ارتباط باشید
            </p>
          </div>
          <ArrowLeft
            size={18}
            className="text-zinc-600 group-hover:text-error-500 transition-colors"
          />
        </Link>

        {/* FAQ CTA */}
        <Link
          href="/faq"
          className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-900/60 px-4 py-4 hover:border-error-500/40 transition-colors group active:scale-[.99]"
        >
          <div>
            <p className="text-sm font-semibold text-zinc-100">
              سوالات متداول
            </p>
            <p className="text-xs text-zinc-500 mt-0.5">
              پاسخ سوالات خود را پیدا کنید
            </p>
          </div>
          <ArrowLeft
            size={18}
            className="text-zinc-600 group-hover:text-error-500 transition-colors"
          />
        </Link>
      </div>
    </div>
  );
}

const SKELETON_KEYS = ["sk-0", "sk-1", "sk-2", "sk-3", "sk-4", "sk-5"];

function ArtistSection({
  loading,
  artists,
}: {
  loading: boolean;
  artists: IArtistItem[];
}) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-3">
        {SKELETON_KEYS.map((k) => (
          <div
            key={k}
            className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-3 animate-pulse"
          >
            <div className="w-full aspect-square rounded-xl bg-zinc-800 mb-3" />
            <div className="h-3 bg-zinc-800 rounded-full w-3/4 mb-2" />
            <div className="h-2.5 bg-zinc-800 rounded-full w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (artists.length === 0) {
    return (
      <div className="py-16 text-center">
        <Image
          src="/not-found-search.svg"
          alt=""
          width={72}
          height={72}
          className="mx-auto mb-4 opacity-30"
        />
        <p className="text-zinc-500 text-sm">هنرمندی یافت نشد</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {artists.map((artist) => (
        <ArtistCard key={artist.id} artist={artist} />
      ))}
    </div>
  );
}

function ArtistCard({ artist }: { artist: IArtistItem }) {
  return (
    <Link
      href={`/artists/${artist.id}`}
      className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-3 hover:border-error-500/40 transition-colors group active:scale-[.98] flex flex-col"
    >
      <div className="w-full aspect-square rounded-xl bg-zinc-800 mb-3 overflow-hidden">
        {artist.user.avatar ? (
          <Image
            src={artist.user.avatar}
            alt=""
            width={200}
            height={200}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-2xl font-bold text-zinc-600">
              {artist.user.firstName?.[0] ?? "؟"}
            </span>
          </div>
        )}
      </div>

      <p className="text-sm font-semibold text-zinc-100 truncate group-hover:text-error-400 transition-colors leading-tight">
        {artist.user.firstName} {artist.user.lastName}
      </p>

      <div className="mt-1.5 flex flex-col gap-1">
        {artist.categories?.[0] && (
          <span className="inline-block rounded-full bg-zinc-800 px-2 py-0.5 text-xs text-zinc-400 w-fit">
            {artist.categories[0].faName}
          </span>
        )}
        {artist.user.city && (
          <span className="text-xs text-zinc-600">{artist.user.city}</span>
        )}
      </div>
    </Link>
  );
}
