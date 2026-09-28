"use client";

import { Button, Card, Divider } from "@dgshahr/ui-kit";
import Input from "@/components/common/Input";
import { UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  useAdminProfile,
  useAdminProfileUpdate,
  useAdminUploadBannerImage,
} from "@/lib/services/admin/hook";

/** The logged-in admin's own name and picture, shown in the sidebar. */
const AdminProfileForm = () => {
  const { data, isPending: isLoading } = useAdminProfile();
  const { mutate, isPending } = useAdminProfileUpdate();
  const upload = useAdminUploadBannerImage();
  const profile = data?.result;

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  // `avatarPath` is what gets saved; `preview` is what is shown until then.
  const [avatarPath, setAvatarPath] = useState<string | null | undefined>(undefined);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (!profile || isDirty) return;
    setFirstName(profile.firstName ?? "");
    setLastName(profile.lastName ?? "");
    setPreview(profile.avatar);
    setAvatarPath(undefined);
  }, [profile, isDirty]);

  const onPickFile = (file: File | undefined) => {
    if (!file) return;
    upload.mutate(file, {
      onSuccess: ({ path, url }) => {
        setIsDirty(true);
        setAvatarPath(path);
        setPreview(url ?? null);
      },
      onError: () => toast.error("خطا در بارگذاری تصویر"),
    });
  };

  const onRemove = () => {
    setIsDirty(true);
    setAvatarPath(null);
    setPreview(null);
  };

  const handleSubmit = () => {
    mutate(
      { firstName, lastName, ...(avatarPath !== undefined && { avatar: avatarPath }) },
      {
        onSuccess: () => {
          toast.success("با موفقیت تغییر کرد");
          setIsDirty(false);
        },
        onError: () => toast.error("خطا در ذخیره‌سازی"),
      },
    );
  };

  return (
    <Card>
      <div className="flex flex-col gap-5">
        <p className="font-h3-bold text-error-500">پروفایل من</p>
        <Divider color="gray" size="thin" type="horizontal" />

        <div className="flex items-center gap-4">
          {preview ? (
            <img src={preview} alt="" className="h-20 w-20 rounded-full object-cover" />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-200">
              <UserRound className="h-8 w-8 text-gray-500" />
            </div>
          )}
          <div className="flex gap-2">
            <label className="cursor-pointer font-p2-medium text-error-500">
              {upload.isPending ? "در حال بارگذاری..." : "انتخاب تصویر"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={upload.isPending}
                onChange={(e) => {
                  onPickFile(e.target.files?.[0]);
                  e.target.value = "";
                }}
              />
            </label>
            {preview ? (
              <Button variant="text" size="small" color="error" onClick={onRemove}>
                حذف تصویر
              </Button>
            ) : null}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Input
            labelContent="نام"
            value={firstName}
            disabled={isLoading}
            onChange={(e) => {
              setIsDirty(true);
              setFirstName(e.target.value);
            }}
          />
          <Input
            labelContent="نام خانوادگی"
            value={lastName}
            disabled={isLoading}
            onChange={(e) => {
              setIsDirty(true);
              setLastName(e.target.value);
            }}
          />
        </div>

        <div className="flex justify-end">
          <Button
            color="error"
            disabled={isPending || isLoading || upload.isPending}
            isLoading={isPending}
            onClick={handleSubmit}
          >
            ذخیره
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default AdminProfileForm;
