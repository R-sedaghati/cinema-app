"use client";

import { useEffect, useMemo, useState } from "react";
import { Drawer } from "@dgshahr/ui-kit";
import { toast } from "react-toastify";
import getDrawerWidth from "@/lib/utils/getDrawerWidth";
import getDrawerPosition from "@/lib/utils/getDrawerPosition";
import {
  useProfileFields,
  useUpdateUserProfile,
  useUserProfile,
  useUserUploadAvatar,
} from "@/lib/services/landing/hook";
import FieldRenderer from "@/components/artist-registration/fields/FieldRenderer";
import { getStepErrors } from "@/lib/utils/validateFormStep";
import { AVATAR_KEY, missingProfileFields } from "@/lib/utils/profileFields";
import Button from "@/components/common/Button";
import { useLandingCopy } from "@/lib/hooks/useLandingCopy";

interface Props {
  open: boolean;
  onClose: () => void;
}

const CompleteProfileDrawer = ({ open, onClose }: Props) => {
  const { mutate, isPending } = useUpdateUserProfile();
  const uploadAvatar = useUserUploadAvatar();
  const { data: profile } = useUserProfile();
  const { data: allFields } = useProfileFields();
  const copy = useLandingCopy();
  const [answers, setAnswers] = useState<Record<string, unknown>>({});

  // Only the required fields still empty. The avatar drops out by itself once uploaded,
  // since the upload refreshes the profile; the others stay until the save.
  const missing = useMemo(
    () => (profile && allFields ? missingProfileFields(profile, allFields) : []),
    [profile, allFields],
  );
  const needsAvatar = missing.some((f) => f.key === AVATAR_KEY);
  const fields = missing.filter((f) => f.key !== AVATAR_KEY);

  // Everything required is in (e.g. the avatar was the only gap and its upload finished):
  // nothing left to ask, so don't leave the user staring at an empty form.
  useEffect(() => {
    if (open && profile && allFields && !missing.length) onClose();
  }, [open, profile, allFields, missing.length, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const errors = getStepErrors({ fields }, answers);
    if (needsAvatar) errors.unshift(copy("profileAvatarCta"));
    if (errors.length) {
      toast.error(errors[0]);
      return;
    }

    const done = () => {
      toast.success(copy("completeProfileSuccess"));
      onClose();
    };

    if (!fields.length) return done();

    mutate(
      Object.fromEntries(fields.map((f) => [f.key, answers[f.key]])),
      { onSuccess: done },
    );
  };

  return (
    <Drawer
      header={{
        title: copy("completeProfileTitle"),
        haveCloseIcon: true,
      }}
      width={getDrawerWidth(420)}
      position={getDrawerPosition()}
      open={open}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 p-4">
        <p className="text-sm text-zinc-400">
          <span style={copy.style("completeProfileDesc")}>{copy("completeProfileDesc")}</span>
        </p>

        {needsAvatar && (
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
                  onError: () => toast.error(copy("profileAvatarError")),
                });
              }}
            />
          </label>
        )}

        {fields.map((field) => (
          <FieldRenderer
            key={field.key}
            field={field}
            value={answers[field.key] ?? ""}
            onChange={(value) => setAnswers((prev) => ({ ...prev, [field.key]: value }))}
          />
        ))}

        <div className="flex flex-col gap-2">
          <Button
            type="submit"
            isLoading={isPending}
            disabled={isPending}
            className="w-full rounded-full!"
            isFullWidth
          >
            <span style={copy.style("actionSave")}>{copy("actionSave")}</span>
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isPending}
            className="w-full rounded-full!"
            isFullWidth
          >
            <span style={copy.style("actionCancel")}>{copy("actionCancel")}</span>
          </Button>
        </div>
      </form>
    </Drawer>
  );
};

export default CompleteProfileDrawer;
