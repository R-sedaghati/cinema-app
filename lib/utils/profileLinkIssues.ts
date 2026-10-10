import { EFormFieldType } from "../services/admin/type.ts";
import type { IFormField, IProfileField } from "../services/admin/type.ts";
import { matchesProfileKey } from "./profilePrefill.ts";

export type ProfileLinkIssueLevel = "error" | "warning" | "info";

export interface ProfileLinkIssue {
  level: ProfileLinkIssueLevel;
  message: string;
}

type LinkField = Pick<IFormField, "id" | "key" | "label" | "type" | "multiple" | "syncToUserField">;
type LinkProfileField = Pick<IProfileField, "key" | "label" | "type">;

const PHONE_TARGET = "phoneNumber";
const AVATAR_TARGET = "avatar";

/** Labels that read like account data an unwired field will leave empty. */
// ponytail: substring heuristic over Persian labels; extend the list when admins name fields differently
const PROFILE_LIKE_LABELS = ["نام", "ایمیل", "کد ملی", "موبایل", "تلفن", "تصویر پروفایل", "عکس پروفایل"];

/**
 * Problems with how one registration-form field is wired to the user's profile — what the
 * form-builder shows under the field so an admin sees why a form opens empty or why an
 * answer never reaches the account. `profileFields` = null while they are still loading.
 */
export const profileLinkIssues = (
  field: LinkField,
  allFields: LinkField[],
  profileFields: LinkProfileField[] | null,
): ProfileLinkIssue[] => {
  const issues: ProfileLinkIssue[] = [];
  const target = field.syncToUserField || null;
  const isImage = field.type === EFormFieldType.IMAGE;

  if (!target) {
    if (!profileFields) return issues;
    if (matchesProfileKey(field.key, profileFields.map((f) => f.key))) {
      issues.push({
        level: "info",
        message:
          "به پروفایل متصل نیست، ولی چون کلیدش با اطلاعات پروفایل یکی است، برای کاربر وارد‌شده به‌صورت قابل‌ویرایش پر می‌شود و پاسخ به پروفایل ذخیره نمی‌شود. برای قفل‌شدن و ذخیره در پروفایل، از «همگام‌سازی با پروفایل کاربر» متصلش کنید.",
      });
    } else if (PROFILE_LIKE_LABELS.some((word) => field.label.includes(word))) {
      issues.push({
        level: "warning",
        message:
          "به نظر می‌رسد این فیلد اطلاعات پروفایل را می‌پرسد، اما به پروفایل متصل نیست؛ برای کاربر وارد‌شده خالی باز می‌شود. اگر همان اطلاعات است، از «همگام‌سازی با پروفایل کاربر» متصلش کنید.",
      });
    }
    return issues;
  }

  if (target === PHONE_TARGET) {
    issues.push({
      level: "info",
      message: "شماره موبایل از حساب کاربر پر و قفل می‌شود و از فرم تغییر نمی‌کند (فقط با ورود پیامکی).",
    });
  } else if (profileFields) {
    const profileField = profileFields.find((f) => f.key === target);

    if (!profileField) {
      issues.push({
        level: "error",
        message: `فیلد پروفایل «${target}» وجود ندارد یا حذف شده است؛ این فیلد نه از پروفایل پر می‌شود و نه در آن ذخیره. اتصال را اصلاح یا حذف کنید.`,
      });
    } else if (target !== AVATAR_TARGET && profileField.type !== field.type) {
      issues.push({
        level: "warning",
        message: `نوع این فیلد با نوع فیلد پروفایل «${profileField.label}» یکی نیست؛ ممکن است مقدار پیش‌پر شده یا ذخیره‌شده درست نمایش داده نشود.`,
      });
    }
  }

  if (target === AVATAR_TARGET) {
    if (!isImage) {
      issues.push({
        level: "error",
        message: "عکس پروفایل فقط به فیلد از نوع تصویر وصل می‌شود؛ پاسخ این فیلد در پروفایل ذخیره نمی‌شود.",
      });
    } else if (field.multiple) {
      issues.push({
        level: "error",
        message: "فیلد چند فایلی نمی‌تواند عکس پروفایل باشد؛ «چند فایلی» را بردارید تا تصویر در پروفایل ذخیره شود.",
      });
    }
    issues.push({
      level: "info",
      message: "عکس پروفایل از حساب در فرم پر نمی‌شود؛ فقط تصویری که در فرم بارگذاری شود در پروفایل ذخیره می‌شود.",
    });
  } else if (isImage) {
    issues.push({
      level: "error",
      message: "فیلد تصویر فقط می‌تواند به عکس پروفایل وصل شود.",
    });
  }

  const duplicates = allFields.filter((f) => f.id !== field.id && f.syncToUserField === target);
  if (duplicates.length) {
    issues.push({
      level: "warning",
      message: `فیلدهای ${duplicates.map((f) => `«${f.label}»`).join("، ")} هم به همین فیلد پروفایل وصل‌اند؛ هر دو پیش‌پر می‌شوند و هنگام ثبت، آخرین پاسخ در پروفایل می‌ماند.`,
    });
  }

  return issues;
};
