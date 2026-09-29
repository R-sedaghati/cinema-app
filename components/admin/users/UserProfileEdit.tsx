"use client";

import { Button } from "@dgshahr/ui-kit";
import Input from "@/components/common/Input";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAdminUserDetail, useAdminUserUpdate } from "@/lib/services/admin/hook";

/**
 * Editable name/email/national-code inputs for a user. Renders bare grid cells so it
 * drops into the "اطلاعات کاربر" grid on both the user page and the artist-request page.
 */
const UserProfileEdit = ({ userId }: { userId: number | undefined }) => {
  const user = useAdminUserDetail(userId).data?.result;
  const { mutate, isPending } = useAdminUserUpdate(userId ?? 0);

  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", nationalCode: "" });

  useEffect(() => {
    if (!user) return;
    setForm({
      firstName: user.firstName ?? "",
      lastName: user.lastName ?? "",
      email: user.email ?? "",
      nationalCode: user.nationalCode ?? "",
    });
  }, [user]);

  const field = (key: keyof typeof form, label: string) => (
    <Input
      placeholder={label}
      labelContent={label}
      value={form[key]}
      onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
    />
  );

  return (
    <>
      {field("firstName", "نام")}
      {field("lastName", "نام خانوادگی")}
      {field("email", "ایمیل")}
      {field("nationalCode", "کد ملی")}
      <div className="flex items-end">
        <Button
          color="error"
          disabled={!userId || isPending}
          isLoading={isPending}
          onClick={() =>
            mutate(
              {
                firstName: form.firstName.trim(),
                lastName: form.lastName.trim(),
                email: form.email.trim(),
                nationalCode: form.nationalCode.trim(),
              },
              {
                onSuccess: () => toast.success("پروفایل کاربر ذخیره شد"),
                onError: (e) =>
                  toast.error(e.response?.data?.message ?? "خطا در ذخیره پروفایل"),
              },
            )
          }
        >
          ذخیره پروفایل
        </Button>
      </div>
    </>
  );
};

export default UserProfileEdit;
