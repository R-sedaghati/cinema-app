"use client";

import { useEffect, useMemo, useState } from "react";
import { Drawer } from "@dgshahr/ui-kit";
import { UserRound, Camera } from "lucide-react";
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
  // Optional: offered whenever the admin enabled the field, never required.
  const showAvatar = Boolean(allFields?.some((f) => f.key === AVATAR_KEY));
  const fields = missing;

  // Everything required is in (e.g. the avatar was the only gap and its upload finished):
  // nothing left to ask, so don't leave the user staring at an empty form.
  useEffect(() => {
    if (open && profile && allFields && !missing.length) onClose();
  }, [open, profile, allFields, missing.length, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const errors = getStepErrors({ fields }, answers);
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

        {showAvatar && (
          <div className="flex items-center gap-4 rounded-2xl border border-zinc-700/60 bg-zinc-900/40 p-4">
            {profile?.avatar ? (
              <img
                src={profile.avatar}
                alt=""
                className="h-20 w-20 shrink-0 rounded-full object-cover ring-2 ring-error-500/60"
              />
            ) : (
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-zinc-800/80 ring-1 ring-zinc-600">
                <UserRound className="h-9 w-9 text-zinc-300" />
              </div>
            )}
            <div className="flex min-w-0 flex-col items-start gap-2">
              <span className="text-xs text-zinc-400">
                <span style={copy.style("completeProfileAvatarOptional")}>
                  {copy("completeProfileAvatarOptional")}
                </span>
              </span>
              <label
                className={`inline-flex cursor-pointer items-center gap-2 rounded-full border border-error-500 px-4 py-2 text-sm text-error-500 transition hover:bg-error-500/10 ${
                  uploadAvatar.isPending ? "pointer-events-none opacity-60" : ""
                }`}
              >
                <Camera className="h-4 w-4" />
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
              <span className="text-xs text-zinc-400">
                <span style={copy.style("profileAvatarHint")}>{copy("profileAvatarHint")}</span>
              </span>
            </div>
          </div>
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
