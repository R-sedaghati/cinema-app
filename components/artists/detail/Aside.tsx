"use client";

import { IArtistItem } from "@/lib/services/admin/type";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Lock } from "lucide-react";
import CallDetailDrawer from "./CallDetailDrawer";
import Button from "@/components/common/Button";
import SuccessDrawer from "./SuccessDrawer";
import {
  useUserArtistContact,
  useUserContactRequests,
} from "@/lib/services/landing/hook";
import useAuthStore from "@/lib/stores/useAuthStore";
import useLoginDrawerStore from "@/lib/stores/useLoginDrawerStore";
import { useLandingCopy } from "@/lib/hooks/useLandingCopy";
import { toast } from "react-toastify";

const Aside = ({ artist }: { artist: IArtistItem }) => {
  const [openCallDetail, setOpenCallDetail] = useState<boolean>(false);
  const [openSuccess, setOpenSuccess] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const { accessToken } = useAuthStore();
  const { open: openLoginDrawer } = useLoginDrawerStore();
  const copy = useLandingCopy();
  const genderMap: Record<string, string> = {
    MAN: copy("labelGenderMan"),
    WOMAN: copy("labelGenderWoman"),
  };

  // The gateway sends the buyer back here after paying.
  const paymentOutcome = searchParams.get("contact");
  const trackingCode = searchParams.get("tracking");

  useEffect(() => {
    if (paymentOutcome === "success") setOpenSuccess(true);

    // Anything other than success needs saying out loud — a buyer who is told nothing
    // assumes the payment did not happen and pays again.
    if (paymentOutcome === "pending") {
      toast.info(copy("contactPaymentPendingToast"));
    }

    if (paymentOutcome === "failed" || paymentOutcome === "canceled") {
      toast.error(copy("contactPaymentFailedToast"));
    }
  }, [paymentOutcome, copy]);

  // Asking the contact endpoint directly would 403 (and toast) for everyone who has not
  // paid, so ownership is established from the buyer's own purchase list first.
  // ponytail: 50 is the server's max page size; a buyer with more purchases than that
  // sees page 1 only — paginate here if that ever happens in practice.
  const { data: myRequests } = useUserContactRequests({ page: 1, count: 50 });

  const isUnlocked = useMemo(
    () =>
      Boolean(
        myRequests?.result?.some(
          (request) =>
            request.artist.id === artist.id && request.status === "COMPLETED",
        ),
      ),
    [myRequests, artist.id],
  );

  const { data: contactData } = useUserArtistContact(artist.id, isUnlocked);
  const contact = contactData?.result;

  const unlockedName = [contact?.firstName, contact?.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();

  // Until it is paid for, an artist is identified only by their public code.
  const displayName = unlockedName || artist.user?.code || "—";

  return (
    <>
      <aside className="relative rounded-3xl border-2 h-fit border-zinc-800 bg-zinc-900/90 p-5 sm:p-8 shadow-2xl backdrop-blur">
        <div className="absolute flex justify-center items-center rounded-full -top-16 left-1/2 border-2 border-error-600 h-36 w-36 sm:h-40 sm:w-40 -translate-x-1/2">
          {artist.user.avatar ? (
            <img
              src={artist.user.avatar}
              alt={displayName}
              className="h-32 w-32 sm:h-36 sm:w-36 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-32 w-32 sm:h-36 sm:w-36 items-center justify-center rounded-full bg-zinc-700 text-4xl sm:text-5xl font-bold text-white shadow-xl">
              {displayName.slice(0, 1)}
            </div>
          )}
        </div>

        <div className="mt-20 sm:mt-24 text-center">
          <h1 className="font-h1-regular text-2xl sm:text-3xl text-white">
            {displayName}
          </h1>
        </div>

        <div className="mt-6 sm:mt-10 grid grid-cols-2 gap-x-4 gap-y-3 text-sm sm:text-base text-zinc-300 lg:grid-cols-1 lg:gap-y-4">
          <div className="flex flex-col sm:flex-row sm:justify-between lg:flex-row lg:justify-between gap-1">
            <span className="text-zinc-500">{copy("artistProvince")}</span>
            <span>{(artist.answers?.province as string | undefined) ?? "—"}</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-between lg:flex-row lg:justify-between gap-1">
            <span className="text-zinc-500">{copy("artistCategory")}</span>
            <span>{artist.categories[0]?.faName ?? "—"}</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-between lg:flex-row lg:justify-between gap-1">
            <span className="text-zinc-500">{copy("artistGender")}</span>
            <span>{genderMap[artist.answers?.gender as string] ?? "—"}</span>
          </div>

          {typeof artist.answers?.dialect === "string" && artist.answers.dialect && (
            <div className="flex flex-col sm:flex-row sm:justify-between lg:flex-row lg:justify-between gap-1">
              <span className="text-zinc-500">{copy("artistAccent")}</span>
              <span>{artist.answers.dialect as string}</span>
            </div>
          )}
        </div>

        {isUnlocked && contact && (
          <div className="mt-6 sm:mt-10 space-y-3 rounded-2xl border border-emerald-800/60 bg-emerald-950/20 p-4 text-sm">
            <p className="text-emerald-500">{copy("artistContactTitle")}</p>
            {contact.phoneNumber && (
              <div className="flex justify-between gap-2">
                <span className="text-zinc-500">{copy("artistContactPhone")}</span>
                <a href={`tel:${contact.phoneNumber}`} className="text-zinc-100" dir="ltr">
                  {contact.phoneNumber}
                </a>
              </div>
            )}
            {contact.email && (
              <div className="flex justify-between gap-2">
                <span className="text-zinc-500">{copy("artistContactEmail")}</span>
                <a href={`mailto:${contact.email}`} className="text-zinc-100" dir="ltr">
                  {contact.email}
                </a>
              </div>
            )}
            {contact.address && (
              <div className="flex justify-between gap-2">
                <span className="text-zinc-500">{copy("artistContactAddress")}</span>
                <span className="text-zinc-100 text-left">{contact.address}</span>
              </div>
            )}
            {contact.postalCode && (
              <div className="flex justify-between gap-2">
                <span className="text-zinc-500">{copy("artistContactPostalCode")}</span>
                <span className="text-zinc-100" dir="ltr">
                  {contact.postalCode}
                </span>
              </div>
            )}
          </div>
        )}

        <div className="mt-6 sm:mt-10 space-y-3">
          {!isUnlocked && (
            <Button
              // Nothing here can be bought signed out, so ask for the account before the
              // form rather than after it is filled in.
              onClick={() =>
                accessToken ? setOpenCallDetail(true) : openLoginDrawer()
              }
              size="small"
              isFullWidth
              className="rounded-full!"
              leftIcon={<Lock size={16} />}
            >
              {copy("artistContactCta")}
            </Button>
          )}
          <Button
            variant="outline"
            size="small"
            isFullWidth
            className="rounded-full! border-error-500!"
            onClick={() => {
              const url = globalThis.location.href;
              if (navigator.share) {
                navigator.share({ title: displayName, url });
              } else {
                navigator.clipboard.writeText(url);
              }
            }}
          >
            {copy("artistShareCta")}
          </Button>
        </div>

        {!accessToken && (
          <p className="mt-4 text-center text-xs text-zinc-500">
            {copy("artistLoginFirst")}
          </p>
        )}
      </aside>
      <CallDetailDrawer
        open={openCallDetail}
        setOpen={setOpenCallDetail}
        artistId={artist.id}
      />
      <SuccessDrawer
        open={openSuccess}
        setOpen={setOpenSuccess}
        trackingCode={trackingCode}
      />
    </>
  );
};

export default Aside;
