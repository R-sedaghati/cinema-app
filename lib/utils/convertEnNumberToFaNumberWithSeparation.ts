const convertEnNumberToFaNumberWithSeparation = (
  value: number | string | null | undefined,
): string => {
  if (value === null || value === undefined) return "";

  // if it's already a number
  if (typeof value === "number") {
    return value.toLocaleString("fa-IR", { useGrouping: true });
  }

  // if it's a string but numeric → convert it
  const parsed = Number(value);
  if (!isNaN(parsed)) {
    return parsed.toLocaleString("fa-IR", { useGrouping: true });
  }

  // fallback for non-numeric strings
  return "";
};
export default convertEnNumberToFaNumberWithSeparation;
