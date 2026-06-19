export function formatPhoneNumber(phone: string | number) {
  const stringPhoneNumber =
    typeof phone === "number" ? phone.toString() : phone;

  let numericValue = stringPhoneNumber.replace(/\D/g, "");
  if (numericValue.startsWith("98")) numericValue = "0" + numericValue.slice(2);

  if (numericValue.startsWith("0")) {
    if (numericValue.length >= 4) {
      return `0${numericValue.slice(1, 4)} ${numericValue.slice(
        4,
        7,
      )} ${numericValue.slice(7, 11)}`;
    }
  } else if (numericValue.length >= 3) {
    return `${numericValue.slice(0, 3)} ${numericValue.slice(
      3,
      6,
    )} ${numericValue.slice(6)}`;
  }

  return numericValue;
}
