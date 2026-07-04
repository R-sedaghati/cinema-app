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
import { useUserBannerList } from "@/lib/services/landing/hook";
import { TutorialSection } from "@/components/home/TutorialSection";
import { MainTutorialVideo } from "@/components/home/MainTutorialVideo";
import { IArtistItem } from "@/lib/services/admin/type";
import { artistCategories } from "@/lib/mock/artists";
import { useArtistRegistrationStore } from "@/lib/stores/useUserArtist";
import { useArtistFilterStore } from "@/lib/stores/useArtistFilter";

const BANNER_GRADIENTS = [
  "from-zinc-950 via-amber-950/50 to-zinc-900",
  "from-zinc-950 via-zinc-800/60 to-zinc-900",
  "from-amber-950/50 via-zinc-900 to-zinc-950",
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

  const { data: bannerData, isLoading: bannersLoading } = useUserBannerList();
  const banners = useMemo(
    () => [...(bannerData?.result ?? [])].sort((a, b) => a.priority - b.priority),
    [bannerData],
  );

  const artists = artistData?.result ?? [];
  const categories = useMemo(
    () => [...(categoryData?.result ?? [])].sort((a, b) => a.priority - b.priority),
    [categoryData],
  );

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
      {bannersLoading ? (
        <div className="md:mx-auto md:max-w-6xl md:px-4 md:pt-5">
          <div className="h-52 md:h-96 md:rounded-3xl bg-zinc-900 animate-pulse" />
        </div>
      ) : (
        banners.length > 0 && (
          <div className="md:mx-auto md:max-w-6xl md:px-4 md:pt-5">
            <Swiper
              modules={[Autoplay, Pagination]}
              autoplay={{ delay: 3500, disableOnInteraction: false }}
              pagination={{ clickable: true }}
              loop
              className="application-banner h-52 md:h-96 md:rounded-3xl overflow-hidden"
            >
              {banners.map((slide, index) => (
                <SwiperSlide key={slide.id}>
                  <div
                    className={`relative h-full w-full bg-linear-to-bl ${BANNER_GRADIENTS[index % BANNER_GRADIENTS.length]} flex items-center px-6 md:px-16 overflow-hidden`}
                  >
                    <div className="relative z-10 flex-1 md:max-w-xl">
                      <p className="text-error-400 text-sm md:text-base font-medium mb-1 md:mb-2">
                        {slide.subtitle}
                      </p>
                      <h2 className="text-white text-2xl md:text-5xl font-bold mb-4 md:mb-6">
                        {slide.title}
                      </h2>
                      <Link
                        href={slide.ctaLink}
                        onClick={() => {
                          if (slide.ctaLink === "/artists") resetArtistFilters();
                        }}
                        className="inline-flex items-center gap-1.5 rounded-full bg-error-500 px-4 py-2 md:px-6 md:py-3 text-sm md:text-base font-semibold text-zinc-950"
                      >
                        {slide.ctaLabel}
                        <ArrowLeft size={14} />
                      </Link>
                    </div>
                    <div className="absolute inset-0 opacity-30 pointer-events-none">
                      <Image src={slide.image} alt="" fill className="object-cover" />
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )
      )}

      <MainTutorialVideo />

      <div className="mx-auto max-w-6xl px-4">
        {/* Header + Search */}
        <div className="pt-5 md:pt-8 pb-3 md:pb-5 space-y-3 md:space-y-4">
          <div>
            <h1 className="text-xl md:text-3xl font-bold text-zinc-100">کاوش</h1>
            <p className="text-xs md:text-sm text-zinc-500 mt-0.5 md:mt-1">
              هنرمندان سینما را کشف کنید
            </p>
          </div>
          <div className="relative md:w-131.5">
            <Search
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500"
              size={18}
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="جستجوی هنرمندان، دسته‌بندی‌ها..."
              className="w-full rounded-2xl py-3.5 md:py-4 pr-10 pl-4 text-sm md:text-base outline-none focus:ring-1 focus:ring-error-500/60 border border-zinc-700/40 bg-zinc-900/60"
            />
          </div>
        </div>

        {/* Category filter chips */}
        {categories.length > 0 && (
          <div className="overflow-x-auto md:overflow-visible scrollbar-hidden pb-1">
            <div className="flex gap-2 w-max md:w-auto md:flex-wrap">
              <button
                onClick={() => { resetArtistFilters(); router.push("/artists"); }}
                className="rounded-full px-4 py-2 md:px-5 md:py-2.5 text-xs md:text-sm font-medium transition-colors whitespace-nowrap bg-zinc-800 text-zinc-400 hover:text-zinc-200"
              >
                همه
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    resetArtistFilters();
                    setArtistFilters({ categoryId__in: [cat.id] });
                    router.push("/artists");
                  }}
                  className="flex flex-col items-start gap-0.5 rounded-2xl px-4 py-2 md:px-5 md:py-2.5 text-xs md:text-sm font-medium transition-colors whitespace-nowrap bg-zinc-800 text-zinc-400 hover:text-zinc-200"
                >
                  <span>{cat.faName}</span>
                  {cat.description && (
                    <span className="text-[10px] md:text-xs font-normal text-zinc-500">
                      {cat.description}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-5 md:mt-8 space-y-8 md:space-y-12">
          {/* Artist Registration — horizontal scroll */}
          <section>
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <h2 className="text-sm md:text-lg font-semibold text-zinc-100">
                ثبت‌نام هنرمند
              </h2>
              <Link href="/artist-registration" className="text-xs md:text-sm text-error-500">
                شروع
              </Link>
            </div>
            <div className="overflow-x-auto md:overflow-visible scrollbar-hidden">
              <div className="flex gap-3 w-max md:w-auto md:grid md:grid-cols-4 md:gap-4 pb-1">
                {artistCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryShortcut(cat.id, cat.title)}
                    className="relative overflow-hidden w-32 h-20 md:w-auto md:h-28 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-error-500/50 transition-colors flex flex-col justify-end p-3 md:p-4 active:scale-[.98] shrink-0 md:shrink"
                  >
                    <Image
                      src={`/cat-${cat.id}.svg`}
                      alt={cat.title}
                      width={64}
                      height={64}
                      className="absolute left-2 top-1/2 -translate-y-1/2 opacity-30 w-16 h-16 md:w-24 md:h-24"
                    />
                    <p className="text-xs md:text-sm font-medium text-zinc-100 z-10 relative leading-tight">
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
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <h2 className="text-sm md:text-lg font-semibold text-zinc-100">هنرمندان</h2>
              <Link
                href="/artists"
                onClick={() => resetArtistFilters()}
                className="text-xs md:text-sm text-error-500"
              >
                همه
              </Link>
            </div>

            <ArtistSection loading={artistsLoading} artists={filtered} />
          </section>

          <TutorialSection />

          {/* CTA links */}
          <div className="md:grid md:grid-cols-3 md:gap-5 space-y-4 md:space-y-0">
            <Link
              href="/support"
              className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-900/60 px-4 py-4 md:px-6 md:py-6 hover:border-error-500/40 transition-colors group active:scale-[.99]"
            >
              <div>
                <p className="text-sm md:text-base font-semibold text-zinc-100">پشتیبانی</p>
                <p className="text-xs md:text-sm text-zinc-500 mt-0.5 md:mt-1">
                  با تیم ما در ارتباط باشید
                </p>
              </div>
              <ArrowLeft
                size={18}
                className="text-zinc-600 group-hover:text-error-500 transition-colors md:size-6"
              />
            </Link>

            <Link
              href="/tutorials"
              className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-900/60 px-4 py-4 md:px-6 md:py-6 hover:border-error-500/40 transition-colors group active:scale-[.99]"
            >
              <div>
                <p className="text-sm md:text-base font-semibold text-zinc-100">
                  راهنمای ویدیویی
                </p>
                <p className="text-xs md:text-sm text-zinc-500 mt-0.5 md:mt-1">
                  آموزش استفاده از اپلیکیشن
                </p>
              </div>
              <ArrowLeft
                size={18}
                className="text-zinc-600 group-hover:text-error-500 transition-colors md:size-6"
              />
            </Link>

            <Link
              href="/faq"
              className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-900/60 px-4 py-4 md:px-6 md:py-6 hover:border-error-500/40 transition-colors group active:scale-[.99]"
            >
              <div>
                <p className="text-sm md:text-base font-semibold text-zinc-100">
                  سوالات متداول
                </p>
                <p className="text-xs md:text-sm text-zinc-500 mt-0.5 md:mt-1">
                  پاسخ سوالات خود را پیدا کنید
                </p>
              </div>
              <ArrowLeft
                size={18}
                className="text-zinc-600 group-hover:text-error-500 transition-colors md:size-6"
              />
            </Link>
          </div>
        </div>
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
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-5">
        {SKELETON_KEYS.map((k) => (
          <div
            key={k}
            className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-3 md:p-4 animate-pulse"
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
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-5">
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
      className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-3 md:p-4 hover:border-error-500/40 transition-colors group active:scale-[.98] flex flex-col"
    >
      <div className="w-full aspect-square rounded-xl bg-zinc-800 mb-3 md:mb-4 overflow-hidden">
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
            <span className="text-2xl md:text-3xl font-bold text-zinc-600">
              {artist.user.firstName?.[0] ?? "؟"}
            </span>
          </div>
        )}
      </div>

      <p className="text-sm md:text-base font-semibold text-zinc-100 truncate group-hover:text-error-400 transition-colors leading-tight">
        {artist.user.firstName} {artist.user.lastName}
      </p>

      <div className="mt-1.5 md:mt-2 flex flex-col gap-1">
        {artist.categories?.[0] && (
          <span className="inline-block rounded-full bg-zinc-800 px-2 py-0.5 md:px-2.5 md:py-1 text-xs md:text-sm text-zinc-400 w-fit">
            {artist.categories[0].faName}
          </span>
        )}
        {artist.user.city && (
          <span className="text-xs md:text-sm text-zinc-600">{artist.user.city}</span>
        )}
      </div>
    </Link>
  );
}
