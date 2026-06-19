export const hasValidParams = (
  obj: Record<string, unknown>,
  excludedKeys: string[] = ["p", "count"],
): boolean => {
  return Object.keys(obj).some((key) => {
    if (excludedKeys.includes(key)) return false;

    const value = obj[key];

    if (value === null || value === undefined) return false;

    if (typeof value === "string" && value.trim() === "") return false;

    if (Array.isArray(value) && value.length === 0) return false;

    return true;
  });
};
