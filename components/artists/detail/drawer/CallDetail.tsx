"use client";

import Button from "@/components/common/Button";
import FieldRenderer from "@/components/artist-registration/fields/FieldRenderer";
import { useLandingCopy } from "@/lib/hooks/useLandingCopy";
import {
  useGuestCreateContactRequest,
  useUserCreateContactRequest,
  useUserProfile,
  useUserSiteContent,
} from "@/lib/services/landing/hook";
import { asFormField } from "@/lib/constants/contactForm";
import {
  guestRequestFields,
  loadSavedAnswers,
  resumeRequestFormOf,
  saveAccessToken,
  saveAnswers,
} from "@/lib/constants/resumeRequestForm";
import { EFormFieldType } from "@/lib/services/admin/type";
import type { IFormStep } from "@/lib/services/admin/type";
import { getStepErrors } from "@/lib/utils/validateFormStep";
import { profilePrefillValue } from "@/lib/utils/profilePrefill";
import { toast } from "react-toastify";
import React, { useMemo, useState } from "react";

/**
 * The resume-request form, as the admin built it. Submitting is free; an admin reviews it.
 * `guest` = no-OTP mode: the visitor has no account, so the phone is asked, persisted
 * answers are prefilled from the browser, and the returned access token is kept there.
 */
const CallDetail = ({
  artistId,
  setOpen,
  onSubmitted,
  guest,
}: {
  artistId: number;
  setOpen: (open: boolean) => void;
  onSubmitted: (trackingCode: string) => void;
  guest: boolean;
}) => {
  const copy = useLandingCopy();
  const { data: siteContent } = useUserSiteContent();
  const { data: profile } = useUserProfile();
  const userRequest = useUserCreateContactRequest();
  const guestRequest = useGuestCreateContactRequest();
  const isPending = userRequest.isPending || guestRequest.isPending;

  const form = useMemo(() => {
    const stored = resumeRequestFormOf(siteContent?.result?.resumeRequestForm);
    return guest ? { ...stored, fields: guestRequestFields(stored) } : stored;
  }, [siteContent, guest]);

  // Read once on mount; a fresh submit writes the same values back, so it cannot go stale.
  const [saved] = useState(() => (guest ? loadSavedAnswers() : {}));

  // The profile name is the account's own and renders read-only, so it wins; otherwise
  // typed answers win over a guest's saved ones.
  const [typed, setTyped] = useState<Record<string, unknown>>({});
  const locked = useMemo<Record<string, string>>(
    () =>
      Object.fromEntries(
        Object.entries({ firstName: profile?.firstName, lastName: profile?.lastName }).filter(
          ([, value]) => value,
        ),
      ) as Record<string, string>,
    [profile],
  );
  // Any other field whose key names a profile value (email, phone, a custom profile key, …)
  // starts out filled from the account but stays editable.
  const defaults = useMemo<Record<string, unknown>>(
    () =>
      profile
        ? Object.fromEntries(
            form.fields
              .map((f) => [f.key, profilePrefillValue(profile, f.key)] as const)
              .filter(([, value]) => value !== null),
          )
        : {},
    [form, profile],
  );
  const answers = useMemo<Record<string, unknown>>(
    () => ({ ...defaults, ...saved, ...typed, ...locked }),
    [defaults, locked, saved, typed],
  );

  const submit = () => {
    const step = {
      id: 0,
      title: form.title,
      order: 0,
      icon: null,
      fields: form.fields.map(asFormField),
    } satisfies IFormStep;

    const errors = getStepErrors(step, answers);
    if (errors.length) {
      toast.error(errors[0]);
      return;
    }

    // Only the form's own keys; the profile prefill must not leak into a form without them.
    const payload = Object.fromEntries(form.fields.map((f) => [f.key, answers[f.key]]));

    const done = (trackingCode: string) => {
      setOpen(false);
      onSubmitted(trackingCode);
    };

    if (guest) {
      guestRequest.mutate(
        { artistId, answers: payload },
        {
          onSuccess: (response) => {
            saveAccessToken(response.result.accessToken);
            saveAnswers(form.fields, payload);
            done(response.result.trackingCode);
          },
        },
      );
      return;
    }

    userRequest.mutate(
      { artistId, answers: payload },
      { onSuccess: (response) => done(response.result.trackingCode) },
    );
  };

  return (
    <div className="w-full space-y-6">
      <h3 data-el="title" className="text-zinc-100 text-lg text-center">{form.title}</h3>
      <p data-el="body" className="text-zinc-300 leading-8 text-sm text-center">
        <span style={copy.style("callFormDesc")}>{copy("callFormDesc")}</span>
      </p>
      {form.fields.map((field, index) => (
        <FieldRenderer
          key={field.key}
          field={asFormField(field, index)}
          value={
            answers[field.key] ??
            (field.type === EFormFieldType.CHECKBOX ? [] : "")
          }
          disabled={field.key in locked}
          onChange={(value) => setTyped((prev) => ({ ...prev, [field.key]: value }))}
        />
      ))}
      <div className="flex gap-4">
        <Button
          isFullWidth
          className="flex-1 rounded-full!"
          variant="outline"
          onClick={() => setOpen(false)}
        >
          <span data-el="button" style={copy.style("actionCancel")}>{copy("actionCancel")}</span>
        </Button>
        <Button
          onClick={submit}
          disabled={isPending}
          className="flex-1 rounded-full!"
          isFullWidth
        >
          <span data-el="button" style={isPending ? copy.style("callSubmitting") : undefined}>
            {isPending ? copy("callSubmitting") : form.submitLabel}
          </span>
        </Button>
      </div>
    </div>
  );
};

export default CallDetail;
