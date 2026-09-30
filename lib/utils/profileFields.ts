import { EFormFieldType, IProfileField } from "@/lib/services/admin/type";

type ProfileSource = { profileData?: Record<string, unknown> } & object;

/** Builtins read their column off the profile; custom fields read `profileData`. */
export const profileValue = (profile: ProfileSource, field: IProfileField): unknown =>
  field.builtin
    ? (profile as Record<string, unknown>)[field.key] ?? null
    : profile.profileData?.[field.key] ?? null;

/** `{ key: value }` for every field — the form state the profile editors start from. */
export const profileValues = (profile: ProfileSource, fields: IProfileField[]) =>
  Object.fromEntries(fields.map((f) => [f.key, profileValue(profile, f) ?? ""]));

const isEmpty = (field: IProfileField, value: unknown) =>
  (field.type === EFormFieldType.BOOLEAN && value !== true) ||
  value === undefined ||
  value === null ||
  value === "" ||
  (Array.isArray(value) && value.length === 0);

/** Required fields the user has not filled in — what the completion drawer asks for. */
export const missingProfileFields = (profile: ProfileSource, fields: IProfileField[]) =>
  fields.filter((f) => f.required && isEmpty(f, profileValue(profile, f)));

/** The avatar has its own upload endpoint, so it never goes in the profile PATCH body. */
export const AVATAR_KEY = "avatar";
