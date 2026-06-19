const formatDateToYMD = (dt: Date): string => {
  const year = dt.getFullYear();
  const month = String(dt.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const day = String(dt.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default formatDateToYMD;
