"use client";
/* eslint-disable @next/next/no-img-element */

import { Instagram, Phone } from "lucide-react";
import Link from "next/link";
import { useLandingCopy } from "@/lib/hooks/useLandingCopy";
import { FOOTER_DEFAULTS } from "@/lib/constants/footer";
import { useUserSiteContent } from "@/lib/services/landing/hook";
import { toEnglishDigits } from "@/lib/utils/toEnglishDigits";

export function SiteFooter() {
  const { data } = useUserSiteContent();
  const footer = data?.result?.footer;
  const copy = useLandingCopy();

  // ponytail: no phone configured -> hide the label and the tel: link entirely.
  const phone = footer?.phone?.trim() ?? "";
  const instagramUrl =
    footer?.instagramUrl?.trim() || FOOTER_DEFAULTS.instagramUrl;
  const copyright = footer?.copyright?.trim() || FOOTER_DEFAULTS.copyright;
  const enamadId = footer?.enamadId?.trim() || FOOTER_DEFAULTS.enamadId;
  const enamadCode = footer?.enamadCode?.trim() || FOOTER_DEFAULTS.enamadCode;
  const enamadQuery =
    enamadId && enamadCode
      ? `id=${encodeURIComponent(enamadId)}&Code=${encodeURIComponent(enamadCode)}`
      : null;

  // tel: needs latin digits even when the displayed number is Persian.
  const phoneHref = `tel:${toEnglishDigits(phone).replace(/\s/g, "")}`;

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
              <span style={copy.style("brandName")}>{copy("brandName")}</span>
            </h3>
          </div>
          <div className="flex items-center font-bold gap-6 text-zinc-400 text-sm">
            {phone && (
              <span className="tracking-wider ss02">
                <span style={copy.style("footerPhoneLabel")}>{copy("footerPhoneLabel")}</span> {phone}
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
            <span style={copy.style("footerArtists")}>{copy("footerArtists")}</span>
          </Link>
          <Link href="/about" className="hover:text-white transition-colors">
            <span style={copy.style("footerAbout")}>{copy("footerAbout")}</span>
          </Link>
          <Link href="/contact" className="hover:text-white transition-colors">
            <span style={copy.style("footerContact")}>{copy("footerContact")}</span>
          </Link>
          <Link href="/faq" className="hover:text-white transition-colors">
            <span style={copy.style("footerFaq")}>{copy("footerFaq")}</span>
          </Link>
          <Link href="/support" className="hover:text-white transition-colors">
            <span style={copy.style("footerSupport")}>{copy("footerSupport")}</span>
          </Link>
          <Link href="/terms" className="hover:text-white transition-colors">
            <span style={copy.style("footerTerms")}>{copy("footerTerms")}</span>
          </Link>
        </nav>
        {/* bottom */}
        <div className="flex flex-col md:flex-row justify-between gap-5 items-center">
          <div className="flex flex-col items-start justify-center gap-8">
            <h3 className="text-xl font-semibold text-white">
              <span style={copy.style("footerAppDownload")}>{copy("footerAppDownload")}</span>
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
          {enamadQuery && (
            // referrerPolicy="origin" is required: Enamad validates the seal by referrer domain.
            <a
              referrerPolicy="origin"
              target="_blank"
              href={`https://trustseal.enamad.ir/?${enamadQuery}`}
              className="rounded-xl bg-white p-1"
            >
              <img
                referrerPolicy="origin"
                src={`https://trustseal.enamad.ir/logo.aspx?${enamadQuery}`}
                alt="enamad"
                width={96}
                height={96}
                className="cursor-pointer"
              />
            </a>
          )}
        </div>

        <p className="border-t border-zinc-800 pt-6 text-center text-xs text-zinc-500">
          {copyright}
        </p>
      </div>
    </footer>
  );
}
