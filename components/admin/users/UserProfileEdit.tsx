"use client";

import { Button } from "@dgshahr/ui-kit";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import FieldRenderer from "@/components/artist-registration/fields/FieldRenderer";
import {
  useAdminProfileFields,
  useAdminUserDetail,
  useAdminUserUpdate,
} from "@/lib/services/admin/hook";
import { EFormFieldType } from "@/lib/services/admin/type";
import { profileValues } from "@/lib/utils/profileFields";

// ponytail: upload fields use the user's upload endpoint (user token), so the admin can't
// edit them here. Add an admin upload path to FieldRenderer if that's ever needed.
const UPLOAD_TYPES = new Set([EFormFieldType.IMAGE, EFormFieldType.VIDEO]);

/**
 * Editable inputs for every admin-configured profile field, hidden ones included. Renders
 * bare grid cells so it drops into the "اطلاعات کاربر" grid on both the user page and the
 * artist-request page.
 */
const UserProfileEdit = ({ userId }: { userId: number | undefined }) => {
  const user = useAdminUserDetail(userId).data?.result;
  const { data: fieldsData } = useAdminProfileFields();
  const { mutate, isPending } = useAdminUserUpdate(userId ?? 0);

  const fields = useMemo(
    () =>
      (fieldsData?.result ?? [])
        .filter((f) => !UPLOAD_TYPES.has(f.type))
        // hidden fields are still editable by the admin; the label says the user can't see it
        .map((f) => (f.hidden ? { ...f, label: `${f.label} (پنهان)` } : f)),
    [fieldsData],
  );

  const [form, setForm] = useState<Record<string, unknown>>({});

  useEffect(() => {
    if (user && fields.length) setForm(profileValues(user, fields));
  }, [user, fields]);

  return (
    <>
      {fields.map((field) => (
        <FieldRenderer
          key={field.key}
          // the admin may leave a required field empty; the user is asked for it instead
          field={{ ...field, required: false }}
          value={form[field.key]}
          onChange={(value) => setForm((f) => ({ ...f, [field.key]: value }))}
        />
      ))}
      <div className="flex items-end">
        <Button
          color="error"
          disabled={!userId || isPending}
          isLoading={isPending}
          onClick={() =>
            mutate(form, {
              onSuccess: () => toast.success("پروفایل کاربر ذخیره شد"),
              onError: (e) => toast.error(e.response?.data?.message ?? "خطا در ذخیره پروفایل"),
            })
          }
        >
          ذخیره پروفایل
        </Button>
      </div>
    </>
  );
};

export default UserProfileEdit;
