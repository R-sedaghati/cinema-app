"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import ContentCard from "./ContentCard";
import { useLandingCopy } from "@/lib/hooks/useLandingCopy";
import Input from "@/components/common/Input";
import Button from "../common/Button";
import { isMobile } from "react-device-detect";
import {
  useProfileFields,
  useUpdateUserProfile,
  useUserProfile,
  useUserUploadAvatar,
} from "@/lib/services/landing/hook";
import { UserRound } from "lucide-react";
import { toast } from "react-toastify";
import FieldRenderer from "@/components/artist-registration/fields/FieldRenderer";
import { getStepErrors } from "@/lib/utils/validateFormStep";
import { AVATAR_KEY, profileValues } from "@/lib/utils/profileFields";

export default function Overview() {
  const { data } = useUserProfile();
  const { data: allFields } = useProfileFields();
  const { mutate, isPending } = useUpdateUserProfile();
  const uploadAvatar = useUserUploadAvatar();
  const copy = useLandingCopy();

  // Admin-configured fields; the avatar keeps its own uploader (it has its own endpoint).
  const showAvatar = Boolean(allFields?.some((f) => f.key === AVATAR_KEY));
  const fields = useMemo(
    () => (allFields ?? []).filter((f) => f.key !== AVATAR_KEY),
    [allFields],
  );

  const [form, setForm] = useState<Record<string, unknown>>({});

  // Seeding runs again whenever the query refetches (a save, a reconnect). Once the user
  // has touched the form, their input wins — otherwise a refetch wipes what they typed.
  const isDirty = useRef(false);

  useEffect(() => {
    if (!data || !allFields || isDirty.current) return;
    setForm(profileValues(data, fields));
  }, [data, allFields, fields]);

  const handleChange = (key: string) => (value: unknown) => {
    isDirty.current = true;
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const errors = getStepErrors({ fields }, form);
    if (errors.length) {
      toast.error(errors[0]);
      return;
    }

    mutate(form, {
      onSuccess: () => {
        // Let the invalidated query re-seed the form with what the server stored.
        isDirty.current = false;
        toast.success(copy("saveSuccess"));
      },
    });
  };

  return (
    <ContentCard title={copy("profileOverviewTitle")}>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-8 rounded-xl border-2 border-zinc-700/60 bg-gray-100/60 p-4 backdrop-blur-sm"
      >
        {showAvatar && (
          <div className="flex items-center gap-4">
            {data?.avatar ? (
              <img
                src={data.avatar}
                alt=""
                className="h-20 w-20 rounded-full object-cover ring-1 ring-zinc-700"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-zinc-800/80 ring-1 ring-zinc-700">
                <UserRound className="h-8 w-8 text-zinc-300" />
              </div>
            )}
            <div className="flex flex-col gap-1">
              <label className="cursor-pointer text-sm text-error-500">
                <span style={copy.style("profileAvatarCta")}>
                  {uploadAvatar.isPending ? "..." : copy("profileAvatarCta")}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={uploadAvatar.isPending}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    e.target.value = "";
                    if (!file) return;
                    uploadAvatar.mutate(file, {
                      onSuccess: () => toast.success(copy("saveSuccess")),
                      onError: () => toast.error(copy("profileAvatarError")),
                    });
                  }}
                />
              </label>
              <span
                className="text-xs text-zinc-400"
                style={copy.style("profileAvatarHint")}
              >
                {copy("profileAvatarHint")}
              </span>
            </div>
          </div>
        )}

        <div className="grid w-full gap-4 md:grid-cols-2">
          {fields.map((field) => (
            <FieldRenderer
              key={field.key}
              field={field}
              value={form[field.key]}
              onChange={handleChange(field.key)}
            />
          ))}

          <Input
            id="phone"
            labelContent={copy("fieldPhone")}
            required
            dir="ltr"
            type="tel"
            disabled
            placeholder="09*********"
            value={data?.phone_number ?? ""}
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
            <span style={copy.style("profileOverviewCta")}>
              {copy("profileOverviewCta")}
            </span>
          </Button>
        </div>
      </form>
    </ContentCard>
  );
}
