"use client";
/* eslint-disable @next/next/no-img-element */

import { Instagram, Phone } from "lucide-react";
import Link from "next/link";
import { useLandingCopy } from "@/lib/hooks/useLandingCopy";
import { FOOTER_DEFAULTS } from "@/lib/constants/footer";
import { useUserSiteContent } from "@/lib/services/landing/hook";
import convertFaNumericStringToEnNumericString from "@/lib/utils/convertFaNumericStringToEnNumericString";

export function SiteFooter() {
  const { data } = useUserSiteContent();
  const footer = data?.result?.footer;
  const copy = useLandingCopy();

  // ponytail: no phone configured -> hide the label and the tel: link entirely.
  const phone = footer?.phone?.trim() ?? "";
  const instagramUrl =
    footer?.instagramUrl?.trim() || FOOTER_DEFAULTS.instagramUrl;
  const copyright = footer?.copyright?.trim() || FOOTER_DEFAULTS.copyright;

  // tel: needs latin digits even when the displayed number is Persian.
  const phoneHref = `tel:${convertFaNumericStringToEnNumericString(phone).replace(/\s/g, "")}`;

  return (
    <footer className="bg-zinc-950/40 text-white">
      <div className="mx-auto max-w-7xl px-6 py-16 flex flex-col gap-14">
        {/* top */}
        <div className="flex flex-col md:flex-row gap-5 justify-between items-center">
          <div className="flex gap-2 items-center">
            <img
              src="/assets/images/logo.svg"
              alt="logo"
              width={60}
              height={60}
            />
            <h3 className="text-3xl text-error-500 font-extrabold">
              {copy("brandName")}
            </h3>
          </div>
          <div className="flex items-center font-bold gap-6 text-zinc-400 text-sm">
            {phone && (
              <span className="tracking-wider ss02">
                {copy("footerPhoneLabel")} {phone}
              </span>
            )}
            <a
              href={instagramUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={copy("ariaInstagram")}
              className="hover:text-white transition-colors"
            >
              <Instagram />
            </a>
            {phone && (
              <a
                href={phoneHref}
                aria-label={copy("ariaSupportCall")}
                className="hover:text-white transition-colors"
              >
                <Phone />
              </a>
            )}
          </div>
        </div>

        {/* mid */}
        <nav className="flex flex-col font-bold gap-4 text-sm text-zinc-300">
          <Link href="/artists" className="hover:text-white transition-colors">
            {copy("footerArtists")}
          </Link>
          <Link href="/about" className="hover:text-white transition-colors">
            {copy("footerAbout")}
          </Link>
          <Link href="/contact" className="hover:text-white transition-colors">
            {copy("footerContact")}
          </Link>
          <Link href="/faq" className="hover:text-white transition-colors">
            {copy("footerFaq")}
          </Link>
          <Link href="/support" className="hover:text-white transition-colors">
            {copy("footerSupport")}
          </Link>
          <Link href="/terms" className="hover:text-white transition-colors">
            {copy("footerTerms")}
          </Link>
        </nav>
        {/* bottom */}
        <div className="flex flex-col md:flex-row justify-between gap-5 items-center">
          <div className="flex flex-col items-start justify-center gap-8">
            <h3 className="text-xl font-semibold text-white">
              {copy("footerAppDownload")}
            </h3>

            <div className="flex flex-col md:flex-row gap-4 w-full">
              <img
                src="/download-android.svg"
                alt="App Store"
                className="h-18.75 w-64"
                width={256}
                height={75}
              />
              <img
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

        <p className="border-t border-zinc-800 pt-6 text-center text-xs text-zinc-500">
          {copyright}
        </p>
      </div>
    </footer>
  );
}
