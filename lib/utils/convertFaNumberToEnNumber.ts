function convertFaNumberToEnNumber(value: string): string {
  const persianNumbers = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  const englishNumbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

  let result = value;
  for (let i = 0; i < persianNumbers.length; i++) {
    result = result.replace(
      new RegExp(persianNumbers[i], "g"),
      englishNumbers[i],
    );
  }
  return result;
}

export default convertFaNumberToEnNumber;
