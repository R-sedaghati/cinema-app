import type { IFormField, IProfileField } from "@/lib/services/admin/type";
import {
  profileLinkIssues,
  type ProfileLinkIssue,
  type ProfileLinkIssueLevel,
} from "@/lib/utils/profileLinkIssues";
import { AlertTriangle, Info, XCircle } from "lucide-react";

const STYLES: Record<ProfileLinkIssueLevel, { box: string; Icon: typeof Info }> = {
  error: { box: "bg-error-50 text-error-700 border-error-200", Icon: XCircle },
  warning: { box: "bg-warning-50 text-warning-700 border-warning-200", Icon: AlertTriangle },
  info: { box: "bg-gray-50 text-gray-600 border-gray-200", Icon: Info },
};

/** The profile-link problems of one form field, under its row in the builder. */
export function ProfileLinkNotice({ issues }: { issues: ProfileLinkIssue[] }) {
  if (!issues.length) return null;

  return (
    <ul className="flex flex-col gap-1">
      {issues.map(({ level, message }) => {
        const { box, Icon } = STYLES[level];
        return (
          <li
            key={message}
            className={`flex items-start gap-2 border border-solid rounded-md px-2 py-1.5 text-xs leading-6 ${box}`}
          >
            <Icon size={14} className="shrink-0 mt-1" />
            <span>{message}</span>
          </li>
        );
      })}
    </ul>
  );
}

/**
 * Top-of-builder guide: how profile links behave, plus a count of the problems found in
 * the field rows below so an admin does not have to scroll the whole form to find them.
 */
export function ProfileLinkSummary({
  fields,
  profileFields,
}: {
  fields: IFormField[];
  profileFields: IProfileField[] | null;
}) {
  const issues = fields.flatMap((f) =>
    profileLinkIssues(f, fields, profileFields).map((issue) => ({ ...issue, field: f })),
  );
  const errors = issues.filter((i) => i.level === "error");
  const warnings = issues.filter((i) => i.level === "warning");
  const linked = fields.filter((f) => f.syncToUserField).length;

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-solid border-gray-200 bg-white p-3 text-sm">
      <p className="font-p1-bold">
        اتصال به پروفایل کاربر — {linked} فیلد متصل
        {errors.length > 0 && <span className="text-error-600">، {errors.length} خطا</span>}
        {warnings.length > 0 && <span className="text-warning-600">، {warnings.length} هشدار</span>}
      </p>

      {[...errors, ...warnings].map(({ level, message, field }) => (
        <ProfileLinkNotice
          key={`${field.id}-${message}`}
          issues={[{ level, message: `«${field.label}»: ${message}` }]}
        />
      ))}

      <details className="text-xs leading-6 text-gray-600">
        <summary className="cursor-pointer">راهنمای اتصال فیلد به پروفایل</summary>
        <ul className="list-disc pr-5 mt-1 flex flex-col gap-1">
          <li>
            فیلدی که با «همگام‌سازی با پروفایل کاربر» متصل شود، برای کاربر وارد‌شده از پروفایلش پر
            می‌شود و اگر پروفایل مقدار داشته باشد، قفل (فقط‌خواندنی) نمایش داده می‌شود.
          </li>
          <li>با ثبت فرم، پاسخ غیرخالی فیلد متصل در پروفایل کاربر ذخیره می‌شود.</li>
          <li>اگر پروفایل کاربر آن مقدار را نداشته باشد، فیلد خالی و قابل‌ویرایش باز می‌شود.</li>
          <li>
            فیلد متصل‌نشده‌ای که کلیدش با اطلاعات پروفایل یکی است (مثل email، phone، fullName یا
            کلید یک فیلد پروفایل) فقط پیش‌پر و قابل‌ویرایش است و به پروفایل ذخیره نمی‌شود.
          </li>
          <li>شماره موبایل همیشه قفل است و عکس پروفایل هیچ‌وقت در فرم پیش‌پر نمی‌شود.</li>
          <li>فیلدهای پروفایل را از بخش «فیلدهای پروفایل» در پنل مدیریت تعریف کنید.</li>
        </ul>
      </details>
    </div>
  );
}
