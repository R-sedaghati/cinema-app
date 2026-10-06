"use client";

import { EFormFieldType, IArtistItem } from "@/lib/services/admin/type";
import { useEffect, useMemo, useState } from "react";
import { Clock, Lock } from "lucide-react";
import CallDetailDrawer from "./CallDetailDrawer";
import Button from "@/components/common/Button";
import SuccessDrawer from "./SuccessDrawer";
import {
  useGuestArtistContact,
  useGuestContactRequests,
  useUserArtistContact,
  useUserContactRequests,
  useUserSiteContent,
} from "@/lib/services/landing/hook";
import { loadAccessTokens } from "@/lib/constants/resumeRequestForm";
import useAuthStore from "@/lib/stores/useAuthStore";
import useLoginDrawerStore from "@/lib/stores/useLoginDrawerStore";
import { useLandingCopy } from "@/lib/hooks/useLandingCopy";
import { formatAnswer } from "@/lib/utils/formatAnswer";
import { toResumeName } from "@/lib/utils/resumeName";
import {
  ANSWER_KEYS,
  displayAnswer,
  displayGender,
  pickAnswer,
} from "@/lib/utils/artistAnswers";
import convertGregorianTimeToShamsiTime from "@/lib/utils/convertGregorianTimeToShamsiTime";

/** Private answers the fixed contact rows below already show. */
const FIXED_CONTACT_KEYS = new Set(["email", "address", "postalCode"]);
const FILE_TYPES = new Set([EFormFieldType.IMAGE, EFormFieldType.VIDEO]);

const Aside = ({ artist }: { artist: IArtistItem }) => {
  const [openCallDetail, setOpenCallDetail] = useState<boolean>(false);
  const [openSuccess, setOpenSuccess] = useState<boolean>(false);
  const [trackingCode, setTrackingCode] = useState<string | null>(null);
  const { accessToken } = useAuthStore();
  const { open: openLoginDrawer, isOpen: isLoginOpen } = useLoginDrawerStore();
  // Clicked the request button while signed out: open the form once login succeeds.
  const [formAfterLogin, setFormAfterLogin] = useState(false);
  const copy = useLandingCopy();
  const genderLabels = {
    man: copy("labelGenderMan"),
    woman: copy("labelGenderWoman"),
  };

  // Asking the contact endpoint directly would 403 (and toast) for everyone not yet
  // approved, so the state is read from the viewer's own request list first.
  // ponytail: 50 is the server's max page size; a viewer with more requests than that
  // sees page 1 only — paginate here if that ever happens in practice.
  const { data: myRequests } = useUserContactRequests({ page: 1, count: 50 });

  // No-OTP mode: a visitor without an account requests as a guest. Their proof of access
  // is the tokens this browser kept; read after mount so the server render matches.
  const { data: siteContent } = useUserSiteContent();
  const guestMode = Boolean(siteContent?.result?.resumeRequestForm?.guestMode);
  const isGuest = !accessToken && guestMode;
  const [guestTokens, setGuestTokens] = useState<string[]>([]);
  useEffect(() => setGuestTokens(loadAccessTokens()), []);

  // OTP success sets the token and closes the drawer in one go, so a closed drawer with
  // no token means the visitor gave up — forget the intent then.
  useEffect(() => {
    if (!formAfterLogin) return;
    if (accessToken) setOpenCallDetail(true);
    if (accessToken || !isLoginOpen) setFormAfterLogin(false);
  }, [formAfterLogin, accessToken, isLoginOpen]);
  // Tokens outlive the mode switch: access granted while it was on stays granted.
  const { data: guestRequests } = useGuestContactRequests(guestTokens, true);

  const guestMine = useMemo(
    () =>
      guestRequests?.result?.filter(
        (request) => request.artistId === artist.id,
      ) ?? [],
    [guestRequests, artist.id],
  );
  const guestApprovedToken =
    guestMine.find((request) => request.status === "APPROVED")?.token ?? null;

  // A rejected request is ignored: the viewer may simply ask again.
  const requestStatus = useMemo(() => {
    const mine = [
      ...(myRequests?.result?.filter(
        (request) => request.artist.id === artist.id,
      ) ?? []),
      ...guestMine,
    ];
    if (mine.some((request) => request.status === "APPROVED"))
      return "APPROVED";
    if (mine.some((request) => request.status === "PENDING")) return "PENDING";
    return null;
  }, [myRequests, guestMine, artist.id]);

  const isUnlocked = requestStatus === "APPROVED";
  const accountUnlocked = Boolean(
    myRequests?.result?.some(
      (r) => r.artist.id === artist.id && r.status === "APPROVED",
    ),
  );

  const { data: accountContact } = useUserArtistContact(
    artist.id,
    accountUnlocked,
  );
  const { data: guestContact } = useGuestArtistContact(
    artist.id,
    accountUnlocked ? null : guestApprovedToken,
  );
  const contact = (accountContact ?? guestContact)?.result;

  const pickFromContact = (keys: readonly string[]) =>
    contact?.fields?.find((f) =>
      keys.some((k) => k === f.key || k.toLowerCase() === f.key.toLowerCase()),
    )?.value;

  const genderText = displayGender(
    pickAnswer(artist.answers, ANSWER_KEYS.gender) ??
      pickFromContact(ANSWER_KEYS.gender),
    genderLabels,
  );
  const provinceText =
    displayAnswer(
      pickAnswer(artist.answers, ANSWER_KEYS.province) ??
        pickFromContact(ANSWER_KEYS.province),
    ) ??
    displayAnswer(
      pickAnswer(artist.answers, ANSWER_KEYS.city) ??
        pickFromContact(ANSWER_KEYS.city),
    );
  const birthRaw =
    pickAnswer(artist.answers, ANSWER_KEYS.birthDate) ??
    pickFromContact(ANSWER_KEYS.birthDate);
  const birthText = (() => {
    const text = displayAnswer(birthRaw);
    if (!text) return undefined;
    return convertGregorianTimeToShamsiTime(text, false) || text;
  })();

  const bioAnswerKeys = new Set<string>([
    ...ANSWER_KEYS.gender,
    ...ANSWER_KEYS.province,
    ...ANSWER_KEYS.city,
    ...ANSWER_KEYS.birthDate,
  ]);

  const unlockedName = [contact?.firstName, contact?.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();

  // Until a request is approved, an artist is identified only by their public code.
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
            <span className="text-zinc-500">
              <span style={copy.style("artistProvince")}>
                {copy("artistProvince")}
              </span>
            </span>
            <span>{provinceText ?? "—"}</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-between lg:flex-row lg:justify-between gap-1">
            <span className="text-zinc-500">
              <span style={copy.style("artistCategory")}>
                {copy("artistCategory")}
              </span>
            </span>
            <span>{toResumeName(artist.categories[0]?.faName) || "—"}</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-between lg:flex-row lg:justify-between gap-1">
            <span className="text-zinc-500">
              <span style={copy.style("artistGender")}>
                {copy("artistGender")}
              </span>
            </span>
            <span>{genderText ?? "—"}</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-between lg:flex-row lg:justify-between gap-1">
            <span className="text-zinc-500">
              <span style={copy.style("artistBirthDate")}>
                {copy("artistBirthDate")}
              </span>
            </span>
            <span>{birthText ?? "—"}</span>
          </div>

          {typeof artist.answers?.dialect === "string" &&
            artist.answers.dialect && (
              <div className="flex flex-col sm:flex-row sm:justify-between lg:flex-row lg:justify-between gap-1">
                <span className="text-zinc-500">
                  <span style={copy.style("artistAccent")}>
                    {copy("artistAccent")}
                  </span>
                </span>
                <span>{artist.answers.dialect as string}</span>
              </div>
            )}
        </div>

        {isUnlocked && contact && (
          <div className="mt-6 sm:mt-10 space-y-3 rounded-2xl border border-emerald-800/60 bg-emerald-950/20 p-4 text-sm">
            <p className="text-emerald-500">
              <span style={copy.style("artistContactTitle")}>
                {copy("artistContactTitle")}
              </span>
            </p>
            {contact.phoneNumber && (
              <div className="flex justify-between gap-2">
                <span className="text-zinc-500">
                  <span style={copy.style("artistContactPhone")}>
                    {copy("artistContactPhone")}
                  </span>
                </span>
                <a
                  href={`tel:${contact.phoneNumber}`}
                  className="text-zinc-100"
                  dir="ltr"
                >
                  {contact.phoneNumber}
                </a>
              </div>
            )}
            {contact.email && (
              <div className="flex justify-between gap-2">
                <span className="text-zinc-500">
                  <span style={copy.style("artistContactEmail")}>
                    {copy("artistContactEmail")}
                  </span>
                </span>
                <a
                  href={`mailto:${contact.email}`}
                  className="text-zinc-100"
                  dir="ltr"
                >
                  {contact.email}
                </a>
              </div>
            )}
            {contact.address && (
              <div className="flex justify-between gap-2">
                <span className="text-zinc-500">
                  <span style={copy.style("artistContactAddress")}>
                    {copy("artistContactAddress")}
                  </span>
                </span>
                <span className="text-zinc-100 text-left">
                  {contact.address}
                </span>
              </div>
            )}
            {contact.postalCode && (
              <div className="flex justify-between gap-2">
                <span className="text-zinc-500">
                  <span style={copy.style("artistContactPostalCode")}>
                    {copy("artistContactPostalCode")}
                  </span>
                </span>
                <span className="text-zinc-100" dir="ltr">
                  {contact.postalCode}
                </span>
              </div>
            )}
            {contact.fields
              ?.filter(
                (f) =>
                  !FIXED_CONTACT_KEYS.has(f.key) && !bioAnswerKeys.has(f.key),
              )
              .map((f) => (
                <div key={f.key} className="flex justify-between gap-2">
                  <span className="text-zinc-500">{f.label}</span>
                  {FILE_TYPES.has(f.type) ? (
                    <span className="flex flex-wrap gap-2 justify-end">
                      {(f.value as string[]).map((url, i) => (
                        <a
                          key={url}
                          href={url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-emerald-400 underline"
                        >
                          {i + 1}
                        </a>
                      ))}
                    </span>
                  ) : (
                    <span className="text-zinc-100 text-left">
                      {formatAnswer(f, f.value, {
                        yes: copy("artistContactYes"),
                        no: copy("artistContactNo"),
                        empty: "—",
                        sep: copy("listSeparator"),
                      })}
                    </span>
                  )}
                </div>
              ))}
          </div>
        )}

        <div className="mt-6 sm:mt-10 space-y-3">
          {requestStatus === "PENDING" && (
            <Button
              disabled
              size="small"
              isFullWidth
              className="rounded-full!"
              leftIcon={<Clock size={16} />}
            >
              <span style={copy.style("callPendingCta")}>
                {copy("callPendingCta")}
              </span>
            </Button>
          )}
          {requestStatus === null && (
            <Button
              // Nothing here can be requested signed out, so ask for the account before the
              // form rather than after it is filled in.
              onClick={() =>
                accessToken || isGuest
                  ? setOpenCallDetail(true)
                  : (setFormAfterLogin(true), openLoginDrawer())
              }
              size="small"
              isFullWidth
              className="rounded-full!"
              leftIcon={<Lock size={16} />}
            >
              <span style={copy.style("artistContactCta")}>
                {copy("artistContactCta")}
              </span>
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
            <span style={copy.style("artistShareCta")}>
              {copy("artistShareCta")}
            </span>
          </Button>
        </div>

        {!accessToken && !isGuest && !isUnlocked && (
          <p className="mt-4 text-center text-xs text-zinc-500">
            <span style={copy.style("artistLoginFirst")}>
              {copy("artistLoginFirst")}
            </span>
          </p>
        )}
      </aside>
      <CallDetailDrawer
        open={openCallDetail}
        setOpen={setOpenCallDetail}
        artistId={artist.id}
        guest={isGuest}
        onSubmitted={(code) => {
          setTrackingCode(code);
          setOpenSuccess(true);
          setGuestTokens(loadAccessTokens());
        }}
      />
      <SuccessDrawer
        open={openSuccess}
        setOpen={setOpenSuccess}
        trackingCode={trackingCode}
        guest={isGuest}
      />
    </>
  );
};

export default Aside;
