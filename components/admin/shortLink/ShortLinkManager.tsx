"use client";

import {
  useAdminShortLinkDelete,
  useAdminShortLinkList,
  useAdminShortLinkSave,
} from "@/lib/services/admin/hook";
import { IShortLinkItem } from "@/lib/services/admin/type";
import Input from "@/components/common/Input";
import { Button, Card } from "@dgshahr/ui-kit";
import { Copy, Pencil, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { toast } from "react-toastify";

const EMPTY = { id: null as number | null, slug: "", targetUrl: "" };

export default function ShortLinkManager() {
  const { data } = useAdminShortLinkList();
  const { mutate: save, isPending: isSaving } = useAdminShortLinkSave();
  const { mutate: remove, isPending: isDeleting } = useAdminShortLinkDelete();
  const [form, setForm] = useState(EMPTY);

  const shortUrl = (slug: string) => `${window.location.origin}/${slug}`;

  const handleSubmit = () => {
    save(
      { ...form, slug: form.slug.trim().toLowerCase(), targetUrl: form.targetUrl.trim() },
      {
        onSuccess: () => {
          toast.success(form.id === null ? "لینک کوتاه ساخته شد" : "لینک کوتاه ویرایش شد");
          setForm(EMPTY);
        },
      },
    );
  };

  const handleCopy = (slug: string) => {
    navigator.clipboard
      .writeText(shortUrl(slug))
      .then(() => toast.success("لینک کپی شد"))
      .catch(() => toast.error("کپی لینک ممکن نشد"));
  };

  const handleEdit = (link: IShortLinkItem) =>
    setForm({ id: link.id, slug: link.slug, targetUrl: link.targetUrl });

  const handleDelete = (link: IShortLinkItem) => {
    remove(link.id, {
      onSuccess: () => {
        toast.success("لینک کوتاه حذف شد");
        if (form.id === link.id) setForm(EMPTY);
      },
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <Card className="flex flex-col gap-4 p-4">
        <div className="flex flex-col md:flex-row gap-3 items-end">
          <Input
            labelContent="نامک (slug)"
            placeholder="festival-2026"
            hintMessage="فقط حروف کوچک انگلیسی، عدد و خط تیره"
            wrapperClassName="w-full md:w-1/3"
            dir="ltr"
            value={form.slug}
            onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))}
          />
          <Input
            labelContent="آدرس مقصد"
            placeholder="https://example.com یا /artists/12"
            hintMessage="آدرس کامل با http(s) یا مسیری که با / شروع شود"
            wrapperClassName="w-full md:w-2/3"
            dir="ltr"
            value={form.targetUrl}
            onChange={(e) => setForm((prev) => ({ ...prev, targetUrl: e.target.value }))}
          />
        </div>
        <div className="flex justify-end gap-3">
          {form.id !== null && (
            <Button variant="outline" color="error" onClick={() => setForm(EMPTY)}>
              انصراف
            </Button>
          )}
          <Button
            isLoading={isSaving}
            disabled={isSaving || !form.slug.trim() || !form.targetUrl.trim()}
            onClick={handleSubmit}
          >
            {form.id === null ? "ساخت لینک کوتاه" : "ذخیره تغییرات"}
          </Button>
        </div>
      </Card>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-right text-gray-500 border-b">
              <th className="p-3">لینک کوتاه</th>
              <th className="p-3">مقصد</th>
              <th className="p-3" />
            </tr>
          </thead>
          <tbody>
            {data?.result?.map((link) => (
              <tr key={link.id} className="border-b">
                <td className="p-3" dir="ltr">/{link.slug}</td>
                <td className="p-3 max-w-md truncate" dir="ltr" title={link.targetUrl}>
                  {link.targetUrl}
                </td>
                <td className="p-3">
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" size="small" onClick={() => handleCopy(link.slug)} aria-label="کپی لینک">
                      <Copy size={18} />
                    </Button>
                    <Button variant="outline" size="small" onClick={() => handleEdit(link)} aria-label="ویرایش">
                      <Pencil size={18} />
                    </Button>
                    <Button
                      variant="outline"
                      color="error"
                      size="small"
                      disabled={isDeleting}
                      onClick={() => handleDelete(link)}
                      aria-label="حذف"
                    >
                      <Trash2 size={18} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {data && !data.result?.length && (
              <tr>
                <td colSpan={3} className="p-6 text-center text-gray-500">
                  هنوز لینک کوتاهی ساخته نشده است
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
