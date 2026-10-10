/** Profile targets backed by a `users` column; any other target is a custom profile key. */
const COLUMN_TARGETS = new Set(["firstName", "lastName", "email", "nationalCode"]);
const PHONE_KEYS = new Set(["phoneNumber", "phone_number", "phone", "mobile"]);
const FULL_NAME_KEYS = new Set(["fullName", "full_name", "name"]);

type PrefillProfile = {
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  nationalCode?: string | null;
  phone_number?: string | null;
  profileData?: Record<string, unknown> | null;
};

const isBlank = (value: unknown) =>
  value === undefined ||
  value === null ||
  value === "" ||
  (Array.isArray(value) && value.length === 0);

/**
 * The profile value a sync target — or, for an unwired field, its key — prefills from, or
 * `null` when there is nothing safe to prefill. `avatar` is deliberately excluded: the
 * profile exposes a presigned URL while an IMAGE answer holds the storage key, so
 * prefilling one would write the URL back into `avatar_path` on submit.
 */
export const profilePrefillValue = (profile: PrefillProfile, key: string): unknown => {
  if (key === "avatar") return null;

  let value: unknown;
  if (COLUMN_TARGETS.has(key)) value = profile[key as keyof PrefillProfile];
  else if (PHONE_KEYS.has(key)) value = profile.phone_number;
  else value = profile.profileData?.[key];

  // ponytail: key-name heuristic for forms built without a profile link; a custom
  // `fullName` profile field, when present, already won above.
  if (isBlank(value) && FULL_NAME_KEYS.has(key)) {
    value = [profile.firstName, profile.lastName].filter(Boolean).join(" ");
  }

  return isBlank(value) ? null : value;
};

export const isBlankAnswer = isBlank;

/**
 * Whether an unwired field with this key gets a key-matched prefill: a builtin column, a
 * phone or full-name alias, or one of the admin's custom profile keys.
 */
export const matchesProfileKey = (key: string, profileKeys: Iterable<string>) =>
  key !== "avatar" &&
  (COLUMN_TARGETS.has(key) ||
    PHONE_KEYS.has(key) ||
    FULL_NAME_KEYS.has(key) ||
    new Set(profileKeys).has(key));
