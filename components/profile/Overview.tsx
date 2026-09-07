"use client";

import React, { useEffect, useRef, useState } from "react";
import ContentCard from "./ContentCard";
import { useLandingCopy } from "@/lib/hooks/useLandingCopy";
import Input from "@/components/common/Input";
import Button from "../common/Button";
import { isMobile } from "react-device-detect";
import {
  useUpdateUserProfile,
  useUserProfile,
} from "@/lib/services/landing/hook";
import {
  FIELD_VALIDATION_PRESETS,
  isValidPreset,
} from "@/lib/utils/fieldValidationPresets";
import { toast } from "react-toastify";

export default function Overview() {
  const { data } = useUserProfile();
  const { mutate, isPending } = useUpdateUserProfile();
  const copy = useLandingCopy();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    nationalCode: "",
    phone_number: "",
  });
  const [nationalCodeError, setNationalCodeError] = useState<string | null>(
    null,
  );

  // Seeding runs again whenever the query refetches (a save, a reconnect). Once the user
  // has touched the form, their input wins — otherwise a refetch wipes what they typed.
  const isDirty = useRef(false);

  useEffect(() => {
    if (!data || isDirty.current) return;

    setForm({
      firstName: data.firstName ?? "",
      lastName: data.lastName ?? "",
      email: data.email ?? "",
      nationalCode: data.nationalCode ?? "",
      phone_number: data.phone_number ?? "",
    });
  }, [data]);

  const handleChange =
    (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
      isDirty.current = true;

      if (field === "nationalCode") setNationalCodeError(null);

      setForm((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // The national code is optional, but a filled-in one has to pass the checksum.
    const nationalCode = form.nationalCode.trim();

    if (nationalCode && !isValidPreset("NATIONAL_CODE", nationalCode)) {
      setNationalCodeError(FIELD_VALIDATION_PRESETS.NATIONAL_CODE.message);
      return;
    }

    mutate(
      {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        nationalCode,
      },
      {
        onSuccess: () => {
          // Let the invalidated query re-seed the form with what the server stored.
          isDirty.current = false;
          toast.success(copy("saveSuccess"));
        },
      },
    );
  };

  return (
    <ContentCard title={copy("profileOverviewTitle")}>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-8 rounded-xl border-2 border-zinc-700/60 bg-gray-100/60 p-4 backdrop-blur-sm"
      >
        <div className="grid w-full gap-4 md:grid-cols-2">
          <Input
            id="first-name"
            labelContent={copy("fieldFirstName")}
            required
            placeholder={copy("fieldFirstNamePlaceholder")}
            value={form.firstName}
            onChange={handleChange("firstName")}
          />

          <Input
            id="last-name"
            labelContent={copy("fieldLastName")}
            required
            placeholder={copy("fieldLastNamePlaceholder")}
            value={form.lastName}
            onChange={handleChange("lastName")}
          />

          <Input
            id="email"
            labelContent={copy("fieldEmail")}
            required
            dir="ltr"
            placeholder={copy("fieldEmailPlaceholder")}
            value={form.email}
            onChange={handleChange("email")}
          />

          <Input
            id="national-code"
            labelContent={copy("fieldNationalCode")}
            dir="ltr"
            inputMode="numeric"
            maxLength={10}
            placeholder={copy("fieldNationalCodePlaceholder")}
            value={form.nationalCode}
            onChange={handleChange("nationalCode")}
            isError={Boolean(nationalCodeError)}
            errorMessage={nationalCodeError}
          />

          <Input
            id="phone"
            labelContent={copy("fieldPhone")}
            required
            dir="ltr"
            type="tel"
            disabled
            placeholder="09*********"
            value={form.phone_number}
          />
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            isFullWidth={isMobile}
            className="rounded-full!"
            isLoading={isPending}
            disabled={isPending}
          >
            {copy("profileOverviewCta")}
          </Button>
        </div>
      </form>
    </ContentCard>
  );
}
